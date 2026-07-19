# DareDrop — UI Specifications

**Version:** 1.1
**Status:** Canonical

This document defines the per-screen layout, content, states, and interaction behavior for every screen in DareDrop. It builds on the visual language established in the design direction work (colors, typography, spacing, component rules) but is the authoritative source for **screen inventory, layout, and behavior** specifically.

---

## 0. How To Read This Document

Same legend as the other specification files:

- **Must** — a hard requirement.
- **Should** — the strong default; deviation needs a stated reason.
- **May** — explicitly optional.

Scope reminder (per `PROJECT_CONTEXT.md` Section 2): this file owns **screen layout, content, and behavior**. It does not redefine token values (→ `PROJECT_CONTEXT.md` Section 5), entity shapes (→ `data_model.md`), or randomization logic (→ `GAME_RULES.md`). Every reference to a color, spacing, or radius token below refers back to those definitions rather than restating a value.

---

## 1. Reconciliation Note (Read First)

The screen list supplied for this document includes two screens — **Landing/Home** and **Manage Custom Dares** — that do not appear in `PROJECT_CONTEXT.md` Section 10's navigation flow, which currently reads:

```
Splash → Player Setup → Game Setup → Ready Lobby → Spin → Reveal → ... → Settings → About
```

Both additions are correct and necessary:

- **Landing/Home** is the natural place to offer "Continue Game" (resuming a persisted `Active` session per `data_model.md` Section 12) and is standard for any app that isn't meant to force-start a new session every launch.
- **Manage Custom Dares** was defined at the data layer (`data_model.md` Sections 17.2–17.3, 18) and referenced in `PROJECT_CONTEXT.md`'s folder responsibilities, but never given a screen — custom dares had a data model and no way for a user to actually create one.

**This document treats the navigation flow below (Section 2) as the corrected, canonical flow.** `PROJECT_CONTEXT.md` Section 10 should be bumped to v2.1 to match — flagging that here rather than silently letting the two documents disagree.

---

## 2. Screen Inventory & Priority

| # | Screen | Priority | Type |
|---|---|---|---|
| 1 | Splash | ⭐⭐ | Full screen, transient |
| 2 | Landing / Home | ⭐⭐⭐⭐⭐ | Full screen |
| 3 | Player Setup | ⭐⭐⭐⭐⭐ | Full screen |
| 4 | Game Setup | ⭐⭐⭐⭐⭐ | Full screen |
| 5 | Ready Lobby | ⭐⭐⭐⭐ | Full screen |
| 6 | Spin | ⭐⭐⭐⭐⭐ | Full screen |
| 7 | Dare Reveal | ⭐⭐⭐⭐⭐ | Full screen |
| 7a | Skip Bottom Sheet | (part of 7) | Modal overlay |
| 7b | Pass Confirmation Dialog | (part of 7) | Modal dialog |
| 8 | History | ⭐⭐⭐⭐ | Full screen |
| 9 | End Session (Summary) | ⭐⭐⭐⭐ | Full screen |
| 10 | Settings | ⭐⭐⭐⭐ | Full screen |
| 10a | About | (reached from 10) | Full screen |
| 10b | Reset Data Confirmation | (part of 10) | Modal dialog |
| 11 | Manage Custom Dares | ⭐⭐⭐⭐⭐ | Full screen |
| 11a | Add / Edit Custom Dare | (part of 11) | Modal sheet |
| 11b | Manage Custom Packs | (part of 11) | Modal sheet |

**Corrected navigation flow:**

```
Splash
  ↓
Landing / Home ──────────────► Settings ──► About
  │      │                        │
  │      └──► Manage Custom Dares │
  ↓                               ▼
Player Setup                Reset Data (dialog)
  ↓
Game Setup ───(link)───► Manage Custom Dares
  ↓
Ready Lobby
  ↓
Spin
  ↓
Reveal ──► Skip Sheet (overlay)
  │    └─► Pass Dialog (overlay)
  ├──► History (reachable, not forced)
  ↓
End Session (Summary) ──► Play Again → Ready Lobby
                       └─► New Game → Landing / Home
```

---

## 3. Global UI Rules

These apply to every screen unless a screen explicitly overrides them.

### 3.1 Shared Component Library

Every screen below is built from this shared set (folder pattern per `PROJECT_CONTEXT.md` Section 6.1) — no screen invents a one-off version of these:

| Component | Used For |
|---|---|
| `AppButton` | Primary / secondary / tertiary / destructive actions |
| `AppTextInput` | Player names, custom dare text, custom pack names |
| `Chip` | Player chips, filter chips |
| `PlayerAvatar` | Colored circle + initials, all sizes |
| `DifficultyBadge` | Colored pill showing Mild / Spicy / Extreme |
| `DareCard` | Reveal screen, Spin stack |
| `ProgressBar` | Round progress on Spin/Reveal |
| `ToggleRow` | Settings switches, rule toggles on Game Setup |
| `BottomSheet` | Skip Sheet, Add/Edit Custom Dare, Manage Custom Packs |
| `Dialog` | Pass Confirmation, Reset Data Confirmation |
| `StatCard` | End Session stat row |
| `AwardCard` | End Session awards |
| `ListRow` | History rows, Settings rows, Custom Dare rows |
| `EmptyState` | Any screen with a zero-content state (Section 3.3) |

Every component above has a pixel-exact specification — dimensions, colors per state, typography, borders, shadows — in **Appendix A**. No screen or component implementation should improvise a value not found there; if a needed value is missing from Appendix A, add it there first rather than deciding it locally.

### 3.5 Layout Grid & Screen-Level Spacing

Applies to every full-screen view unless a screen explicitly overrides it:

| Rule | Value |
|---|---|
| Screen horizontal padding | 24px (`spacing.xxl`) both sides |
| Space below safe area / notch, above first content element | 16px (`spacing.lg`) in addition to the safe area inset itself |
| Gap between major sections (e.g. Difficulty block → Skip Limit block on Game Setup) | 24px (`spacing.xxl`) |
| Gap between a label and its control | 8px (`spacing.sm`) |
| Gap between related inline items (chip row, button row) | 8px (`spacing.sm`) |
| Gap between unrelated inline items sharing a row | 12px (`spacing.md`) |
| Bottom-pinned action button: bottom inset | 24px (`spacing.xxl`) above safe area |
| Bottom-pinned action button: horizontal inset | matches screen padding (24px each side) — button is full-width minus 48px total |
| Sticky header height (History's filter row, segmented controls) | 56px |
| Standard icon size (nav chevrons, header icons) | 24px |
| Small inline icon size (status icons in History rows) | 16px |
| Large decorative icon (EmptyState illustration) | 96px |

### 3.2 Navigation Conventions

- **Push (full screen):** used for every screen marked "Full screen" in Section 2. Standard transition per `PROJECT_CONTEXT.md` Section 17 (slide horizontal, `duration.standard`).
- **Modal overlay (bottom sheet):** used for Skip Sheet, Add/Edit Custom Dare, Manage Custom Packs. Dims background, slides up, dismissible by swipe-down or explicit Cancel — never by tapping the dim alone if the sheet represents an unsaved edit (Add/Edit Custom Dare), to avoid silent data loss.
- **Modal dialog (centered):** used for Pass Confirmation and Reset Data Confirmation — lighter-weight than a sheet, used only for a single yes/no decision.
- **Back button behavior (Android hardware back / gesture):** closes the topmost modal/sheet first if one is open; otherwise navigates to the previous screen in the flow above — never exits the app from a mid-flow screen without confirmation if it would discard in-progress setup (Player Setup, Game Setup, Add/Edit Custom Dare).

### 3.3 Universal Empty / Loading / Error Pattern

Per `PROJECT_CONTEXT.md` Section 13:

- **Loading:** shown only while `services/storage.ts` resolves initial data. No spinner for transitions under ~150ms.
- **Empty:** every screen that lists user data (History, Manage Custom Dares, Player Setup before any player is added) must render an `EmptyState` component with a short message and, where relevant, a primary action — never a bare blank area.
- **Error:** unrecoverable read/migration failure shows a plain-language message plus a recovery action (e.g. "Reset Data" from Settings), never a raw error or a blank screen.

### 3.4 Difficulty Color Usage

Wherever a dare's difficulty is shown (Game Setup, Reveal, History, Manage Custom Dares), it must use the same three colors consistently (`difficulty.mild` / `difficulty.spicy` / `difficulty.extreme` per `PROJECT_CONTEXT.md` Section 5.2) — never a different color mapping on different screens.

---

## 4. Screen Specifications

Each screen follows the same structure: Purpose, Entry/Exit, Layout, Data Bindings, States, Interactions, Validation (if any), Accessibility, Edge Cases.

---

### 4.1 Splash

**Priority:** ⭐⭐
**Purpose:** Brand moment while the app loads initial state (Settings, active session check).
**Entry:** App cold start only.
**Exit:** Auto-navigates to Landing/Home after a fixed duration or as soon as initial load resolves, whichever is longer (never shorter than the animation, so the logo isn't cut off mid-motion).

**Layout:**
- Centered logo mark (Section 4 of the design direction — wordmark or icon-first, per final logo decision).
- Solid `background` fill, no other content.

**Data Bindings:** none directly rendered; triggers the background load of `Settings` and a check for a persisted `Active` `GameSession` (`data_model.md` Section 12), so Landing/Home can render its "Continue Game" state immediately without its own loading flicker.

**States:** single state — no empty/error variant (a load failure here defers its message to Landing/Home, per Section 3.3, rather than blocking the splash itself).

**Interactions:** none — not tappable, no buttons.

**Accessibility:** `accessibilityLabel="DareDrop, loading"`; screen reader should not be trapped here — if load takes unusually long, focus should still be able to reach a system-level "app not responding" affordance rather than the app intercepting it.

**Edge Cases:** if the persisted session check fails (Section 3.3 error case), Splash still transitions on schedule; the error state is shown on Landing/Home, not here.

---

### 4.2 Landing / Home

**Priority:** ⭐⭐⭐⭐⭐
**Purpose:** Entry point for every session. Offers starting a new game, resuming an in-progress one, and reaching Settings/Custom Dares/About without going through gameplay setup.
**Entry:** From Splash; also the destination of "New Game" from End Session.
**Exit:** Player Setup (Start Game), Ready Lobby (Continue Game, if an `Active` session exists), Settings, Manage Custom Dares, About.

**Layout:**
- Logo mark (smaller than Splash), app name.
- Primary CTA: **Start Game** (`AppButton`, primary/accent fill) — always present.
- Conditional CTA: **Continue Game** (`AppButton`, secondary) — shown only if `services/storage.ts` resolves an `Active` `GameSession` (`data_model.md` Section 6.1). Shows a one-line summary ("Round 4 of 10 · 4 players").
- Secondary row of icon+label taps: **Settings**, **Custom Dares**.
- Footer: version number (from `About`'s same source, Section 4.11), small "About" link.
- Optional background illustration (low-key, does not compete with buttons).

**Data Bindings:** `settingsStore` (not directly rendered, but loaded), `gameSessionStore.activeSession` (existence check only, for the Continue Game conditional).

**States:**
- **Default:** no active session — only Start Game shown prominently, Continue Game absent (not grayed out — fully absent, so there's no dead button).
- **Resuming:** active session present — Continue Game shown above or alongside Start Game, visually secondary to avoid accidentally abandoning progress by tapping Start Game instead.
- **Loading:** brief skeleton/blank state only if the session check hasn't resolved by the time Splash hands off (should be rare given Splash's minimum duration).

**Interactions:**
- **Start Game:** if an `Active` session exists, must confirm before discarding it ("Starting a new game will end your current session — continue?") rather than silently overwriting `activeSession`.
- **Continue Game:** navigates directly to the current round's state — Spin or Reveal, whichever the session was last in — not back to Ready Lobby.
- Buttons slide upward on entry per original splash-to-landing motion note.

**Accessibility:** Continue Game's `accessibilityLabel` includes the round summary, not just "Continue," so a screen-reader user gets the same context sighted users get from the subtitle text.

**Edge Cases:** a persisted session that fails to load/migrate (corrupted data) must not show Continue Game at all — treat as no active session, and surface Section 3.3's error state only if the corruption is severe enough that Settings' Reset Data becomes necessary.

---

### 4.3 Player Setup ("Who's Playing?")

**Priority:** ⭐⭐⭐⭐⭐
**Purpose:** Build the player list for this session.
**Entry:** From Landing/Home's Start Game.
**Exit:** Game Setup (Next), or back to Landing/Home (Back, with confirmation if players have already been entered).

**Layout:**
- Title "Who's Playing?", subtitle "Add at least 2 players to get started."
- Text input + circular add button (accent-filled, per design direction Section 7.2).
- Live player counter (e.g. "3/20") beneath the input.
- Chip list of added players (`Chip`, colored dot = avatar color, `×` to remove).
- Helper text: "Add N more player(s) to continue" while below minimum; disappears once ≥2.
- **Next** button pinned at bottom — disabled (ghost style) until ≥2 valid players.

**Data Bindings:** `playerStore` — reads/writes `Player[]` (`data_model.md` Section 17.1) directly; this screen is the only UI surface allowed to mutate `Player.name`/`avatarColor` (`data_model.md` Section 11).

**Validation (per `data_model.md` Section 9.1):**
- Name: 1–20 characters after trim, non-empty.
- Uniqueness: case-insensitive, within this session's list — attempting a duplicate shows inline error text under the input, does not add a second chip.
- Max 20 players — the add button disables and shows a caption ("Maximum players reached") rather than silently failing.

**States:**
- **Empty:** 0 players — input + helper text only, no chip list rendered (not an empty *list component*, just absence of chips).
- **Below minimum:** 1 player — helper text visible, Next disabled.
- **Ready:** ≥2 players — Next enabled.

**Interactions:**
- Adding a player: chip pops into the list (Reanimated spring), input clears, focus returns to input for fast sequential entry.
- Removing a player: chip shrinks/fades out.
- Avatar color is assigned automatically in a fixed rotation through the palette (`PROJECT_CONTEXT.md` Section 5.2's `AvatarColor` set) — not user-chosen at this stage, to keep entry fast.

**Accessibility:** each chip's remove control has its own `accessibilityLabel` ("Remove Jordan"), not a generic "Remove" repeated identically across chips.

**Edge Cases:** rotating device orientation or backgrounding the app mid-entry must not lose in-progress (uncommitted) text in the input — acceptable to lose only if the OS itself kills the process, which is outside app-level responsibility.

---

### 4.4 Game Setup ("Set the Tone")

**Priority:** ⭐⭐⭐⭐⭐
**Purpose:** Configure `GameConfiguration` before starting.
**Entry:** From Player Setup (Next).
**Exit:** Ready Lobby (Next), or back to Player Setup.

**Layout (top to bottom, matching existing structure):**
- **Dare Pack:** segmented control, Default / Custom. A small "Manage" text link appears next to the Custom option, navigating to Manage Custom Dares (Section 4.11) without losing in-progress configuration on this screen.
- **Difficulty Level:** three `ToggleRow`s (Mild / Spicy / Extreme), each with a small difficulty-color dot (Section 3.4) preceding the label, and a short description line per row.
- **Skip Limit:** preset pill row (0 / 1 / 2 / 3 / ∞) + Custom (opens inline bottom-sheet-style input, range 0–99 per `data_model.md` Section 9.3, clamped to ≤ selected Rounds value per the same section).
- **Rounds:** preset pill row (10 / 20 / 30 / 50 / ∞) + Custom (range 5–100).
- **Gameplay Rules:** three `ToggleRow`s — No Repeat Players, No Repeat Dares, Allow Passes.
- **Next** button pinned at bottom, disabled until at least one difficulty is enabled and at least one pack with an eligible dare is selected (`data_model.md` Section 9.3).

**Data Bindings:** `gameSetupStore` — builds a draft `GameConfiguration` (`data_model.md` Section 17.4). Reads `customContentStore` to know whether any custom dares/packs exist (affects whether the Custom pack option is enabled or shown disabled with a hint to create dares first).

**Validation:** exactly `data_model.md` Section 9.3 — surfaced as: Next button disabled state (primary signal) plus a small inline hint under the Dare Pack or Difficulty section explaining *why* (e.g. "Select at least one difficulty to continue") rather than leaving the disabled button unexplained.

**States:**
- **No custom content yet:** Custom pack option shown but visually de-emphasized with a "No custom dares yet — tap Manage to add some" hint, rather than fully disabled (a user should be able to tap through to create some without leaving this screen entirely blocked).

**Interactions:**
- Custom skip-limit/rounds inputs open as inline expanding panels (matches existing design, not a separate route) — "Discard"/"Save" per input.
- Toggling "∞" for rounds disables the skip-limit's upper bound tie to rounds (Section 9.3's "skipLimit ≤ rounds" constraint is waived when rounds is unbounded — this is a deliberate, explicit exception worth a code comment where implemented).

**Accessibility:** preset pills use `accessibilityRole="radio"` within an `accessibilityRole="radiogroup"` per row group (Skip Limit, Rounds), not `button`, since selection is mutually exclusive within each group.

**Edge Cases:** switching Dare Pack from Custom back to Default after having configured custom-specific state (e.g. a difficulty combination with zero matching custom dares) must not silently carry over an invalid selection — re-validate on every pack-type change.

---

### 4.5 Ready Lobby ("Are You Ready?")

**Priority:** ⭐⭐⭐⭐
**Purpose:** Final confirmation/recap before gameplay begins; the last point before `GameConfiguration` and `players` become immutable (`data_model.md` Section 6.1).
**Entry:** From Game Setup (Next), or from End Session's "Play Again."
**Exit:** Spin (Start Game) — this transition is what moves `GameSession.state` from `Ready` to `Active`.

**Layout:**
- Title "Are You Ready?"
- **Players:** row of `PlayerAvatar` chips (colored circle + initials, not just name pills — larger than the Player Setup chips).
- **Difficulty Level:** pills showing each enabled difficulty, colored per Section 3.4.
- **Skip Limit:** plain text recap ("1 skip per player").
- **Rounds:** plain text recap — **must be present** (this was missing in the earlier draft; Rounds is one of the three core configured values and its absence here was an oversight).
- Big **START GAME** button pinned at bottom, pulsing gently while idle.

**Data Bindings:** read-only recap of `gameSetupStore`'s draft configuration and `playerStore`'s player list — no mutation happens on this screen.

**States:** single state — this screen has no meaningful empty/error variant, since it's unreachable without valid upstream state.

**Interactions:** Start Game is the only actionable control. Tapping it triggers, in order: snapshot players into the session (`data_model.md` Section 6.3), freeze configuration, create the session's first `Round` in `Pending` state, and navigate to Spin.

**Accessibility:** the avatar row should be traversable individually by screen reader (each avatar announces the player's name), not read as a single opaque image group.

**Edge Cases:** if the user backgrounds the app on this screen and returns much later, re-validate that the configuration is still internally consistent (e.g. custom dares referenced haven't been deleted in the interim via some other flow) before allowing Start Game — extremely unlikely given single-session usage, but cheap to guard.

---

### 4.6 Spin

**Priority:** ⭐⭐⭐⭐⭐
**Purpose:** The hero screen — visually commits to "something random is about to happen."
**Entry:** From Ready Lobby (Start Game) or from Reveal (Next → next round).
**Exit:** Reveal, automatically, once the shuffle animation completes.

**Layout:**
- Top: round counter ("Round 3 of 10" — omitted/replaced with just a round count if Rounds is set to ∞) + `ProgressBar` in accent color.
- Center: stack of 3–4 card backs, fanned/rotated, `surfaceElevated` fill with a subtle border.
- Bottom: one large circular Spin button, `accent` fill, subtle idle pulse/glow.

**Data Bindings:** `gameSessionStore` — on tap, invokes the randomization service (`data_model.md` Section 16 / `GAME_RULES.md`) to select the next `playerId` + `dareId`, creating the next `Round` in `Pending` state.

**States:**
- **Idle:** waiting for tap, breathing animation active.
- **Spinning:** button disabled/hidden during the shuffle sequence to prevent double-taps creating two rounds.

**Interactions:** tap Spin → cards shuffle (150–200ms per swap per the motion spec) → settle → auto-navigate to Reveal. The `Round` must fully transition to `Revealed` state before navigation fires — state and animation must never disagree about which round is showing (`PROJECT_CONTEXT.md` Section 17).

**Accessibility:** the Spin button has a clear `accessibilityLabel` ("Spin for the next player and dare"); the animation itself is decorative and marked `accessibilityElementsHidden` on its child card visuals so a screen reader doesn't attempt to read the shuffling deck.

**Edge Cases:** if `noRepeatPlayers`/`noRepeatDares` leaves no eligible pool for some reason (shouldn't happen given Section 9.3's validation, but defensively), the spin must fail gracefully with a message rather than crash — this indicates a configuration bug, not a user error, so the message should suggest returning to Game Setup.

---

### 4.7 Dare Reveal

**Priority:** ⭐⭐⭐⭐⭐
**Purpose:** Show the selected player and dare; capture the round's result.
**Entry:** From Spin, automatically.
**Exit:** Spin (Next → next round, or End Session if this was the final round), Skip Sheet (overlay), Pass Dialog (overlay).

**Layout:**
- Top: large `PlayerAvatar` + player name.
- Center: `DareCard` — background tinted with the difficulty color at low opacity, `DifficultyBadge` pill top-right.
- Bottom: three buttons ranked by "cost" — **Next** (primary, ink fill), **Skip** (secondary, outline), **Pass** (tertiary, text-only).
- Caption under buttons: "N skips remaining" (omitted if `skipLimit` is ∞).

**Data Bindings:** the current `Round` (state `Revealed`) from `gameSessionStore`; `Player`/`Dare` looked up by ID for display only, never mutated here.

**States:**
- **Default:** dare shown, all three actions available.
- **No skips remaining:** Skip button disabled/hidden (per `configuration.skipLimit`, `data_model.md` Section 15.7) rather than tappable-then-rejected.
- **Passes disabled:** if `configuration.rules.allowPasses` is false, Pass button is absent entirely, not disabled — this is a configuration choice, not a runtime limit, so it shouldn't look like a temporarily-unavailable action.

**Interactions:**
- **Next:** resolves the round with `result: "Completed"`, appends `HistoryEntry`, navigates to Spin for the next round or to End Session if this was the last.
- **Skip:** opens the Skip Bottom Sheet (Section 4.7a) for confirmation before consuming a skip.
- **Pass:** opens the Pass Confirmation Dialog (Section 4.7b).
- Card flip → scale → fade animation on entry, per the motion spec — but the dare's text/avatar must be fully legible even if this animation is interrupted or skipped (accessibility/reduced-motion principle from `PROJECT_CONTEXT.md` Section 9 of the original motion notes).

**Accessibility:** the difficulty badge's color is paired with its text label ("Spicy") — never color alone conveying difficulty, consistent with Section 11 of `PROJECT_CONTEXT.md`.

**Edge Cases:** rapid double-tap on Next must not create two resolved outcomes for the same round — the button should disable immediately on first tap until navigation completes (ties to `data_model.md` Section 9.5's "a round may only resolve once").

---

#### 4.7a Skip Bottom Sheet

**Purpose:** Confirm consumption of a skip before it's spent.
**Layout:** Title "Use a skip?", remaining-skip count, **Confirm** (danger-tinted, since it consumes a limited resource) / **Cancel**.
**Interactions:** Confirm resolves the round with `result: "Skipped"` and increments the derived skip count (computed, per `data_model.md` Section 19, from `history`); Cancel dismisses with no state change.
**Accessibility:** sheet traps focus while open; swipe-down-to-dismiss is equivalent to Cancel, not Confirm.

#### 4.7b Pass Confirmation Dialog

**Purpose:** Lightweight yes/no confirmation for a pass, which — unlike a skip — doesn't consume a limited resource.
**Layout:** Centered dialog, "Skip this dare without using a skip?" **Yes** / **Cancel**.
**Interactions:** Yes resolves the round with `result: "Passed"`; Cancel dismisses with no change.
**Note:** deliberately a `Dialog`, not a `BottomSheet` — Section 3.2's rule that a plain yes/no doesn't need a full sheet.

---

### 4.8 History

**Priority:** ⭐⭐⭐⭐
**Purpose:** Review completed rounds within the current (or a viewed archived) session.
**Entry:** Reachable from Reveal and from End Session — not a forced step in the flow.
**Exit:** Back to whichever screen it was opened from.

**Layout:**
- Sticky filter chip row at top: All / Completed / Skipped / Passed.
- List (`FlatList` per `PROJECT_CONTEXT.md` Section 12), newest first: each `ListRow` shows round number, player avatar dot, player name, truncated dare text, and a color-coded status icon (✓ success / ⏭ accent / ✗ danger).

**Data Bindings:** `gameSessionStore.history` (`HistoryEntry[]`, `data_model.md` Section 17.7) — read-only; filtering is a read-time transformation (`data_model.md` Section 19), never a separate stored filtered list.

**States:**
- **Empty:** no rounds resolved yet — `EmptyState` ("No rounds played yet — spin to get started").
- **Filtered-empty:** a filter (e.g. "Passed") yields zero rows even though history isn't empty overall — a distinct, filter-aware empty message ("No passed dares yet"), not the same generic empty state.

**Interactions:** tapping a filter chip updates the visible list only — no navigation. Rows are non-interactive (no tap-through to a detail view in v1).

**Accessibility:** filter chips use `accessibilityRole="tab"` within a `accessibilityRole="tablist"` semantics if implemented as a segmented filter, or `radiogroup`/`radio` if implemented as toggle chips — pick one pattern and apply it consistently, not a mix.

**Edge Cases:** very long dare text truncates with an ellipsis in the row; full text is not currently reachable via tap (out of scope for v1, consistent with rows being non-interactive).

---

### 4.9 End Session (Summary)

**Priority:** ⭐⭐⭐⭐
**Purpose:** Session recap and awards once the game concludes.
**Entry:** Automatically after the final round resolves, or via an explicit "End Game" action from Reveal (not yet detailed elsewhere — should exist as a low-emphasis option, e.g. in a header overflow menu on Reveal, to let a group stop early without force-completing all rounds).
**Exit:** Ready Lobby (Play Again — same players/config, fresh rounds), Landing/Home (New Game — clears the player list too).

**Layout:**
- One-time confetti burst (~1.2s, never loops, per `PROJECT_CONTEXT.md` Section 17).
- Stat row: four `StatCard`s (Total Rounds, Completed, Skipped, Passed), animating in with an 80ms stagger.
- Awards section: 2–3 `AwardCard`s (Dare Devil / Biggest Chicken / Skip Master, per `data_model.md` Section 17.9), each showing winner name + icon.
- **Play Again** (primary) / **New Game** (secondary) pinned at bottom.

**Data Bindings:** `gameSessionStore.summary` (`data_model.md` Section 17.8) — generated once, on entry to this screen, from the now-`Completed` session's `rounds`/`history`.

**States:**
- **Standard:** full stats + awards, assuming ≥1 round was resolved.
- **Degenerate (ended immediately):** if "End Game" is used with zero rounds resolved, still show the stat row (all zeros) but omit the Awards section entirely rather than showing empty/null award cards.

**Interactions:** Play Again re-enters the flow at Ready Lobby with the same `players` and `configuration` (a fresh `GameSession` is created, not a mutation of the completed one — the completed session becomes `Archived` per `data_model.md` Section 6.1). New Game returns to Landing/Home with the player list cleared, requiring Player Setup again.

**Accessibility:** confetti is purely decorative and must be hidden from screen readers (`accessibilityElementsHidden`); stat cards announce their full label + value together ("Completed, 7"), not the number alone.

**Edge Cases:** a tie for an award (e.g. two players with equal skip counts) needs a defined, deterministic tiebreak (e.g. earliest player-join order) — this belongs in `GAME_RULES.md`'s award-computation logic, flagged here as a dependency this screen relies on being resolved before implementation.

---

### 4.10 Settings

**Priority:** ⭐⭐⭐⭐
**Purpose:** App-level preferences, independent of any game session.
**Entry:** From Landing/Home.
**Exit:** Back to Landing/Home; forward to About; Reset Data opens a confirmation dialog.

**Layout (list-style rows, `ListRow`/`ToggleRow`):**
- Animations (toggle)
- Sound (toggle)
- Haptics (toggle)
- Dark Mode — present but disabled, labeled "Coming soon" (per `data_model.md` Section 17.10's reserved `theme` field — visible now so the eventual feature has a stable, already-familiar location, but inert until implemented)
- Reset Data — destructive row, danger-colored text, opens confirmation dialog before acting
- About — navigates to the About screen

**Data Bindings:** `settingsStore` (`data_model.md` Section 17.10) directly — every toggle here writes immediately, no separate "Save" step.

**States:** single state — Settings has no empty/loading variant beyond the brief initial load already covered by Splash/Landing.

**Interactions:** each toggle takes effect immediately across the app (e.g. disabling Sound silences the next haptic/audio cue with no restart required). Reset Data's confirmation dialog must clearly state what will be lost (custom dares/packs, any archived session history) before proceeding — this is a destructive, irreversible action and must not be a single accidental tap.

**Accessibility:** toggle rows use `accessibilityRole="switch"` with `accessibilityState={{ checked }}` reflecting live state, not just a visual style change.

**Edge Cases:** Reset Data while a game is `Active` must also end that session cleanly (not leave a dangling `Active` session referencing now-deleted custom content) — clear `activeSession` as part of the same reset operation.

---

#### 4.10a About

**Purpose:** Credits and version info.
**Layout:** Logo mark, version number, one-line tagline, "Built by [name] — [college]" credit, GitHub link (if the repo is public).
**Data Bindings:** version number pulled from the app's build config, not hardcoded — this is the same value Landing/Home's footer displays (Section 4.2), sourced once.
**Accessibility:** the GitHub link, if present, has a descriptive `accessibilityLabel` ("Open DareDrop's GitHub repository"), not just "Link."

#### 4.10b Reset Data Confirmation

**Purpose:** Final confirmation before an irreversible destructive action.
**Layout:** `Dialog`, plain-language warning listing exactly what will be deleted, **Reset** (danger) / **Cancel**.

---

### 4.11 Manage Custom Dares

**Priority:** ⭐⭐⭐⭐⭐
**Purpose:** Create, edit, and organize user-authored dares and packs — the screen that was previously missing entirely despite being referenced throughout `data_model.md` and `PROJECT_CONTEXT.md`.
**Entry:** From Landing/Home, or from Game Setup's "Manage" link (Section 4.4) — in both cases, returning navigates back to the originating screen with its in-progress state intact.
**Exit:** Back to origin screen (Landing/Home or Game Setup).

**Layout:**
- Segmented header: **All Dares** / **By Pack**.
- **All Dares view:** flat list of every custom dare (`ListRow`: dare text truncated, `DifficultyBadge`, pack name or "Unassigned"), each row swipeable or tapped-into for Edit/Delete.
- **By Pack view:** list of custom packs (`ListRow`: pack name, dare count — derived per `data_model.md` Section 19, not stored), tapping a pack opens it as a filtered dare list within the same screen.
- Floating/pinned **+ Add Dare** button (primary, accent).
- Secondary **+ New Pack** action, less prominent than Add Dare (creating a dare is the more common action; creating a pack is comparatively rare).

**Data Bindings:** `customContentStore` — full CRUD surface for `CustomDare[]` and `CustomPack[]` (`data_model.md` Sections 17.2–17.3, 18). This is the **only** screen permitted to mutate custom content.

**Validation (per `data_model.md` Section 9.2):**
- Dare text: 5–300 characters. Inline character counter shown while editing, with the Save button disabled outside that range.
- Difficulty: required, one of Mild / Spicy / Extreme — no unset state allowed to be saved.
- Pack assignment: optional (`packId: string | null`) — an explicit "No Pack" option must exist in the picker, not just an absence of selection, so the choice is deliberate rather than accidental.
- Pack name: required, non-empty, reasonable max length (should match the design system's general text-input bounds — flagged for `GAME_RULES.md`/implementation to pin an exact number if not already covered).

**States:**
- **Empty (no custom dares at all):** `EmptyState` — "No custom dares yet. Create your first one to make the game truly yours." with a prominent Add Dare CTA.
- **Empty pack (pack exists, zero dares assigned):** distinct empty message within the pack view ("This pack has no dares yet — add one").
- **Populated:** standard list view.

**Interactions:**
- **Add Dare:** opens the Add/Edit Custom Dare sheet (Section 4.11a) in create mode.
- **Edit (tap a row, or explicit edit affordance):** opens the same sheet pre-filled, in edit mode.
- **Delete:** per `data_model.md` Section 6.4 — if the dare is referenced by any `Archived` session's `HistoryEntry`, it is soft-deleted (`Retired`, hidden from all selection lists but not destroyed, preserving historical accuracy per `data_model.md` Section 17.7's snapshot rationale); otherwise it is hard-deleted. This distinction is invisible to the user — the delete action always just says "Delete," and the retire-vs-hard-delete decision happens transparently in `services/`.
- **Delete a pack:** confirmation dialog; deleting a pack sets its dares' `packId` to `null` (they become unassigned/"loose") rather than deleting the dares themselves — an explicit, deliberate decision worth surfacing in the confirmation copy ("Dares in this pack won't be deleted — they'll just be unassigned").

**Accessibility:** the segmented All Dares/By Pack control uses `accessibilityRole="tab"`/`tablist"` semantics; swipe-to-delete rows must have an equivalent non-gesture affordance (e.g. a visible delete icon on tap) so the action isn't gesture-only.

**Edge Cases:** attempting to delete a pack or dare currently referenced by the in-progress (not yet started) `Draft`/`Configuring` game configuration on Game Setup should either re-validate that configuration on return (Section 4.4's edge case) or, preferably, simply allow it — Game Setup already re-validates on every relevant change, so no special-case blocking is needed here.

---

#### 4.11a Add / Edit Custom Dare

**Purpose:** Create or modify a single custom dare.
**Layout:** `BottomSheet` — text area (character counter, 5–300), difficulty picker (three selectable `DifficultyBadge`-styled options), pack picker (dropdown/list including an explicit "No Pack" option), **Save** / **Cancel**.
**Interactions:** Save is disabled until validation passes (Section 4.11's rules); Cancel (or swipe-down) discards changes — per Section 3.2, swipe-down here must prompt "Discard changes?" if any field has been edited, rather than silently dropping unsaved input.

#### 4.11b Manage Custom Packs

**Purpose:** Create/rename/delete custom packs, separate from managing individual dares.
**Layout:** `BottomSheet` — list of existing packs with rename/delete affordances, plus a "+ New Pack" row at the bottom opening a simple name/description input.
**Interactions:** consistent with 4.11's pack-deletion behavior (dares become unassigned, never deleted alongside the pack).

---

## 5. Cross-Screen Interaction Rules

- **Resuming a session (Landing/Home → Spin/Reveal):** must restore the exact `Round` state the session was in, not restart from Ready Lobby — this depends on `data_model.md` Section 12's rule that an `Active` session persists continuously.
- **Custom content visibility in Game Setup:** any dare/pack created or edited in Manage Custom Dares must be immediately reflected in Game Setup's Custom pack option on return — no manual refresh, since both read from the same `customContentStore`.
- **Ending a game early:** the "End Game" action (Section 4.9's entry point) must exist somewhere reachable from Reveal (e.g. a header affordance) even though it wasn't in the original screen list — flagged here as a required addition to whichever screen owns Reveal's header, to be finalized alongside that screen's implementation.
- **Settings changes take effect immediately** across every other screen currently in memory (e.g. turning off Animations mid-game should suppress the *next* animation, not require restarting the session) — per Section 4.10's rule.

---

## 6. Appendix A — Component Specification (Pixel-Exact)

This appendix removes every remaining ambiguity from Section 3.1's component table. Every value below is final — not a suggestion, not a range to interpret. Colors reference the tokens defined in `PROJECT_CONTEXT.md` Section 5.2 by name; hex values are repeated here only for quick lookup and must stay identical to that source of truth.

### A.1 AppButton

Four variants exist. A screen never invents a fifth. Which variant to use is decided by the action's *role*, not by taste:

- **Primary (Ink)** — standard forward progress (Next, Save, Confirm, Play Again).
- **Accent CTA** — the single hero action on a screen (Start Game, Spin, the `+` add-player circle, Add Dare).
- **Secondary (Outline)** — a real but non-primary action alongside a Primary (Skip on Reveal, Cancel-that-isn't-tertiary).
- **Tertiary (Text)** — the lowest-emphasis action (Pass, "Manage" link, dialog Cancel).
- **Destructive** — anything that deletes or consumes a limited resource (Confirm-skip, Reset Data).

| Property | Primary (Ink) | Accent CTA | Secondary (Outline) | Tertiary (Text) | Destructive |
|---|---|---|---|---|---|
| Height | 56px | 56px (rect.) / 88px diameter (Spin, circular) / 40px diameter (small `+`) | 48px | 44px (padding-based, no visible box) | 56px (filled) or 44px (text-only, e.g. Settings row) |
| Background (default) | `primary` `#3A332F` | `accent` `#E8825C` | transparent | transparent | `danger` `#E05353` (filled) / transparent (text-only) |
| Background (disabled) | `#E5DFD8` | `#F0DED2` | transparent, border only | n/a — tertiary is hidden, not disabled-shown, if the action is unavailable | `#F5D9D9` (filled) |
| Text/icon color (default) | `#FFFFFF` | `#FFFFFF` | `primary` `#3A332F` | `primary` `#3A332F` (or `textSecondary` for lowest-emphasis links) | `#FFFFFF` (filled) / `danger` (text-only) |
| Text/icon color (disabled) | `textSecondary` `#8A7F76` | `textSecondary` | `textSecondary` at 60% opacity | n/a | `textSecondary` |
| Border | none | none | 1.5px solid `primary` | none | none (filled) / none (text-only, no border) |
| Radius | `radius.md` 18px | `radius.md` 18px (rect.) / 50% (circular variants) | `radius.md` 18px | n/a (no visible box) | `radius.md` 18px |
| Typography | `button` (Inter 16 SemiBold) | `button` | `button` | `button`, may drop to `body` weight Medium for lowest-emphasis links | `button` |
| Shadow (default) | none | `elevated` for circular/floating instances (Spin); none for docked instances (Start Game pinned to bottom) | none | none | none |
| Pressed | scale 0.96, 80ms (per `PROJECT_CONTEXT.md` Section 5.7) — color unchanged | scale 0.96, 80ms | scale 0.96, 80ms, background tints to `primaryContainer` `#EFE2D6` while held | scale 0.96, 80ms, or underline-on-press for link-style tertiary | scale 0.96, 80ms |
| Idle animation | none | breathing pulse (opacity 100%→85%→100%, 1.6s ease-in-out loop) — **only** on Start Game and Spin button; the small `+` circle does not pulse | none | none | none |
| Min touch target | 56×full-width | as specified, with `hitSlop` added to the 40px `+` circle to reach 44×44 | 48×88 min | 44×44 min via `hitSlop`, regardless of visible text size | 56×full-width or 44×44 |

### A.2 Chip

| Property | Value |
|---|---|
| Height | 36px |
| Padding | 12px left (when an avatar dot is present) / 16px left (no dot), 16px right, or 8px right when a remove `×` is present |
| Radius | `radius.pill` 999px |
| Background (default/unselected) | `surface` `#FFFFFF` with 1px border `rgba(36,31,28,0.08)` |
| Background (selected — filter chip active state) | `primaryContainer` `#EFE2D6`, border 1px `rgba(58,51,47,0.2)` |
| Avatar dot (if present) | 8px diameter circle, filled with the player's `avatarColor`, positioned 12px from the chip's left edge, 8px gap before the label |
| Label typography | 14px Medium (Inter) — a deliberate, documented exception to the standard `caption`/`body` sizes, sized for density within the pill |
| Label color | `textPrimary` `#241F1C` |
| Remove `×` control | 16px glyph, 24×24px tap target via `hitSlop`, color `textSecondary` default, tints to `danger` on press |
| Pop-in animation | spring scale from 0 → 1, ~220ms |
| Remove animation | scale 1 → 0.8 + fade out, 150ms |

### A.3 PlayerAvatar

| Size | Diameter | Initials Font Size | Used On |
|---|---|---|---|
| Small | 32px | 14px (caption weight, SemiBold) | Player Setup chips |
| Medium | 48px | 18px SemiBold | History rows, Reveal's secondary contexts |
| Large | 72px | 28px SemiBold | Reveal hero, Ready Lobby |

- Shape: perfect circle, fill = the player's assigned `avatarColor`.
- Initials: first letter of the player's name, uppercase, `#FFFFFF`, Poppins SemiBold, centered.
- When avatars appear in an overlapping/stacked row (Ready Lobby), each gets a 2px `#FFFFFF` border for separation; when shown singly (Reveal), no border.

### A.4 DifficultyBadge

Two presentation modes — never mixed within the same screen:

**Pill mode** (Reveal card top-right, Game Setup difficulty rows, Manage Custom Dares rows):
| Property | Value |
|---|---|
| Height | 24px |
| Padding | 10px horizontal |
| Radius | `radius.pill` |
| Background | solid difficulty color at full saturation (`#7FB37A` Mild / `#E8825C` Spicy / `#D65B5B` Extreme) |
| Text | `#FFFFFF`, 13px SemiBold (Inter) |
| Text must always be present alongside color | never a color-only pill (accessibility, Section 11) |

**Dot mode** (History rows, inline indicators where a full label would be too heavy):
| Property | Value |
|---|---|
| Diameter | 8px |
| Color | same difficulty color, full saturation |
| Always paired with adjacent text elsewhere in the row that names the difficulty at least once per screen (e.g. a legend or the dare card itself) — a bare, unlabeled dot is only acceptable when the difficulty is also stated in text within the same row |

### A.5 DareCard

| Property | Value |
|---|---|
| Width | screen width − 48px (24px padding each side) |
| Min height | 240px |
| Padding | 24px all sides |
| Radius | `radius.lg` 24px |
| Background | `surface` `#FFFFFF` with the active dare's difficulty color overlaid at 8% opacity |
| Border | 1px `rgba(36,31,28,0.06)` |
| Shadow | `resting` token |
| Dare text | `title` (Poppins 20 SemiBold), `textPrimary`, centered, max 4 lines before truncation with "…" |
| Badge position | absolute, 16px from top edge, 16px from right edge |
| Entry animation | flip (400ms) → scale 0.95→1 (150ms, overlapping tail of the flip) → fade in (200ms) |

### A.6 ProgressBar

| Property | Value |
|---|---|
| Height | 4px |
| Width | screen width − 48px |
| Radius | `radius.pill` (fully rounded ends) |
| Track color | `primaryContainer` `#EFE2D6` |
| Fill color | `accent` `#E8825C` |
| Fill transition | width animates over 200ms ease-out when the round advances — never an instant jump |

### A.7 ToggleRow / Switch

| Property | Value |
|---|---|
| Row height | 64px (title + subtitle) / 48px (single line, no subtitle) |
| Row horizontal padding | matches screen padding, 24px |
| Switch track size | 44×24px |
| Switch thumb | 20px circle, `#FFFFFF`, 2px inset from track edge |
| Track — On | `primary` `#3A332F` |
| Track — Off | `#E0DAD3` |
| Track — Disabled ("Coming soon") | 40% opacity of its current On/Off color |
| Row label — Disabled | `textSecondary`, plus a small "Coming soon" caption-styled tag (11px, `textSecondary`, no background) 8px right of the label |
| Toggle transition | thumb slides 200ms ease-out, track color cross-fades over the same duration |

### A.8 BottomSheet

| Property | Value |
|---|---|
| Top corners radius | `radius.xl` 28px (bottom corners square, flush with screen edge) |
| Background | `surfaceElevated` `#F1ECE6` |
| Handle bar | 32px wide × 4px tall, `rgba(138,127,118,0.3)`, centered, 8px from top edge |
| Content padding | 24px horizontal, 16px top (below handle), 24–32px bottom (respect device safe area, use the larger value) |
| Overlay dim | `rgba(0,0,0,0.32)`, fades in/out over 200ms |
| Shadow | `elevated` token |
| Open animation | slide up from bottom, spring, ~280ms |
| Dismiss | swipe-down gesture equivalent to Cancel; for sheets representing unsaved input (Add/Edit Custom Dare), swipe-down triggers a "Discard changes?" dialog instead of dismissing directly (Section 4.11a) |

### A.9 Dialog

| Property | Value |
|---|---|
| Width | min(320px, screen width − 48px), centered |
| Radius | `radius.xl` 28px |
| Background | `surface` `#FFFFFF` |
| Padding | 24px all sides |
| Shadow | `elevated` token |
| Backdrop | `rgba(0,0,0,0.4)`, fade 150ms (faster than a sheet's dim, since a dialog is a lighter-weight interruption) |
| Title | `heading` (18 SemiBold), `textPrimary` |
| Body text | `body` (16 Medium), `textSecondary` |
| Button layout | two buttons side by side if both fit at ≥88px width each with 12px gap; otherwise stacked, primary/destructive action on top |

### A.10 StatCard

| Property | Value |
|---|---|
| Width | (screen width − 48px − 3×12px) ÷ 4, for a 4-across row |
| Padding | 12px |
| Radius | `radius.md` 18px |
| Background | `surface`, 1px border `rgba(36,31,28,0.06)` |
| Value text | `title` (20 SemiBold), `textPrimary` |
| Label text | `caption` (13 Regular), `textSecondary` |
| Stagger animation | each card fades in + translates up 12px→0, 200ms duration, 80ms stagger delay per card index |

### A.11 AwardCard

| Property | Value |
|---|---|
| Width | screen width − 48px |
| Height | auto, ~72px |
| Radius | `radius.lg` 24px |
| Background | `surface` with a 4px solid `accent`-colored left edge bar |
| Icon | 40px circle, `primaryContainer` fill, emoji or icon centered |
| Title | `body` (16 SemiBold), `textPrimary` |
| Winner name | `caption` (13 Regular), `textSecondary` |
| Layout | icon left (16px inset), text stack right (12px gap from icon), vertically centered |

### A.12 ListRow

| Property | Value |
|---|---|
| Height | 56px (single line, Settings) / 64–72px (two-line, History) |
| Horizontal padding | 24px, matching screen padding |
| Divider | 1px `rgba(36,31,28,0.06)`, full-bleed under each row except the last in a section |
| Pressed state | background tint `surfaceElevated` while held |
| Leading element (avatar dot / icon) | 8–24px depending on row type, 12px gap before text |
| Trailing element (chevron, status icon, switch) | right-aligned, 16px from screen edge |

### A.13 EmptyState

| Property | Value |
|---|---|
| Vertical position | centered within the available content area (not the full screen if a header/filter row is present above it) |
| Illustration/icon | 96px, rendered at reduced emphasis (either `textSecondary` color or `accent` at 30% opacity — consistent per usage) |
| Title | `heading` (18 SemiBold), `textPrimary`, centered |
| Subtitle | `body` (16 Medium), `textSecondary`, centered, max width 280px |
| CTA button (if present) | 24px gap below subtitle; Accent CTA or Primary depending on the action's role (Section A.1) |

---

## 7. Document Governance

- Versioned independently (currently **v1.0** — the first canonical version of this specific document; earlier "refined design & build prompt" content is treated as superseded input, not a prior version of this file).
- Adding, removing, or reordering a screen requires a version bump here **and** a corresponding update to `PROJECT_CONTEXT.md` Section 10's navigation flow, per Section 2 of `PROJECT_CONTEXT.md`.

### Changelog

- **v1.1** — Added Appendix A: pixel-exact specification for every shared component (dimensions, colors per state, typography, borders, shadows, animation timing), plus Section 3.5's screen-level layout grid. Resolves every remaining "use the design system" ambiguity left after v1.0 into concrete, final values.
- **v1.0** — Canonical screen inventory and specifications established for all 11 priority screens plus their overlay/sub-screens. Added **Landing/Home** and **Manage Custom Dares**, both previously undefined despite being referenced elsewhere in the specification set (Section 1). Corrected Ready Lobby's missing Rounds recap. Flagged `PROJECT_CONTEXT.md` Section 10 as needing a matching version bump to stay consistent (Section 1).