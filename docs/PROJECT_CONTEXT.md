# DareDrop — Project Context (Single Source of Truth)

**Version:** 2.0
**Status:** Canonical — supersedes v1.0 in full

This document is the permanent architectural specification for DareDrop. Every future implementation must follow it before generating code. Where a future prompt conflicts with this document, this document takes precedence unless the prompt explicitly states it is amending the specification — in which case this file must be updated in the same change (Section 21).

---

## 0. How To Read This Document

As in `data_model.md`, three words carry specific weight:

- **Must** — a hard rule. Violating it is a defect, not a style preference.
- **Should** — the strong default; deviation requires a comment explaining why.
- **May** — an explicitly permitted option, not an obligation.

---

## 1. Product Overview

| | |
|---|---|
| **Product Name** | DareDrop |
| **Category** | Offline party game |
| **Platform** | Mobile (iOS + Android) |
| **Framework** | Expo (managed workflow) |
| **UI Runtime** | React Native |
| **Language** | TypeScript (strict mode) |
| **Routing** | Expo Router |
| **Styling** | NativeWind |

**Core concept:** a single device is passed between players. Players add participants, configure the game, and receive randomly assigned dares to complete, skip, or pass, until the game ends. No internet, no accounts, no backend, no authentication — everything runs fully offline, on-device.

---

## 2. Relationship to Other Specification Documents

DareDrop's specification is split across four documents. Each owns a distinct concern. **Do not duplicate content across them** — if you find yourself repeating a rule from another doc, cross-reference it instead.

| Document | Owns | Does Not Own |
|---|---|---|
| `PROJECT_CONTEXT.md` (this file) | Tech stack, design system tokens, folder/architecture rules, state management pattern, code quality standards | Entity shapes, validation rules, persistence schemas (→ `data_model.md`) |
| `data_model.md` | Every entity's TypeScript shape, lifecycle, ownership, validation, persistence keys | Visual design, component structure, screen layout (→ this file / `UI_SPECIFICATIONS.md`) |
| `UI_SPECIFICATIONS.md` | Per-screen layout, content, and copy | Token values (→ this file, Section 5) |
| `GAME_RULES.md` | Randomization behavior, fairness rules, skip/pass/round semantics | Data shapes (→ `data_model.md`), visuals (→ this file) |

Reading order for any new feature: **this file → `data_model.md` → `UI_SPECIFICATIONS.md` → `GAME_RULES.md`** (matches Section 20).

---

## 3. Product Philosophy

The application must feel like a premium consumer product — never like a student project, tutorial, hackathon prototype, or UI showcase. The visual and structural bar is products built by teams at Google, Airbnb, Shopify, Linear, Notion, or Expo itself.

Every decision must prioritize, in this order when trade-offs arise: **consistency → accessibility → maintainability → readability → scalability.** ("Consistency first" means a slightly less clever solution that matches existing patterns beats a novel one-off, even if the one-off is locally nicer.)

---

## 4. Technology Stack & Locked Decisions

These are **locked** — do not introduce an alternative library for a concern already covered here without updating this document first (Section 21).

| Concern | Chosen Solution | Notes |
|---|---|---|
| Framework | Expo (managed) | No bare workflow ejection without explicit sign-off. |
| Routing | Expo Router | File-based; route structure mirrors Section 10. |
| Styling | NativeWind | Utility classes map to theme tokens (Section 5) — never arbitrary Tailwind values (`w-[13px]` etc. are forbidden; use scale tokens). |
| State management | Zustand | One store per aggregate root (Section 8) — no Redux, no Context-as-global-state, no MobX. |
| Local persistence | `expo-sqlite`/`AsyncStorage`-compatible key-value layer, wrapped by a single `services/storage.ts` module | Components and stores never call the raw storage API directly (Section 9). |
| Animation | React Native Reanimated 3 | Used for anything specced in Section 17 (spin, card flip, chip pop). Plain RN `Animated` API is not used once Reanimated is present, to avoid two competing animation systems. |
| Haptics | `expo-haptics` | Gated by `Settings.haptics`. |
| Sound | `expo-av` (or its successor audio API, whichever is current in the installed Expo SDK) | Gated by `Settings.sound`. |
| Confetti / End Game motion | A single small, purpose-built component (`components/Confetti/`) — not a heavyweight animation library, to keep bundle size down for a one-time effect. |
| Testing | Jest + `@testing-library/react-native` | Scope defined in Section 15. |
| Linting/formatting | ESLint + Prettier, TypeScript strict mode | Zero warnings tolerated at "production ready" (Section 19). |
| Analytics / telemetry | **None.** | The product is offline-first and account-free by design (Section 1); no telemetry SDK is added without a full spec revision, since it would be a philosophy change, not an implementation detail. |
| Backend / network calls | **None.** | Any future networked feature (Section 20 of `data_model.md`, e.g. Online Packs) requires a new, explicit networking section here before implementation. |

---

## 5. Design System Architecture

All tokens live in `theme/` and are imported from `@/theme` — never redefined locally, never hardcoded inline. This section is the **single authoritative value table**; `data_model.md` and `UI_SPECIFICATIONS.md` must reference these values, not restate their own copies.

### 5.1 File Structure

```
theme/
  colors.ts
  typography.ts
  spacing.ts
  radius.ts
  shadows.ts
  motion.ts
  index.ts        // re-exports a single `theme` object
```

```typescript
// theme/index.ts
export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  motion,
} as const;

export type Theme = typeof theme;
```

Components consume tokens via `import { theme } from "@/theme"` or a `useTheme()` hook if dark mode (Section 20 of `data_model.md`) is later implemented — never via raw hex/number literals.

### 5.2 Color Tokens

| Token | Value | Usage |
|---|---|---|
| `background` | `#FAF8F5` | Screen background |
| `surface` | `#FFFFFF` | Cards, resting elements |
| `surfaceElevated` | `#F1ECE6` | Sheets, modals |
| `primary` | `#3A332F` | Primary text, primary button fill |
| `primaryContainer` | `#EFE2D6` | Selected chip/toggle fill |
| `accent` | `#E8825C` | Primary CTA, Spicy difficulty |
| `success` | `#4C9A5C` | Completed states |
| `danger` | `#E05353` | Destructive actions, Extreme difficulty |
| `textPrimary` | `#241F1C` | Body/heading text |
| `textSecondary` | `#8A7F76` | Captions, helper text, disabled text |
| `difficulty.mild` | `#7FB37A` | Mild badges/dots |
| `difficulty.spicy` | `#E8825C` | Spicy badges/dots (same as accent, intentional) |
| `difficulty.extreme` | `#D65B5B` | Extreme badges/dots |

**Rule:** no color is ever written as a literal hex string outside `theme/colors.ts`. A `ThemeColor` string-literal union type is exported and used for any prop that accepts a color (e.g. `avatarColor` in `data_model.md` Section 17.1).

### 5.3 Typography Tokens

| Token | Font | Size | Weight |
|---|---|---|---|
| `display` | Poppins | 28 | Bold |
| `title` | Poppins | 20 | SemiBold |
| `heading` | Poppins | 18 | SemiBold |
| `body` | Inter | 16 | Medium |
| `button` | Inter | 16 | SemiBold |
| `caption` | Inter | 13 | Regular |

Font sizes/weights are never hardcoded in component styles — always `theme.typography.<token>`.

### 5.4 Spacing Scale

A single 4px-based scale — no arbitrary values anywhere in the codebase:

| Token | Value |
|---|---|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 12px |
| `lg` | 16px |
| `xl` | 20px |
| `xxl` | 24px |
| `xxxl` | 32px |
| `huge` | 48px |

Every margin, padding, and gap in the app must resolve to one of these tokens. If a design calls for something in between, round to the nearest token rather than introducing a new one — and if that happens more than once for the same use case, add a token here instead of an inline value.

### 5.5 Radius Tokens

| Token | Value | Used By |
|---|---|---|
| `sm` | 12px | Small inline elements |
| `md` | 18px | Buttons, inputs |
| `lg` | 24px | Cards |
| `xl` | 28px | Dialogs, bottom sheets |
| `pill` | 999px | Chips, difficulty badges, pill buttons |

### 5.6 Elevation / Shadow Tokens

Exactly two tiers — never a manually-defined `shadowOpacity`/`elevation` outside these two:

| Token | iOS (shadow) | Android (`elevation`) | Used By |
|---|---|---|---|
| `resting` | `{ offset: {0,1}, opacity: 0.06, radius: 4 }` | `2` | Cards, chips |
| `elevated` | `{ offset: {0,4}, opacity: 0.12, radius: 12 }` | `8` | Bottom sheets, dialogs, the Ready Lobby's Start button |

### 5.7 Motion Tokens

| Token | Value | Used By |
|---|---|---|
| `duration.standard` | 200–250ms | Screen transitions, fades |
| `duration.pressScale` | 80ms | Button press feedback |
| `easing.standard` | ease-out | Default for all transitions |
| `pressScale` | 0.96 | Button press target scale |

Confetti, card reveal, and spin-button idle breathing are one-off named animations (implemented as Reanimated worklets in `animations/`), not part of the shared token set — but their durations still pull from `duration.standard` where applicable, per the original motion spec.

---

## 6. Component Architecture & Standards

### 6.1 Folder Pattern

```
components/
  AppButton/
    AppButton.tsx
    index.ts
  DareCard/
    DareCard.tsx
    index.ts
```

Each component owns its own folder, even if currently single-file, so co-located tests/styles/sub-components have a home without restructuring later.

### 6.2 Rules

Every reusable component must:

- Be reusable across screens (a component used on exactly one screen with no foreseeable reuse belongs inline in that screen's file, not in `components/`).
- Be strongly typed — no `any` props, no implicit `children: any`.
- Be accessible (Section 11).
- Be memoized (`React.memo`) when it renders inside a list or receives stable props that would otherwise cause avoidable re-renders (Section 12) — not by blanket default on every component.
- Use `StyleSheet.create` (or NativeWind classes resolving to theme tokens) — never inline style objects created on every render.
- Import tokens only from `@/theme` — never redefine a local constant that shadows a theme value.

### 6.3 Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Component files/folders | PascalCase | `DareCard/DareCard.tsx` |
| Hooks | camelCase, `use` prefix | `useGameSession.ts` |
| Stores | camelCase, `Store` suffix | `gameSessionStore.ts` |
| Services | camelCase, `.service.ts` suffix | `storage.service.ts` |
| Types/interfaces | PascalCase, no `I` prefix | `Player`, `GameSession` |
| Enums (string unions) | PascalCase type, PascalCase literal values | `type Difficulty = "Mild" \| "Spicy" \| "Extreme"` |
| Constants | SCREAMING_SNAKE_CASE for true constants; camelCase for config objects | `MAX_PLAYERS`, `defaultConfig` |

### 6.4 Import Order

1. External packages (`react`, `react-native`, `expo-*`)
2. Aliased internal imports (`@/theme`, `@/store`, `@/types`, `@/components`)
3. Relative imports (`./`, `../`)
4. Type-only imports last within each group, using `import type` where the module has no runtime import already.

---

## 7. Application Architecture

### 7.1 Folder Responsibilities

| Folder | Owns | Must Not Contain |
|---|---|---|
| `app/` | Expo Router routes only — thin screen components that compose from `components/`, read from `store/` via hooks, and contain minimal logic of their own | Business logic, direct storage calls, entity validation |
| `components/` | Reusable, presentational-first UI | Direct storage access, direct store subscriptions to entities outside their own props (prefer prop-driven components; container components in `app/` wire them up) |
| `theme/` | Design tokens only (Section 5) | Component styles, screen-specific values |
| `services/` | Business services: storage abstraction, randomization engine, award computation, migration logic | UI, React hooks, JSX |
| `store/` | Zustand stores, one per aggregate root (Section 8) | Business logic that belongs in `services/` — stores should be thin, delegating computation to services and holding state + simple actions |
| `hooks/` | Reusable cross-screen hooks (`useGameSession`, `useSettings`) | One-off logic used in a single screen only |
| `constants/` | Static, non-visual constants (validation bounds from `data_model.md` Section 9, storage keys from Section 13) | Design tokens (→ `theme/`) |
| `types/` | Shared TypeScript types, mirroring `data_model.md` exactly | Screen-local view-model types (define those next to their screen) |
| `utils/` | Pure, side-effect-free utility functions | Anything with I/O, storage, or React state |
| `data/` | Bundled offline dare packs (Section 18), loaded as static assets | User-generated/custom content (→ persisted via `services/storage.ts`) |
| `animations/` | Reusable Reanimated worklets/hooks for named animations (Section 5.7) | One-off inline animation code duplicated per screen |

### 7.2 Cross-Cutting Rule

No file in `app/` or `components/` calls a storage API, a random-number function, or an award-computation function directly. All of those are reached through `services/`, called from `store/` actions, exposed to the UI as hook return values.

---

## 8. State Management Rules

Zustand stores mirror the aggregate roots and major entities from `data_model.md` Section 4:

| Store | Backs | Notes |
|---|---|---|
| `playerStore` | `Player[]` (pre-game, `Draft` state) | Cleared/snapshotted into `gameSessionStore` on game start (Section 6.3 of `data_model.md`). |
| `gameSetupStore` | `GameConfiguration` | Becomes read-only once the session is `Active`; store enforces this, not just the UI. |
| `gameSessionStore` | `GameSession` (the aggregate root) | The **only** store permitted to create/mutate `Round`, `history`, or `Summary` (matches `data_model.md` Section 11's mutation ownership table exactly). |
| `customContentStore` | `CustomPack[]`, `CustomDare[]` | Owns all custom-content CRUD. |
| `settingsStore` | `Settings` | Fully independent of gameplay state. |

**Rules:**

1. A component reads state via a selector hook (e.g. `usePlayers()`), never by importing a store and reaching into its raw state object.
2. A component triggers change via an exposed action (`resolveRound(roundId, result)`), never by constructing a partial entity object and calling a generic `set()`.
3. No store subscribes to or directly mutates another store's state. Cross-store coordination (e.g. "snapshot players into the session when the game starts") happens in a service function called from an explicit action, not via store-to-store side effects.
4. Selectors must be memoized/shallow-compared where they return derived arrays/objects, to avoid re-render storms — this is the practical implementation of `data_model.md` Section 19 (derived data computed at read time).

---

## 9. Persistence & Storage Integration

`services/storage.ts` is the **only** module that touches the underlying storage API. It exposes typed functions matching `data_model.md` Section 13's key table exactly:

```typescript
// services/storage.ts (shape, not full implementation)
export async function getSettings(): Promise<Settings>;
export async function setSettings(settings: Settings): Promise<void>;
export async function getActiveSession(): Promise<GameSession | null>;
export async function setActiveSession(session: GameSession | null): Promise<void>;
// ...one pair per storage key in data_model.md Section 13.1
```

- Every function here validates the schema version (`data_model.md` Section 13.4) before returning data, and runs migrations transparently — callers never see a pre-migration shape.
- Stores call these functions inside their actions; they are never called directly from `app/` or `components/`.
- Corrupted/unreadable storage must resolve to a safe default (matching `data_model.md`'s "never hard-crash on corrupted local storage" rule), logged via a single error-reporting path, not scattered `try/catch`es with inconsistent fallback behavior.

---

## 10. Navigation & Screen Flow

Expo Router file structure mirrors the fixed screen order below. No additional screens are introduced without updating this document first.

```
Splash → Player Setup → Game Setup → Ready Lobby → Spin → Reveal
  → (Skip Sheet | Pass Dialog, as overlays, not separate routes)
  → History (reachable from Reveal/Summary, not a forced step)
  → Summary → Settings → About
```

- **Skip Sheet** and **Pass Dialog** are modal overlays presented over the Reveal route, not their own Expo Router screens with their own back-stack entries — they must not be reachable via deep link or direct back-navigation as standalone pages.
- **History** and **Settings/About** are reachable from multiple points but are not part of the forced linear flow — they must not appear in the primary screen sequence's back-stack in a way that breaks "back" returning to gameplay.
- Route params are typed explicitly per route (e.g. `app/reveal.tsx` typed to expect a `roundId: string` param) — no untyped `useLocalSearchParams()` consumed without a cast to a defined type.
- Since there are no accounts and no remote content, deep-linking has no authentication concerns, but any future deep link (e.g. sharing a custom pack, Section 20 of `data_model.md`) must be added here explicitly before implementation.

---

## 11. Accessibility Standards

Every interactive component must support, where applicable:

- `accessibilityRole` (`button`, `switch`, `text`, etc. — matching the actual semantic role, not always `button`)
- `accessibilityLabel` (human-readable, not the raw internal id or icon name)
- `accessibilityState` (`disabled`, `selected`, `checked`) reflecting real component state, not just visual style
- `allowFontScaling` (true by default; only disabled with explicit justification for a layout that would break)
- `testID` for automated testing (Section 15)
- Minimum touch target of 44×44pt, even where the visual element is smaller (achieved via `hitSlop` rather than inflating the visible element)
- Text contrast meeting WCAG AA against its background token — checked against the Section 5.2 color table, not assumed

Screens with time-sensitive content (e.g. Skip Sheet countdown, if ever added) must not rely on color alone to convey state — pair color with text/icon.

---

## 12. Performance Standards

- Lists (History screen, Player chips, Dare pack lists) use `FlatList`/`FlashList`, never `ScrollView` + `.map()`, once list length can realistically exceed ~15 items.
- No inline anonymous functions passed as `renderItem`/`keyExtractor` in a list that re-renders frequently — define them outside the render path or memoize with `useCallback`.
- No style objects created inline in `render`/JSX — always `StyleSheet.create` or a memoized NativeWind class string.
- `React.memo` is applied to list item components and to components receiving frequently-unchanged props from a parent that re-renders often (e.g. `DareCard` inside the Spin stack) — not applied reflexively to every component regardless of render frequency.
- Selectors from Zustand stores use shallow equality checks for array/object returns to prevent unnecessary re-renders (Section 8.4).
- Reanimated worklets run on the UI thread for any animation tied to gesture or frequent updates (spin, card flip) — JS-thread animation is acceptable only for simple one-shot fades/scale where a dropped frame has no gameplay consequence.

---

## 13. Error, Loading & Empty States

Every screen that reads persisted or computed data must explicitly handle three states, not just the "happy path":

| State | Rule |
|---|---|
| **Loading** | Shown while `services/storage.ts` resolves on app boot or session load. Never shown for asynchronous UI transitions under ~150ms — those get no spinner, to avoid flicker. |
| **Empty** | Explicit empty-state content (not a blank screen) for: no players added yet, no custom dares/packs yet, empty History before any round resolves. |
| **Error** | If storage read/migration fails unrecoverably (rare, given Section 9's fallback rule), the screen shows a clear, non-technical message and a recovery action (e.g. "Reset Data") rather than a blank or crashed screen. |

---

## 14. Internationalization Readiness

The app ships English-only in v1, but must not make English-only assumptions that block `Settings.language` (Section 20 of `data_model.md`) later:

- All user-facing strings are referenced through a single strings module (`constants/strings.ts`) rather than inlined in JSX — even before a real i18n library is introduced, this makes a future swap mechanical rather than a rewrite.
- No string concatenation that assumes English word order (e.g. building "3 skips remaining" by gluing a number into a fixed template must go through a single function, not ad hoc template literals repeated across files).
- Bundled dare text is treated as translatable content (Section 20 of `data_model.md`'s Localization note), not hardcoded inline in component files.

---

## 15. Testing Standards

Given this is a single-developer portfolio project, testing is scoped deliberately rather than omitted entirely:

- **Unit tests (required):** pure functions in `services/` and `utils/` — the randomization engine (`data_model.md` Section 16), award computation, validation functions (`data_model.md` Section 9). These are cheap to write and directly protect the app's most "must be correct" logic.
- **Store tests (should):** Zustand store actions for the core game-session lifecycle transitions (Section 6.1/6.2 of `data_model.md`) — e.g. resolving a round twice must be rejected (Section 9.5 of `data_model.md`).
- **Component tests (may):** not required for v1; add for a component only if it has non-trivial conditional rendering logic worth locking down.
- **E2E tests:** out of scope for v1. Revisit only if the project moves beyond a portfolio piece.
- Every component that would benefit from testing exposes a `testID` (Section 11) so tests aren't written against fragile text-content queries alone.

---

## 16. Code Quality Standards

Write code as if it will be maintained for years. Prioritize clarity, predictability, type safety, and maintainability, in roughly that order when they conflict.

**Avoid:**
- Magic numbers (use `constants/` or `theme/` tokens)
- Duplicated logic (extract to `utils/`/`services/` once used twice, not preemptively on first use)
- Premature abstraction (don't build a generic system for a case that has exactly one instance today)
- Deep prop drilling beyond two levels (use a store selector or context instead)
- Runtime style object creation (Section 12)
- Anonymous inline callbacks passed to hot-path props (list renderers, gesture handlers) — acceptable for rarely-invoked handlers like a single button's `onPress` where memoization overhead isn't worth it

**Also required:**
- No `any` in committed code — use `unknown` plus narrowing, or the correct specific type.
- No commented-out code left in place — delete it (version control preserves history).
- No `TODO` comments without an associated tracked task reference.
- No `console.log` left in committed code (a dedicated logger, gated by environment, may exist instead).

---

## 17. Motion & Animation Implementation Rules

| Animation | Trigger | Implementation Note |
|---|---|---|
| Splash logo scale/fade | App load | Reanimated, one-shot, ~600ms per original spec. |
| Screen transitions | Route change | Expo Router's built-in transition config, tuned to `duration.standard`. |
| Button press scale | Press in/out | Reanimated `useAnimatedStyle` + `withTiming`, `pressScale` token. |
| Chip pop/shrink | Add/remove player or custom dare | Reanimated `withSpring`, single occurrence per add/remove, no loop. |
| Bottom sheet slide-up | Sheet open | Reanimated, paired with a fade on the dim overlay. |
| Spin card shuffle → reveal | Spin button tap | Reanimated sequence; must fully complete before Reveal route is pushed, so state and animation never disagree about "what round is this." |
| Spin button idle breathing | Idle state on Spin screen | Continuous but subtle (opacity/scale pulse), paused while shuffle animation runs so they never overlap. |
| Confetti | Entering Summary | One-shot, ~1.2s, implemented in `components/Confetti/`, never re-triggered on re-render of the Summary screen (guard with a ref/effect-once pattern). |

Never introduce an animation not listed in the original motion spec or this table without adding it here first — this keeps motion from silently sprawling screen by screen.

---

## 18. Default Dare Packs

Shipped as production data, not placeholder content:

| Pack | Count | Theme |
|---|---|---|
| Mild | 15 | Funny, awkward, silly, light embarrassment |
| Spicy | 15 | Cringe, social, performative, embarrassing |
| Extreme | 15 | Maximum cringe, high commitment, safe but outrageous |

Stored as static JSON in `data/`, matching the `Dare`/`DarePack` shapes from `data_model.md` Sections 17.2–17.3 exactly, with `source: "Bundled"` / `type: "BuiltIn"`. Future screens must assume these packs already exist and are immutable (Section 4 of `data_model.md`).

---

## 19. Screen Architecture

The application consists of the following screens.

## Core Flow

Splash

↓

Player Setup

↓

Game Setup

↓

Ready Lobby

↓

Spin

↓

Reveal

↓

Summary

---

## Gameplay Supporting Screens

History

Settings

About

---

## Modal & Overlay Screens

Skip Confirmation Bottom Sheet

Pass Confirmation Dialog

Award Dialog (Future)

Confirmation Dialogs

---

## Custom Content Management

Custom Dare Packs

Create Pack

Edit Pack

Delete Pack Confirmation

Create Dare

Edit Dare

Import Pack (Future)

Export Pack (Future)

Pack Details

---

## Settings & Information

Settings

About

Licenses (Future)

Privacy (Future)

---

## Navigation Rules

The gameplay flow is linear.

Splash
→ Player Setup
→ Game Setup
→ Ready Lobby
→ Spin
→ Reveal
→ Summary

History may be opened during gameplay.

Settings and About are independent utility screens.

Custom pack management exists outside gameplay and is accessible before starting a game.

Dialogs and bottom sheets never exist as standalone routes.

They should always be presented modally.

Future screens should extend this hierarchy instead of replacing it.

## 20. Definition of production ready

A file/feature is production-ready only when **all** of the following hold:

- ✓ TypeScript strict mode passes with zero errors
- ✓ ESLint passes with zero warnings
- ✓ All interactive elements meet Section 11's accessibility requirements
- ✓ Layout is responsive across common phone widths (not just one test device size)
- ✓ Any reusable logic lives in `components/`/`hooks/`/`services/`/`utils/` per Section 7, not duplicated inline
- ✓ All entity shapes match `data_model.md` exactly, with no parallel/local type definitions
- ✓ All colors, spacing, radius, typography, shadows, and motion values come from `theme/` (Section 5) with zero literals
- ✓ No dead code, no commented-out blocks, no unresolved `TODO`s (Section 16)
- ✓ No placeholder/stub implementations left in a "done" feature
- ✓ No unnecessary abstraction for a single-use case
- ✓ Loading/empty/error states are handled per Section 13, not just the happy path

---

## 21. AI Implementation Rules

Before writing any code:

1. Read `PROJECT_CONTEXT.md` (this file) completely.
2. Read `data_model.md` completely.
3. Read `UI_SPECIFICATIONS.md` for the specific screen(s) in scope.
4. Read `GAME_RULES.md` if the task touches randomization, rounds, or rules.
5. Inspect the existing implementation for anything that already solves part of the task.
6. Reuse existing architecture (stores, services, components, theme tokens) rather than introducing parallel ones.

While implementing:

- Follow the design system (Section 5) exactly — no ad hoc values.
- Preserve existing public APIs of components/hooks/services unless a change is explicitly requested.
- Validate TypeScript and ESLint before considering a change complete.
- Explain which files were modified and why, in plain terms, at the end of the change.
- Stop after completing the requested phase — never silently continue into unrequested future phases or unrelated screens.
- If a requirement isn't covered by this document or `data_model.md`, stop and flag it rather than inventing a convention (matches `data_model.md` Section 22).

---

## 22. Document Governance

- Versioned independently of the app (currently **v2.0**).
- Any change to the tech stack (Section 4), token values (Section 5), folder architecture (Section 7), or state management pattern (Section 8) requires a version bump and a changelog entry below.
- No implementation change that alters architecture, tokens, or folder responsibilities should be merged without a corresponding update to this file in the same change.

### Changelog

- **v2.0** — Full rewrite to production-grade specification: locked the technology stack explicitly (Section 4), defined concrete spacing/radius/shadow/motion token values that v1.0 only referenced abstractly (Section 5), added state management rules mapped to `data_model.md`'s aggregate roots (Section 8), added a persistence integration contract (Section 9), added navigation/route structure (Section 10), added accessibility/performance/error-state/testing/i18n standards (Sections 11–15), and added an explicit cross-reference section (Section 2) so this file and `data_model.md` stay in sync rather than silently diverging.
- **v1.0** — Initial philosophy, design direction, and folder responsibilities (superseded).