
# Design Consistency Audit (Read-Only)

**To:** DareDrop Development & Design Teams  
**From:** Senior Design Systems Engineer  
**Date:** July 19, 2026  
**Status:** **FAIL (Not Production Ready)**  
**Audit Scope:** Verification of reusable UI components under `components/` against design tokens and specifications in `docs/PROJECT_CONTEXT.md` (v2.0) and `docs/UI_SPECIFICATION.md` (v1.1).

---

## Executive Summary

The DareDrop component library has major discrepancies between the design system specifications and the actual code. Key design tokens (Corner Radii, Spacing, Typography, Shadows) implemented in `theme/` do not match the values mandated in the core specifications. Furthermore, several critical components claimed to be complete are entirely missing from the repository, and the existing components contain mathematical bugs, visual weight inflation, and incorrect color mappings.

This project is in a **Pre-Alpha** state and **cannot be shipped to production** without a complete overhaul of the token definitions and a redesign of multiple core components.

---

## Critical Gaps & Structural Issues

### 1. Missing Reusable Components
* **Severity:** Critical
* **Affected Components:** `AppModal`, `AppBottomSheet`, `AppProgressBar`
* **Explanation:** These three components are documented in `docs/CURRENT_STATE.md` (lines 361–363) as `✅ Complete`. However, they **do not exist in the repository** (the `components/` directory only contains folders for `AppAvatar`, `AppButton`, `AppCard`, `AppChip`, `AppDivider`, `AppInput`, `AppSwitch`, and `AppText`).
* **Why it violates the design language:** The core gameplay screens (Reveal, Game Setup, and Skip Sheets) rely entirely on these components. Their absence prevents any screen-level layout from adhering to a unified container or overlay architecture.
* **Recommended Improvement:** Implement `AppModal` (centered dialog container), `AppBottomSheet` (spring-driven slide-up panel), and `AppProgressBar` (custom Reanimated line tracker) exactly as specified in `docs/UI_SPECIFICATION.md` sections A.6, A.8, and A.9.
* **Expected Impact:** Restores ability to compile and build the core linear gameplay flows.

### 2. Duplicate Stray Component File & Contrast Crash
* **Severity:** High
* **Affected Component:** [AppText](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/components/AppText/AppText.tsx) vs [AppText.tsx (stray)](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/components/AppText.tsx)
* **Explanation:** There are duplicate files for `AppText`. One is inside `components/AppText/AppText.tsx`, and the other is a stray file directly at `components/AppText.tsx`. 
  - The stray file has a dynamic color check that falls back to color string literals, while the modular file in `components/AppText/AppText.tsx` (line 34) does a direct lookup: `const colorValue = colors.text[color]`.
  - In [AppButton.tsx](file:///c:/Users/User/Desktop/projects/mini%20projects/DareDrop/components/AppButton/AppButton.tsx#L188), the label uses `variantStyles.textColor as keyof typeof colors.text` which resolves to `#FFFFFF` (hex string) for the Primary variant.
  - When `#FFFFFF` is passed to the modular `AppText`, `colors.text["#FFFFFF"]` returns `undefined`. The text color falls back to default primary text, causing **dark text to render on a dark primary background** (ink button), violating WCAG AA contrast.
* **Why it violates the design language:** Direct violation of component folder isolation (`PROJECT_CONTEXT.md` Section 6.1) and a visual bug that renders text invisible on primary buttons.
* **Recommended Improvement:** Delete the stray `components/AppText.tsx` file. Update the modular `AppText` component to cleanly resolve hex strings if passed, or refactor `AppButton` to pass semantic token keys (e.g., `inverse`) instead of hex values.
* **Expected Impact:** Eliminates build ambiguity and prevents color crashes.

---

## 1. Warm Material Identity

* **Softness & Geometry:** The Warm Material philosophy requires soft, highly-rounded corners to feel approachable. Because the corner radius tokens are misconfigured across all implemented components, cards and buttons look too sharp and rigid.
* **Visual Noise:** Several elements (e.g. `AppAvatar`) enforce borders in all instances instead of only when stacked in a row, which adds unnecessary visual weight and decoration.

### Inconsistent Component: AppAvatar
* **Severity:** Medium
* **Explanation:** Enforces borders on all instances (lines 126–127).
* **Why it violates the design language:** `UI_SPECIFICATION.md` A.3 states: *"when avatars appear in an overlapping/stacked row (Ready Lobby), each gets a 2px #FFFFFF border for separation; when shown singly (Reveal), no border."*
* **Recommended Improvement:** Add a `stacked` boolean prop. If `true`, render a 2px `#FFFFFF` border; otherwise, render borderless.
* **Expected Impact:** Clean visual identity and matches the Material 3 spec.

---

## 2. Corner Radius Consistency

The corner radius scale implemented in the code is completely misaligned with the design tokens defined in the context:
* **Spec (`PROJECT_CONTEXT.md` Section 5.5):** `sm` (12px), `md` (18px), `lg` (24px), `xl` (28px), `pill` (999px).
* **Code (`theme/radius.ts`):** `small` (8px), `medium` (12px), `large` (16px), `card` (24px), `pill` (999px).

### Inconsistent Component: AppCard
* **Severity:** High
* **Explanation:** Uses `radius.large` (16px) as its border radius (line 122).
* **Why it violates the design language:** `PROJECT_CONTEXT.md` Section 5.5 mandates `radius.lg` (24px) for cards. Using 16px radius makes cards look too boxy, losing the signature softness of the Warm Material theme.
* **Recommended Improvement:** Refactor card style to use `radius.card` or update the radius scale to match the specification.
* **Expected Impact:** Approachable and soft card elements.

### Inconsistent Component: AppButton
* **Severity:** High
* **Explanation:** Uses `radius.large` (16px) instead of `radius.md` (18px).
* **Why it violates the design language:** Violates the button corner specification in `PROJECT_CONTEXT.md` Section 5.5, creating geometric drift between buttons and inputs.
* **Recommended Improvement:** Use the correct token mapping for buttons.

---

## 3. Elevation Consistency

The elevation system defined in the code contains three levels (`small`, `medium`, `large`), whereas the specification defines exactly two: `resting` (iOS shadow offset {0,1}, opacity 0.06, radius 4) and `elevated` (iOS shadow offset {0,4}, opacity 0.12, radius 12).

### Inconsistent Component: AppCard
* **Severity:** High
* **Explanation:** Default elevation is set to `medium` (lines 74–77), which maps to `shadows.medium` (offset {0,4}, opacity 0.08, radius 6).
* **Why it violates the design language:** Resting cards should use the `resting` shadow token (offset {0,1}, opacity 0.06, radius 4). The current code applies a heavy shadow that makes resting cards appear to float too high, ruining the flat Material layout.
* **Recommended Improvement:** Rewrite `theme/shadows.ts` to expose only `resting` and `elevated` semantic keys, and map `AppCard`'s default state to `resting`.
* **Expected Impact:** Clean hierarchy with appropriate depth levels.

---

## 4. Color Hierarchy

Semantic color tokens are violated in interactive controls, leading to wrong visual priority.

### Inconsistent Component: AppSwitch
* **Severity:** Medium
* **Explanation:** Uses `colors.accent.primary` (orange) for the track in the `ON` state (line 56).
* **Why it violates the design language:** `UI_SPECIFICATION.md` A.7 explicitly mandates `Track - On: primary #3A332F` (dark brown ink). Using orange makes the switch look like a highlighted hero CTA, which competes with actual game-advancement buttons.
* **Recommended Improvement:** Map the track's ON background color to `colors.primary.DEFAULT`.
* **Expected Impact:** Restrained color hierarchy.

### Inconsistent Component: AppAvatar
* **Severity:** Medium
* **Explanation:** The color presets in `AppAvatar.tsx` (lines 80–98) are mismapped:
  - `"blue"` maps background to `colors.primary.container` (beige `#EFE2D6`) and border to `colors.accent.primary` (orange).
  - `"purple"` maps background to `colors.surface.elevated` (grey `#F1ECE6`).
  - `"rose"`, `"teal"`, and `"amber"` map directly to red/green/yellow status colors.
* **Why it violates the design language:** Beige/orange is not blue. The avatar colors must represent a balanced set of player identifiers, not system status indications.
* **Recommended Improvement:** Create an `AvatarColor` union and color palette mapping in `theme/colors.ts` and apply it clean of status colors.

---

## 5. Typography Hierarchy

The typography system implemented in `theme/typography.ts` deviates entirely from the spec values:
* **Spec (`PROJECT_CONTEXT.md` Section 5.3):** `display` (28px Bold), `title` (20px SemiBold), `heading` (18px SemiBold), `body` (16px Medium), `button` (16px SemiBold), `caption` (13px Regular).
* **Code (`theme/typography.ts`):** `body` (14px Regular), `button` (14px SemiBold), `caption` (12px Regular).

### Inconsistent Component: AppText & AppButton
* **Severity:** High
* **Explanation:** All text renders via typography tokens that are 2px smaller than specified (e.g. buttons render text at 14px instead of 16px).
* **Why it violates the design language:** Text elements appear too thin and small, diminishing readability and making the interface feel cramped and unpolished.
* **Recommended Improvement:** Redefine the keys and values in `theme/typography.ts` to match `PROJECT_CONTEXT.md` Section 5.3.
* **Expected Impact:** High contrast, legible typography.

---

## 6. Visual Weight

### Inconsistent Component: AppChip
* **Severity:** High
* **Explanation:** The chip enforces `minHeight: Math.max(sizeConfig.height, 44)` (line 151).
* **Why it violates the design language:** Enforcing a minimum height of 44px means the `small` (36px) and `medium` (40px) variants are inflated to 44px. This makes chips the exact same height as buttons, drawing too much visual weight, bloating list views, and cluttering the Player Setup screen.
* **Recommended Improvement:** Remove the hardcoded `minHeight` clamp from the chip container and allow the height to respect `sizeConfig.height` (36px for small).
* **Expected Impact:** Compact, lightweight chips.

---

## 7. Interactive States

### Inconsistent Component: AppButton
* **Severity:** Medium
* **Explanation:** The `Accent CTA` variant (the hero button style used for Start Game and Spin) is completely missing from the `AppButtonVariant` union and style mappings.
* **Why it violates the design language:** Pinned CTA actions cannot be rendered with the correct accent color background (`#E8825C`) and breathing animation as specified in `UI_SPECIFICATION.md` A.1.
* **Recommended Improvement:** Add `accent` to `AppButtonVariant`, mapping its default style to `colors.accent.primary` with white text and an optional pulse animation helper.
* **Expected Impact:** Distinct CTA hierarchy.

---

## 8. Component Rhythm

### Spacing Token Bloat
* **Severity:** High
* **Affected Components:** All components.
* **Explanation:** Spacing tokens in `theme/spacing.ts` do not match `PROJECT_CONTEXT.md` Section 5.4.
  - Spec: `md` (12px), `lg` (16px), `xl` (20px), `xxl` (24px).
  - Code: `md` (16px), `lg` (24px), `xl` (32px).
* **Why it violates the design language:** Spacing is inflated across all components (e.g., cards use padding 24px instead of 16px; buttons use padding 16px instead of 12px), causing the entire UI to feel bloated and out of rhythm.
* **Recommended Improvement:** Re-align `theme/spacing.ts` with the 4px-based specification scale.
* **Expected Impact:** Tight, modern, and consistent spatial layout.

### Inconsistent Component: AppSwitch (Math/Translation Bug)
* **Severity:** High
* **Explanation:** Track width is 48px, thumb width is 22px, and padding is 2px. The animation translates the thumb by `spacing.md` (which is `16` in the code).
* **Why it violates the design language:** The correct translation distance to reach the right border is `48 - 22 - (2 * 2) = 22px`. Since it only translates by 16px, the thumb stops **6px short of the track edge in the ON state**, looking misaligned.
* **Recommended Improvement:** Hardcode the translation calculation to `22` or calculate it dynamically rather than binding it to a spacing scale token.
* **Expected Impact:** Pixel-perfect animation alignments.

---

## 9. Accessibility Visuals

### Inconsistent Component: AppDivider
* **Severity:** Low
* **Explanation:** The default thickness is `hairline` which renders as `StyleSheet.hairlineWidth`.
* **Why it violates the design language:** On modern high-density screens, a hairline divider is barely visible (0.33px to 0.5px), which fails visual clarity audits. The spec calls for a clear 1px line.
* **Recommended Improvement:** Set default thickness to `thin` (1px).
* **Expected Impact:** Clear visual grouping of list elements.

---

## 10. Google Product Quality

If this library shipped inside *Google Photos*, *Google Tasks*, or *Material 3*, it would be rejected immediately.
1. **Missing implementation:** Crucial components are completely absent despite being marked as completed.
2. **Defective Switch:** The switch animation math is broken, leaving the toggle thumb floating off-center.
3. **Typography and Spacing Drift:** Spacing and fonts feel oversized and blocky on device layouts because the spacing scale is inflated and typography values do not match the design targets.
4. **Duplicate Text Component:** The duplication of the fundamental `AppText` component creates a major maintainability issue.

---

## Design Consistency Audit Scores

1. **Overall Design System Score:** **4/10** (Underlying structure is correct, but token mismatch makes it drift from specifications).
2. **Visual Consistency Score:** **5/10** (Different corner radii and spacings make cards, buttons, and inputs clash).
3. **Material Design Alignment Score:** **4/10** (Incorrect switch track colors, missing resting shadows, and oversized chips deviate from Material standards).
4. **Production Readiness Score:** **0/10** (Cannot be shipped due to missing components, duplicate code, contrast bugs, and animation math defects).

---

### Components that Require Redesign / Heavy Refactoring
1. **AppChip:** Fix height inflation; allow small (36px) height.
2. **AppSwitch:** Correct dimensions to 44x24px, fix the ON-state track color to primary ink, and correct the translation calculation to 22px.
3. **AppButton:** Add missing `accent` (CTA) variant and map heights to 56px/48px/44px.
4. **AppAvatar:** Add dynamic border rendering based on stacked rows; correct blue and purple color presets.

### Components that Only Require Polishing
1. **AppText:** Remove the duplicate stray file, and correct font sizes to 16px (body/button) and 13px (caption).
2. **AppCard:** Map radius to 24px and resting shadow to the correct elevation token.
3. **AppInput:** Correct radius to `md` (18px) and vertical container padding.
4. **AppDivider:** Change default thickness to `thin` (1px) for visual contrast.