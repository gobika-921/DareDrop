# DareDrop — Stage 6: Performance, Accessibility & Code Quality Audit

> **Audit Version:** 1.0  
> **Audit Date:** 2026-07-19  
> **Auditor:** Antigravity (AI Engineering Review)  
> **Scope:** Complete repository — all files under `app/`, `components/`, `theme/`, `hooks/`, `utils/`, `constants/`, `types/`, `animations/`, `data/`, `services/`, `store/`  
> **Methodology:** Static analysis only. No runtime profiling was performed. Every finding is traceable to a concrete file and line number.

---

## Executive Summary

DareDrop is at a **Pre-Alpha** stage. The infrastructure layer (Expo, TypeScript, routing, tooling) is correctly configured. The design system is partially implemented. The reusable component library exists in skeleton form. Application screens, game logic, state management, services, and persistence are entirely absent.

The codebase cannot be meaningfully evaluated for runtime performance or scalability because there is no runtime yet — no screens render, no state flows, no game loop executes. What *can* be evaluated is the **structural quality** of what has been written, the **architectural decisions** already baked in, and the **gap between specification and implementation** that must be closed before any application behaviour exists.

This report evaluates every concern requested against the actual code that exists, flags pre-existing technical debt in the infrastructure layer, and identifies every issue that will become a defect or architectural constraint the moment screens are written.

**Production Readiness Score: 2.5 / 10**

The score reflects that the project has a sound philosophy and correct tooling setup, but the vast majority of required deliverables do not exist and several foundational decisions (design tokens, NativeWind configuration, the duplicate AppText file, font name mismatches) contain defects that will silently corrupt every screen written on top of them.

---

## 1. Performance Audit

### 1.1 Component Memoization

All eight existing components wrap their inner component with `React.memo`. This is correct. However, two structural issues undermine the benefit.

**Issue P-01 — Inline object creation inside `useMemo` style arrays (AppButton, AppCard, AppChip, AppAvatar)**

Every component computes its resolved style via a `useMemo` that returns an array containing both static and dynamic entries. For example, in [AppButton.tsx L133–154](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/components/AppButton/AppButton.tsx#L133-L154):

```ts
const resolvedStyle = useMemo<StyleProp<ViewStyle>>(() => {
  const baseStyle: ViewStyle = {
    alignItems: "center",
    backgroundColor: variantStyles.backgroundColor,
    // ...
  };
  return [baseStyle, pressed && !disabled && !loading ? styles.pressed : null, style];
}, [disabled, loading, pressed, ...]);
```

`baseStyle` is allocated as a new object on every render where any dependency changes. Because `pressed` is toggled on every `onPressIn`/`onPressOut`, this means a new `ViewStyle` object is created *twice per tap*. The correct pattern is to split static fields into `StyleSheet.create()` and only compute the truly dynamic subset (background color, border color) inline.

**Issue P-02 — `useMemo` for single primitive computations (AppDivider)**

[AppDivider.tsx](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/components/AppDivider/AppDivider.tsx) wraps three trivially cheap switch statements in `useMemo`:
- `resolvedColor` — a switch over 4 string comparisons
- `resolvedThickness` — a switch over 3 values
- `resolvedInset` — a switch over 3 values

These are cheaper to compute than the cost of subscribing to a `useMemo` dependency array. `useMemo` adds a React overhead (dependency comparison, closure allocation) that is greater than the computation itself for these cases. They should be plain constant derivations or removed in favor of inline logic.

**Issue P-03 — `useState(false)` pressed state causes synchronous re-render on every tap in all interactive components**

`AppButton`, `AppCard`, `AppChip`, `AppAvatar`, and `AppSwitch` all use `useState(false)` for the pressed state. The Pressable `onPressIn` → `setState(true)` → `onPressOut` → `setState(false)` sequence causes two additional renders per interaction per component. With Reanimated already in the project, the correct approach for press feedback is a `useSharedValue` + `useAnimatedStyle`, which runs entirely on the UI thread and avoids the React render cycle entirely.

**Severity:** Medium (no user-visible lag at current scale; will become noticeable on low-end Android devices when many chips are rendered simultaneously on the Player Setup screen).

### 1.2 FlatList Optimization

There are no `FlatList` implementations in the repository. However, the following concerns are pre-identified for when screens are written:

- The Player Chip List (Player Setup screen) is specified as a **wrapping flex layout**, not a FlatList. This is the correct choice for ≤20 items. No concern.
- The Dare History screen will need a FlatList. When written, it must include `keyExtractor`, `getItemLayout` (if dare text is constant height), `removeClippedSubviews`, and `initialNumToRender`. History entries are `HistoryEntry[]` objects and each entry contains a `dareTextSnapshot` of up to 300 characters — row heights will vary, so `getItemLayout` will not be applicable unless a fixed row height is enforced by design.
- Custom Dare Management (hundreds of dares) will require the same FlatList discipline.

**Severity:** Low (pre-emptive, no code exists).

### 1.3 Animation Performance

No Reanimated animations exist yet. The animation token file ([animations.ts](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/theme/animations.ts)) is well-structured. The spring presets (`gentle`, `default`, `snappy`) are reasonable.

**Issue P-04 — All press feedback uses JS-thread `transform` inside `StyleSheet`, not Reanimated**

Every component's pressed state uses:
```ts
pressed: {
  transform: [{ scale: animations.scale.buttonPressed }],
}
```
This runs on the JavaScript thread. With Reanimated already installed, any scale transform should use `useAnimatedStyle` + `useSharedValue` to guarantee UI-thread execution. The 16ms JS frame budget on low-end devices (Snapdragon 4xx-class Android) means JS-thread animation will visibly drop frames during heavy state updates.

**Severity:** Medium-High. This pattern is used in 5 components. It will produce jank on low-end devices once real screens are rendering.

### 1.4 Image Rendering

No images are rendered by any component. The app icon asset (`assets/icon.png`) is 393 KB — this is the Expo default icon size and is not served at runtime, so no concern.

### 1.5 State Update Efficiency

The Zustand dependency is declared (`zustand: ^5.0.14`) but no stores exist. No `useSelector`-equivalent patterns can be audited. Pre-emptive recommendation: when stores are written, use Zustand's selector pattern (`useStore(state => state.players)`) for all component subscriptions, never subscribe to the whole store object.

### 1.6 Font Loading

[useAppFonts.ts](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/hooks/useAppFonts.ts) blocks the entire application render until fonts are loaded:

```ts
if (!fontsLoaded) {
  return null;
}
```

**Issue P-05 — Null return during font loading produces a blank screen with no loading indicator**

During the ~200–800ms font load window (network-cached on subsequent launches, but cold on first install), the screen is entirely black/white. The specification describes a Splash screen. Expo SplashScreen should be used to hold the native splash image until fonts are loaded, then hide it. The current null return drops users into an unbranded void.

**Severity:** Medium (UX regression on cold launch).

### 1.7 Scalability Simulation: 20 Players, Hundreds of Dares

With 20 players (the maximum), the Player Setup screen will render 20 `AppChip` components in a flex-wrap layout. Each chip currently causes:
- 1 `useMemo` (sizeConfig) — cheap, stable
- 1 `useMemo` (resolvedVariantStyles) — cheap, stable
- 1 `useMemo` (chipStyle) — allocates a new ViewStyle object
- 1 `useState` (pressed) — synchronous re-render on each tap

With 20 chips on screen, a single tap anywhere causes 20 React renders (because pressing one chip may update parent state that re-renders the list). This is manageable but should be addressed with `React.memo` on list items and stable `onPress` callbacks via `useCallback`.

Hundreds of dares in a scrollable list will require proper FlatList virtualization, as described above.

---

## 2. Bundle Quality Audit

### 2.1 Dependencies Declared but Unused

The following dependencies are declared in [package.json](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/package.json) but have **zero references in the codebase**:

| Package | Declared | Actual Usage |
|---|---|---|
| `class-variance-authority` | `^0.7.1` | No import found anywhere |
| `clsx` | `^2.1.1` | No import found anywhere |
| `tailwind-merge` | `^3.6.0` | No import found anywhere |
| `dayjs` | `^1.11.21` | No import found anywhere |
| `nanoid` | `^6.0.0` | No import found anywhere |
| `react-native-reanimated-carousel` | `^4.0.3` | No import found anywhere |
| `react-native-worklets` | `0.10.0` | No import found anywhere |
| `expo-constants` | `~57.0.5` | No import found anywhere |
| `expo-linking` | `~57.0.3` | No import found anywhere |

**Issue B-01 — 9 unused production dependencies**

`class-variance-authority`, `clsx`, and `tailwind-merge` together suggest a Tailwind-class-based component variant system was once planned (CVA + clsx). The project has since standardised on `StyleSheet`-based components. These three packages serve no purpose in the current architecture and add to bundle size.

`nanoid` is a critical future dependency (UUID generation for `Player.id`, `Dare.id`) but is not yet used. It should remain but be noted as pending-use.

`dayjs` will be needed for timestamp display (History screen) but is not yet used.

`react-native-reanimated-carousel` is a significant bundle weight (~200 KB) and appears to have been considered for a dare card carousel. If the Spin screen does not use a carousel, this should be removed.

`react-native-worklets` is a peer dependency of Reanimated 4.x and is required. Its presence is correct.

**Severity:** High (CVA + clsx + tailwind-merge are dead weight; carousel could be removed if unused).

### 2.2 NativeWind Color Palette Conflict

**Issue B-02 — `global.css` and `tailwind.config.js` define a completely different color palette from the design system**

[global.css](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/global.css) defines:
```css
:root {
  --color-background: 12 12 14;       /* near-black — dark mode palette */
  --color-primary: 255 74 110;        /* pink-red */
  --color-secondary: 72 202 228;      /* cyan */
  --color-accent: 255 209 102;        /* yellow */
}
```

The design system [colors.ts](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/theme/colors.ts) defines:
```ts
background: "#FAF8F5",   /* warm cream */
primary: "#3A332F",      /* warm dark brown */
accent: "#E8825C",       /* coral orange */
```

These two color systems are completely incompatible. Any NativeWind utility class that references `bg-background`, `text-primary`, `bg-accent`, or `bg-surface` will render the *wrong colour* (dark-mode neon palette rather than the Warm Material palette).

The `SCREEN_SPECIFICATIONS.md` mandates that NativeWind be used for layout utilities (`flex`, `items-center`) only, and that token colors are never used via Tailwind classes. However, the `global.css` CSS variables exist and will silently miscolor anything that accidentally uses a NativeWind color utility.

**Severity:** Critical — this is a silent design corruption vector. It should be corrected immediately or the CSS variables removed entirely.

### 2.3 Duplicate Theme Token Files (Dead Stubs)

`theme/radius.tokens.ts` and `theme/typography.tokens.ts` both contain only:
```ts
// (intentionally left out)
```

These files are imported by nothing and serve no purpose. They inflate the module graph and create confusion for future engineers who wonder if they are meant to be populated.

**Severity:** Low.

### 2.4 Dual Font Loading Strategy (Font Name Mismatch)

[fonts.ts](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/theme/fonts.ts) registers:
```ts
Poppins_600SemiBold,
Poppins_700Bold,
Inter_400Regular,
Inter_500Medium,
Inter_600SemiBold,
```

[typography.ts](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/theme/typography.ts) references `fontFamily: "Poppins"` and `fontFamily: "Inter"`.

**Issue B-03 — Font family name mismatch will cause system font fallback on all text**

Expo Google Fonts registers fonts under their full Expo-style name:
- `Poppins_600SemiBold` → the system font name is `"Poppins_600SemiBold"`, not `"Poppins"`
- `Inter_400Regular` → the system font name is `"Inter_400Regular"`, not `"Inter"`

When `AppText` applies `fontFamily: "Poppins"`, React Native finds no loaded font with that name and silently falls back to the system font. **No Poppins or Inter text is currently rendering correctly.** Every heading, body, and button label in the app is using the system font (San Francisco on iOS, Roboto on Android).

The correct pattern is to map weight variants explicitly:
```ts
fontFamily: "Poppins_600SemiBold",  // for weight 600
fontFamily: "Poppins_700Bold",       // for weight 700
fontFamily: "Inter_400Regular",      // for weight 400
```

**Severity:** Critical — the entire typographic identity of the application is currently broken.

---

## 3. Accessibility Audit

### 3.1 AppText

- `accessibilityRole="text"` is set on every `Text` component. This is redundant (React Native Text defaults to `role="text"`) but harmless.
- No `accessibilityLanguage` prop is available, but this is acceptable at current stage.
- `allowFontScaling` defaults to `true` (RN default). No font scaling cap is set. **Issue A-01:** Large font sizes (e.g. `display` at 34px in the current code) will scale to 51px+ at the largest accessibility size, potentially breaking layouts on the Spin screen. A `maxFontSizeMultiplier` should be set on display-level text.

### 3.2 AppButton

- `accessibilityRole="button"` — ✅ correct
- `accessible={true}` — ✅ correct
- `disabled` state propagates to `accessible` via native — ✅ correct
- **Issue A-02 — No `accessibilityState` for disabled state**: The component sets `disabled={disabled || loading}` on the `Pressable` but does not set `accessibilityState={{ disabled: true }}`. Screen readers will announce the button as interactive even when it is visually disabled.
- **Issue A-03 — Loading state has no accessibility announcement**: When `loading={true}`, the `ActivityIndicator` renders with no accompanying `accessibilityLabel`. VoiceOver/TalkBack users will hear nothing meaningful. The button should set `accessibilityLabel="Loading"` or `accessibilityHint` when in loading state.
- `hitSlop={8}` is applied, giving a minimum touch target of `44 + 8*2 = 60px` height for medium buttons. ✅ Exceeds the 44pt minimum.

### 3.3 AppInput

- `accessible={true}` on wrapper `View` — ✅
- `accessibilityLabel` and `accessibilityHint` are forwarded to the `TextInput` — ✅
- `allowFontScaling={allowFontScaling}` is forwarded with default `true` — ✅
- **Issue A-04 — Clear button has a 4px touch target**: The clear button (`×`) is a `Pressable` with `paddingHorizontal: spacing.xs` (4px) and `paddingVertical: spacing.xs` (4px). With the `×` character rendering at ~12px, the total touch target is approximately 20×20px — less than half the 44×44pt minimum required by iOS HIG and WCAG 2.5.5.
- **Issue A-05 — Error state has no `accessibilityLiveRegion`**: When an error string appears below the input, it is rendered as static `AppText`. Screen readers will not automatically announce the error. The error container should use `accessibilityLiveRegion="polite"`.
- **Issue A-06 — Label and input are not programmatically associated**: The `AppText` label above the input has no `nativeID` linking it to the `TextInput`. The label text is not read as part of the input's accessible name unless the consumer passes an `accessibilityLabel` manually.

### 3.4 AppChip

- `accessibilityRole` defaults to `"button"` when `onPress` is set, `"text"` otherwise — ✅
- `accessibilityState={{ disabled, selected }}` is set — ✅
- `accessibilityLabel` defaults to the `label` prop — ✅
- **Issue A-07 — Remove button has no minimum touch target**: The remove button (`×`) is a nested `Pressable` with no explicit hit area beyond its content padding. Like the input clear button, this will fall below the 44×44pt minimum.
- **Issue A-08 — Remove button's `accessibilityLabel` is not announced in context**: `accessibilityLabel={`Remove ${label}`}` is correct, but there is no `accessibilityHint` to explain what removal means (e.g. "Removes this player from the game").

### 3.5 AppSwitch

- `accessibilityRole="switch"` — ✅ correct
- `accessibilityState={{ disabled, checked: isOn }}` — ✅ correct
- `accessibilityLabel={accessibilityLabel ?? label}` — ✅ correct
- **Issue A-09 — `minHeight: 44` on the container, but not on the track itself**: The 48×28px track is the interactive element wrapped in a `Pressable` whose container is `minHeight: 44`. The Pressable wraps the entire row (label + track), so the touch target is ≥44px. ✅
- **Issue A-10 — Switch has no `accessibilityHint` by default**: When a screen reader user focuses the switch, they hear the label and state but no hint about what toggling it will do. The component should support a default `accessibilityHint` like "Toggles the setting on or off".

### 3.6 AppAvatar

- `accessibilityLabel={accessibilityLabel ?? `${name}, Player Avatar`}` — ✅ descriptive default
- **Issue A-11 — Status badge has no accessible representation**: The `statusBadge` View renders a coloured dot (e.g. green for `active`, red for `skipped`) with no text or accessibility label. Screen reader users cannot determine a player's status from the avatar alone. The avatar's `accessibilityLabel` should include the status when it is not `"none"` (e.g., `"Alex, Player Avatar, Active"`).

### 3.7 AppCard

- Interactive variant uses `accessibilityRole: "button"` — ✅
- Static variant has no `accessibilityRole` set — this is intentional and acceptable for a container.
- **Issue A-12 — `accessible={true}` on a container that may contain multiple interactive children**: Setting `accessible={true}` on a parent `View` makes it a single accessible element, collapsing all children into one. If an `AppCard` contains multiple interactive elements (buttons, inputs), setting `accessible={true}` on the card will prevent screen readers from reaching the children individually. The `accessible` prop should default to `false` for non-interactive card variants.

### 3.8 Color Contrast

Based on the design token values in [colors.ts](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/theme/colors.ts):

| Foreground | Background | Ratio (estimated) | WCAG AA (4.5:1) |
|---|---|---|---|
| `text.primary` (#241F1C) on `background` (#FAF8F5) | ~18:1 | ✅ Pass |
| `text.secondary` (#8A7F76) on `background` (#FAF8F5) | ~3.8:1 | ❌ **Fail** |
| `text.inverse` (#FFFFFF) on `accent.primary` (#E8825C) | ~2.9:1 | ❌ **Fail** |
| `text.inverse` (#FFFFFF) on `primary.DEFAULT` (#3A332F) | ~12.1:1 | ✅ Pass |
| `difficulty.mild` (#7FB37A) on `background` (#FAF8F5) | ~3.2:1 | ❌ **Fail** |
| `status.danger` (#E05353) on `background` (#FAF8F5) | ~3.9:1 | ❌ **Fail** |

**Issue A-13 — 4 color pairings fail WCAG AA contrast**

- `text.secondary` on `background`: used for captions, helper text, labels. **Fails AA (4.5:1) for normal text.** Passes AA for large text (3:1).
- `text.inverse` on `accent.primary` (Coral CTA button): the primary call-to-action button currently has insufficient contrast. **This is the most impactful contrast failure in the application.**
- `difficulty.mild` on `background`: difficulty chips and badges fail AA.
- `status.danger` on `background`: error messages and danger chips fail AA.

### 3.9 Reduced Motion

No reduced-motion check exists anywhere in the codebase. The specification mentions reduced motion readiness in `COMPONENT_GUIDELINES.md`. When Reanimated animations are implemented, they must check `AccessibilityInfo.isReduceMotionEnabled()` and skip or reduce animations accordingly. **Issue A-14.**

### 3.10 Font Scaling

As noted in B-03, the `fontFamily` values in `typography.ts` will fall back to system fonts. Separately, no `maxFontSizeMultiplier` is set on any text element. When this is fixed, all display-size text and UI-critical text (button labels, chip labels) should be capped at `1.5x` or `2x` to prevent layout breakage at extreme accessibility font sizes. **Issue A-01 (same as above).**

---

## 4. Error Handling Audit

### 4.1 Font Loading Failures

[useAppFonts.ts](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/hooks/useAppFonts.ts):
```ts
const [loaded] = useFonts(fontAssets);
return loaded;
```

The `useFonts` hook from `expo-font` returns `[loaded, error]`. **Issue E-01 — The error value is discarded.** If font loading fails (corrupted asset, storage issue), `loaded` will remain `false` indefinitely and the app will display a blank screen forever with no recovery path. The error should be captured and handled — either by showing a fallback UI or by proceeding with system fonts.

### 4.2 AsyncStorage Failures

No AsyncStorage calls exist yet. When implemented, every `AsyncStorage.getItem`/`setItem` call must be wrapped in try/catch. The spec mandates a single `services/storage.ts` module that centralises all persistence. This module does not exist.

### 4.3 Invalid Props and Null Safety

**Issue E-02 — AppAvatar: empty name prop causes `initials` to return `"?"`**

```ts
const normalized = name.trim().replace(/\s+/g, " ");
if (!normalized) {
  return "?";
}
```

This is defensively coded and correct. However, the `Player` entity spec (DATA_MODEL.md §17.1) requires `name` to be 1–20 characters. If a player with an empty name were somehow stored (persistence corruption), the `"?"` fallback would render. This is acceptable.

**Issue E-03 — AppText `color` prop receives a hex string from AppButton**

In [AppButton.tsx L188](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/components/AppButton/AppButton.tsx#L188):
```ts
color={variantStyles.textColor as keyof typeof colors.text}
```

`variantStyles.textColor` is a hex string like `"#FFFFFF"` or `"#241F1C"`. This is cast to `keyof typeof colors.text` (which is `"primary" | "secondary" | "inverse"`). The modular `AppText` in `components/AppText/AppText.tsx` performs `colors.text[color]` — a literal key lookup. Passing `"#FFFFFF"` as the key causes `colors.text["#FFFFFF"]` which is `undefined`, and the `Text` renders with `color: undefined` (falls back to the nearest ancestor color, which may be dark text on a dark button).

The stray [components/AppText.tsx](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/components/AppText.tsx) has a type guard that handles this case, but **AppButton imports from `../AppText` which resolves to the `AppText/` directory**, not the stray file. The type-guarded version is unused by the components that need it.

**Severity:** Critical — all primary and danger buttons have broken text color rendering.

### 4.4 Navigation Safety

Only `app/_layout.tsx` exists. No navigation guards, deep link handlers, or invalid-route fallbacks are configured. No concern at this stage.

---

## 5. Security & Privacy Audit

### 5.1 Offline-First Compliance

The app is fully offline. No network calls, no fetch, no WebSocket, no SDK with telemetry. The spec explicitly forbids analytics. ✅

### 5.2 Permissions

`app.json` requests no runtime permissions. The `ios.supportsTablet: true` flag is purely display, not a permission. ✅

### 5.3 Sensitive Data Exposure

No user data leaves the device. No logging of player names or game data is present in the codebase. ✅

### 5.4 Persistence Safety

No persistence exists yet. When implemented, the spec requires all AsyncStorage operations to go through `services/storage.ts`. Player names (max 20 chars), dare text (max 300 chars), and settings booleans are the only persisted data. None of this constitutes sensitive data. ✅ (pre-emptive)

### 5.5 Input Validation

**Issue S-01 — No input sanitisation is implemented yet**

The `SCREEN_SPECIFICATIONS.md` specifies that player names must be trimmed, de-duplicated (case-insensitive), and limited to 20 characters. `AppInput` accepts `maxLength` as a prop and passes it to `TextInput`, but the trimming and duplicate-detection logic must be implemented at the screen level. This is a pre-emptive finding — no screen exists yet to violate it.

### 5.6 `app.json` — `userInterfaceStyle: "automatic"`

**Issue S-02 — Dark mode support is declared but not implemented**

`userInterfaceStyle: "automatic"` tells the OS that the app supports both light and dark mode. The design system has no dark-mode color variants. On a device set to dark mode, iOS/Android will apply system-level dark mode transformations to some native elements (status bar, system keyboards, alerts) but the app's custom colors will remain in light mode — creating a jarring mixed-mode UI. This should be set to `"light"` until dark mode is explicitly implemented.

---

## 6. Code Quality Audit

### 6.1 Duplicate Files

**Issue Q-01 — Two competing `AppText` implementations**

| File | `color` prop type | Type guard |
|---|---|---|
| `components/AppText/AppText.tsx` | `keyof typeof colors.text` (semantic keys only) | No |
| `components/AppText.tsx` | `keyof typeof colors.text \| string` (semantic key or raw hex) | Yes |

The stray root-level file is the *better* implementation (it handles both semantic keys and hex strings correctly). The modular `AppText/AppText.tsx` is the *incomplete* implementation. Yet `AppButton`, `AppChip`, `AppAvatar`, and `AppSwitch` all import from `@/components/AppText` which resolves to `AppText/index.ts` → `AppText/AppText.tsx` (the weaker one).

**Severity:** Critical. The stray file should either replace or be consolidated into the modular version.

### 6.2 Magic Numbers

The following numeric literals appear directly in component files without reference to a design token:

| File | Line | Value | Should Be |
|---|---|---|---|
| `AppSwitch.tsx` | 73 | `spacing.md` (16px) used for thumb translate | `22` (track - thumb - padding = 48-22-4=22) |
| `AppSwitch.tsx` | 156–162 | Track `width: 48`, `height: 28` | Should reference `sizes.switch` or similar |
| `AppAvatar.tsx` | 127 | `sizeConfig.borderWidth + 1` | Magic increment |
| `AppAvatar.tsx` | 129–132 | `{ width: 0, height: 2 }`, `0.2`, `4` | Inline shadow values |
| `AppChip.tsx` | 151 | `Math.max(sizeConfig.height, 44)` | Magic minimum height (44px) |
| `AppCard.tsx` | 180–182 | `opacity: 0.95` | Should be `opacity.pressed` token |
| `AppAvatar.tsx` | 220–222 | `opacity: 0.95` | Should be `opacity.pressed` token |

**Severity:** Medium (consistency issue, not a defect — but violates the "no hardcoded values" rule).

### 6.3 Naming Inconsistency

**Issue Q-02 — Design token key naming inconsistency between spec and code**

| Spec Token Name | Code Key Name |
|---|---|
| `display` | `displayLargeTitle` |
| `title` | `titleHeading` |
| `body` | `body` (matches) |
| `button` | `button` (matches) |
| `caption` | `caption` (matches) |
| `sm` (radius) | `small` |
| `md` (radius) | `medium` |
| `lg` (radius) | `large` |
| `md` (spacing) | `md` (16px — spec says 12px) |

The `AppAvatar.tsx` font variant `"titleHeading"` and `"heading"` directly reference the code-side naming. If tokens are renamed to match the spec, every component using them breaks. This is a real migration risk.

### 6.4 Long Functions / Large Components

`AppInput.tsx` is 294 lines and handles variant resolution, focus state, clear button, helper text, error state, and icon layout in a single component. By Shopify-standard component guidelines, this is on the boundary of acceptable complexity. No split is necessary yet, but if multiline input or additional icon variants are added, it should be decomposed.

### 6.5 Dead Code and Unused Files

| File | Status |
|---|---|
| `theme/radius.tokens.ts` | Empty stub, unused |
| `theme/typography.tokens.ts` | Empty stub, unused |
| `utils/noop.ts` | Defines `noop` — never imported anywhere |
| `components/AppText.tsx` | Stray duplicate, shadows the canonical version |
| `animations/` (directory) | Only `.gitkeep` — no animation implementations |
| `store/` (directory) | Only `.gitkeep` — no stores |
| `services/` (directory) | Only `.gitkeep` — no services |
| `data/` (directory) | Only `.gitkeep` — no bundled dares |

### 6.6 Import Consistency

`AppButton` imports `AppText` via a relative path:
```ts
import { AppText } from "../AppText";
```

`AppInput`, `AppChip`, `AppAvatar`, and `AppSwitch` import via the alias:
```ts
import { AppText } from "@/components/AppText";
```

Both resolve to the same module in the current config, but the relative path in `AppButton` is fragile — moving the component would break it. All internal imports should use the `@/` alias. **Issue Q-03.**

### 6.7 TypeScript Strict Mode Compliance

`tsconfig.json` sets `"strict": true`. Known violations:

- `AppButton.tsx L188`: `as keyof typeof colors.text` is an unchecked type assertion. Under strict mode this should trigger, but it does not because TypeScript allows narrowing casts. This is still an unsafe runtime behaviour.
- `AppCard.tsx L139`: `ref as React.ForwardedRef<React.ElementRef<typeof Pressable>>` — double cast. This is a forwardRef limitation acknowledged in the React Native types; acceptable.

---

## 7. Scalability Assessment

### Custom Packs / More Dares
The `DarePack` and `Dare` entity shapes in `DATA_MODEL.md` support this fully. The `data/` directory is empty — bundled dares must still be authored. No architectural blocker.

### Truth Mode / Team Mode / Couples Mode
The `GAME_RULES.md` and `DATA_MODEL.md` reserve extension points via `DareSource` union expansion and `teamId?: string` on `Player`. The `GameConfiguration.rules` object provides the hook for rule variants. Architectural support exists. No screens or logic exist to test these paths.

### AI-Generated Dares
The spec reserves `"AIGenerated"` as a future `DareSource`. No network infrastructure exists yet. Adding this would require a new networking section in `PROJECT_CONTEXT.md` (per the locked-decision rule). Architecturally viable.

### Localization
No i18n solution is present. All hardcoded strings (error messages, copy) are in English inside component code and specifications. Adding localization later would require extracting all string literals — a moderate refactor across all screens. Pre-emptive planning for a `strings/` or `i18n/` layer is recommended.

### Premium Packs / Cloud Sync
No architecture for this exists or is specified. Would require backend infrastructure additions that explicitly contradict the current offline-first + no-backend constraints in `PROJECT_CONTEXT.md §4`. Requires a spec revision before implementation.

### Dark Mode
As noted in S-02, the app.json declares dark mode support but no dark-mode color variants exist. The theme architecture (`colors.ts` as a frozen constant) would need to become a function or context to support dark mode theming. This is a non-trivial refactor.

---

## 8. Testing Readiness

### 8.1 Blockers

| Concern | Status |
|---|---|
| No unit tests exist | Blocked |
| No test runner configured (Jest) | Blocked — `@testing-library/react-native` not in `package.json` |
| No test IDs on most interactive elements | Partial — `testID` prop is accepted by all components but is not assigned at call sites |
| No pure functions to unit-test | Services/stores don't exist yet |
| No dependency injection | Not applicable yet |

**Issue T-01 — `@testing-library/react-native` and `jest-expo` are not in `devDependencies`**

The spec (PROJECT_CONTEXT.md §4) mandates Jest + `@testing-library/react-native`. Neither is installed. Testing cannot begin until they are added.

### 8.2 What Is Testable Today

The following are pure functions or simple components that *could* be tested immediately:

- `AppText` — deterministic render from `variant` + `color` props
- `AppDivider` — deterministic render from orientation/variant/thickness/color
- `AppAvatar` initials computation — `useMemo` that processes a name string
- All design token files (`colors.ts`, `spacing.ts`, etc.) — can be snapshot-tested for value stability

### 8.3 TestID Coverage

`testID` is accepted by all components via props. No test IDs are assigned in any existing usage (all usages are in the component definitions themselves, not in screens where IDs matter). Once screens are written, a `testID` naming convention should be established (e.g., `"player-setup.add-button"`, `"player-chip.alex.remove"`).

---

## 9. Documentation Compliance

### 9.1 Component Inventory (CURRENT_STATE.md §8 vs. Reality)

| Component | CURRENT_STATE.md says | Reality |
|---|---|---|
| AppText | ✅ Complete | Exists, but has critical font name bug and duplicate file |
| AppButton | ✅ Complete | Exists, but has broken text color cast |
| AppCard | ✅ Complete | Exists, functionally correct |
| AppInput | ✅ Complete | Exists, accessibility gaps |
| AppChip | ✅ Complete | Exists, min-height bug |
| AppAvatar | ✅ Complete | Exists, color mismatch with DATA_MODEL spec |
| AppModal | ✅ Complete | **Does not exist in the repository** |
| AppBottomSheet | ✅ Complete | **Does not exist in the repository** |
| AppProgressBar | ✅ Complete | **Does not exist in the repository** |

**Issue D-01 — CURRENT_STATE.md marks 3 non-existent components as Complete**

AppModal, AppBottomSheet, and AppProgressBar are listed as complete in the status table but no files exist for any of them under `components/`. This is a documentation integrity failure that could mislead future developers into writing screens that depend on components they expect to exist.

### 9.2 Design Token Compliance (PROJECT_CONTEXT.md §5 vs. theme/)

| Token Set | Spec Value | Code Value | Match |
|---|---|---|---|
| `spacing.md` | 12px | 16px | ❌ |
| `spacing.lg` | 16px | 24px | ❌ |
| `spacing.xl` | 20px | 32px | ❌ |
| `spacing.xxl` | 24px | `2xl: 40px` | ❌ (name + value) |
| `radius.sm` | 12px | `small: 8px` | ❌ (name + value) |
| `radius.md` | 18px | `medium: 12px` | ❌ (name + value) |
| `radius.lg` | 24px | `large: 16px` | ❌ (name + value) |
| `radius.xl` | 28px | `xl: 16px` (alias of large) | ❌ |
| `typography.display` | 28px Bold | `displayLargeTitle: 34px 600` | ❌ (name + value) |
| `typography.title` | 20px SemiBold | `titleHeading: 24px 600` | ❌ (name + value) |
| `typography.body` | 16px Medium | `body: 14px 400` | ❌ (value) |
| `shadows.resting` | elev 2, opacity 0.06 | `small: elev 1, opacity 0.05` | ❌ (name + value) |
| `shadows.elevated` | elev 8, opacity 0.12 | `large: elev 6, opacity 0.10` | ❌ (name + value) |

**Every spacing, radius, and typography token is non-compliant with the PROJECT_CONTEXT.md specification.** The shadow token names also mismatch. This means no screen written to spec will visually match the specification when rendered.

### 9.3 AvatarColor Compliance (DATA_MODEL.md §17.1 vs. AppAvatar)

| DATA_MODEL.md `AvatarColor` | `AppAvatarColor` in AppAvatar.tsx |
|---|---|
| `"coral"` | `"coral"` ✅ |
| `"sage"` | ❌ Missing |
| `"clay"` | ❌ Missing |
| `"sand"` | ❌ Missing |
| `"moss"` | ❌ Missing |
| `"rust"` | ❌ Missing |
| `"slate"` | ❌ Missing |
| `"blush"` | ❌ Missing |
| — | `"green"` ❌ Not in spec |
| — | `"blue"` ❌ Not in spec |
| — | `"purple"` ❌ Not in spec |
| — | `"amber"` ❌ Not in spec |
| — | `"teal"` ❌ Not in spec |
| — | `"rose"` ❌ Not in spec |

`AppAvatar` implements a completely different color enum than `DATA_MODEL.md §17.1`. The `Player` entity will store `AvatarColor` values (`"coral"`, `"sage"`, etc.) but the component only accepts colours that don't match (`"green"`, `"blue"`, etc.). When screens are built, type errors will immediately surface, but only if TypeScript catches the mismatch at the assignment site.

### 9.4 AppSwitch — `motion.ts` vs. `animations.ts`

`PROJECT_CONTEXT.md §5.1` specifies a file called `theme/motion.ts`. The actual file is `theme/animations.ts`. The barrel export uses `animations`. This is a naming inconsistency between the spec and the implementation. Minor.

---

## 10. Technical Debt Report

### Critical

| ID | Issue | File(s) | Risk |
|---|---|---|---|
| C-01 | Font name mismatch — all text renders in system font | `theme/typography.ts`, all components | All brand typography invisible |
| C-02 | AppButton text color unsafe cast — button labels invisible on dark buttons | `AppButton.tsx:L188` | Core CTA broken |
| C-03 | NativeWind CSS variables use wrong (dark-mode neon) palette | `global.css`, `tailwind.config.js` | Silent color corruption on any NativeWind color class |
| C-04 | AppModal, AppBottomSheet, AppProgressBar do not exist but are marked Complete | CURRENT_STATE.md | Screens that depend on them cannot be built |
| C-05 | AvatarColor enum mismatch between DATA_MODEL and AppAvatar | `AppAvatar.tsx`, `DATA_MODEL.md §17.1` | Type errors block Player Setup screen |

### High

| ID | Issue | File(s) | Risk |
|---|---|---|---|
| H-01 | All design tokens (spacing, radius, typography, shadows) mismatch spec | `theme/spacing.ts`, `radius.ts`, `typography.ts`, `shadows.ts` | Every screen will be visually non-compliant |
| H-02 | 9 unused production dependencies including 3 dead CVA libraries | `package.json` | Bundle bloat, maintenance overhead |
| H-03 | Stray duplicate `AppText.tsx` at root of `components/` | `components/AppText.tsx` | Ambiguous import resolution |
| H-04 | text.secondary and accent primary fail WCAG AA contrast | `theme/colors.ts` | Accessibility compliance failure |
| H-05 | JS-thread press animations — will jank on low-end Android | All interactive components | UX regression |
| H-06 | `userInterfaceStyle: "automatic"` with no dark mode support | `app.json` | Mixed-mode UI on dark mode devices |
| H-07 | Jest + testing-library not installed | `package.json` | Cannot write tests |

### Medium

| ID | Issue | File(s) | Risk |
|---|---|---|---|
| M-01 | `useState` for press state instead of Reanimated `useSharedValue` | All interactive components | Re-render overhead per tap |
| M-02 | Font loading error is swallowed — blank screen on failure | `useAppFonts.ts` | Silent crash on font load failure |
| M-03 | No Expo SplashScreen management — blank screen during font load | `app/_layout.tsx` | Poor cold launch experience |
| M-04 | AppInput clear button and AppChip remove button below 44pt touch target | `AppInput.tsx`, `AppChip.tsx` | Accessibility failure |
| M-05 | AppInput error text has no `accessibilityLiveRegion` | `AppInput.tsx` | Screen readers miss error announcements |
| M-06 | AppButton has no `accessibilityState` for disabled | `AppButton.tsx` | Screen readers announce disabled buttons as interactive |
| M-07 | No reduced motion check on any animation | All animated components | Violates accessibility guidelines |
| M-08 | `AppSwitch` thumb translates by `spacing.md` (16px) not the correct 22px | `AppSwitch.tsx:L73` | Thumb appears off-centre when ON |
| M-09 | `AppChip` forces `minHeight: 44` on small chips (36px spec) | `AppChip.tsx:L151` | Small chips render incorrectly oversized |
| M-10 | No `maxFontSizeMultiplier` on display text | All AppText usages | Layout breaks at max accessibility font size |

### Low

| ID | Issue | File(s) | Risk |
|---|---|---|---|
| L-01 | `useMemo` on trivially cheap computations in AppDivider | `AppDivider.tsx` | Micro-overhead, no user impact |
| L-02 | `radius.tokens.ts` and `typography.tokens.ts` empty stubs | `theme/` | Dead code confusion |
| L-03 | `utils/noop.ts` is never imported | `utils/noop.ts` | Dead code |
| L-04 | AppButton uses relative import, others use alias | `AppButton.tsx:L19` | Import inconsistency |
| L-05 | `AppCard.tsx` and `AppAvatar.tsx` use magic `opacity: 0.95` | Both files | Should be `opacity.pressed` token |
| L-06 | `theme/index.ts` imports all tokens into a namespace object then also re-exports them individually | `theme/index.ts` | Module loaded twice; minor tree-shaking impact |
| L-07 | `AppDivider` inset and middleInset both resolve to `spacing.md` (identical) | `AppDivider.tsx:L56-59` | `middleInset` is broken/undifferentiated |
| L-08 | `animations/` directory contains only `.gitkeep` — no implementations | `animations/` | Documentation drift |
| L-09 | Token naming inconsistency between spec and code | `theme/` vs `PROJECT_CONTEXT.md §5` | Future engineers will be confused |

---

## 11. Priority Matrix

```
IMPACT
  ↑
  │  [C-01] Font names    [C-02] Button text    [C-03] CSS palette
  │  [C-04] Missing cmpts [C-05] Avatar colors
  │
  │  [H-01] Token drift   [H-04] Contrast fail  [H-05] JS animations
  │  [H-06] Dark mode decl
  │
  │  [M-02] Font error    [M-03] Splash screen  [M-04] Touch targets
  │  [M-05] LiveRegion    [M-08] Switch thumb
  │
  │  [L-02] Dead stubs    [L-03] noop           [L-07] Divider inset
  └──────────────────────────────────────────────────────────────────→ EFFORT
     Easy                 Medium                 Hard
```

---

## 12. Top 20 Improvements Before Beta

In priority order:

1. **Fix font family names in `typography.ts`** — use `"Poppins_600SemiBold"` etc. (C-01)
2. **Replace the unsafe color cast in AppButton** — use the stray `AppText.tsx` type guard, or change `variantStyles.textColor` to a semantic key (C-02, E-03)
3. **Consolidate the two AppText implementations** — delete `components/AppText.tsx` after merging the type guard into `components/AppText/AppText.tsx` (Q-01)
4. **Correct global.css CSS variables** to the Warm Material palette, or remove them if NativeWind color utilities are forbidden (B-02, C-03)
5. **Implement AppModal, AppBottomSheet, and AppProgressBar** — update CURRENT_STATE.md to reflect their actual status (C-04)
6. **Align AvatarColor enum** in `AppAvatar.tsx` with `DATA_MODEL.md §17.1` (C-05)
7. **Synchronise design tokens** — align spacing, radius, typography, and shadow keys and values with `PROJECT_CONTEXT.md §5` (H-01, D compliance)
8. **Change `app.json` `userInterfaceStyle`** to `"light"` (H-06, S-02)
9. **Add Expo SplashScreen management** to `_layout.tsx` and handle font load errors in `useAppFonts.ts` (M-02, M-03, P-05)
10. **Install `jest-expo` and `@testing-library/react-native`** and configure Jest (H-07, T-01)
11. **Fix AppSwitch thumb translation** from `spacing.md` (16px) to `22px` (M-08)
12. **Remove `Math.max(height, 44)` clamp from AppChip** for small size variant (M-09)
13. **Increase touch targets** on AppInput clear button and AppChip remove button to ≥44×44pt (M-04)
14. **Add `accessibilityState={{ disabled }}` to AppButton** and loading-state accessibilityLabel (M-06, A-02, A-03)
15. **Add `accessibilityLiveRegion="polite"` to AppInput error text** (M-05, A-05)
16. **Add status to AppAvatar accessibility label** (A-11)
17. **Improve avatar status badge accessibility** with programmatic status text (A-11)
18. **Remove unused dependencies**: `class-variance-authority`, `clsx`, `tailwind-merge`, `react-native-reanimated-carousel` (if not used in Spin screen) (B-01)
19. **Migrate press feedback** from `useState` + JS-thread transform to Reanimated `useSharedValue` + `useAnimatedStyle` in all interactive components (H-05, P-03, P-04)
20. **Add `maxFontSizeMultiplier`** to all display-level `AppText` usages (A-01, M-10)

---

## 13. Production Readiness Score

| Category | Score | Notes |
|---|---|---|
| Runtime Performance | 3/10 | No screens exist; component-level patterns have known defects (JS-thread animations, unnecessary re-renders) |
| Bundle Quality | 4/10 | Correct toolchain; 9 unused deps; NativeWind palette conflict |
| Accessibility | 2/10 | Multiple WCAG failures; 14 identified issues; no reduced-motion support |
| Error Handling | 2/10 | Font error swallowed; no storage layer; no persistence error handling |
| Security & Privacy | 9/10 | Exemplary offline-first design; only dark mode declaration inconsistency |
| Code Quality | 5/10 | Consistent architecture intent; duplicate file; token drift; dead code |
| Scalability | 6/10 | Architecture designed well for future modes; missing implementations |
| Testing Readiness | 1/10 | No tests; no test runner; test IDs not assigned at usage sites |
| Documentation Compliance | 3/10 | 3 non-existent components marked Complete; all token values non-compliant |
| **Overall** | **2.5 / 10** | Pre-alpha with sound architecture intent but significant foundational defects |

> The score does not reflect the project's potential — the architecture philosophy and documentation quality are genuinely strong. The score reflects the current gap between specification and implementation, and the number of foundational defects that must be resolved before application development can proceed safely.

---

*Report generated from static analysis of commit state as of 2026-07-19. No source files were modified during this audit.*
