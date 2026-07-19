# DareDrop — Screen Specifications

> This document is the authoritative specification for every screen within DareDrop.
>
> It defines the purpose, visual hierarchy, interaction model, layout structure, accessibility requirements, navigation responsibilities, and implementation constraints of every screen in the application.
>
> Unlike UI_SPECIFICATIONS.md, which describes the visual language and design direction, this document defines **how each screen behaves and what responsibilities it owns**.
>
> Every future screen implementation must follow this specification before writing code.
>
> If an implementation conflicts with this document, PROJECT_CONTEXT.md, or UI_SPECIFICATIONS.md, those documents take precedence unless a newer version explicitly replaces part of the specification.

---

# 1. Screen Philosophy

Every screen in DareDrop must feel like it belongs to one cohesive product.

A user should never feel that individual screens were designed independently.

Every screen should share:

- identical spacing rhythm
- identical elevation system
- identical typography hierarchy
- identical animation timing
- identical interaction patterns
- identical component behavior

Navigation between screens should feel effortless.

The application should resemble a polished consumer application created by an experienced product team rather than a collection of separate pages.

Every screen should prioritize:

- clarity
- focus
- consistency
- accessibility
- responsiveness
- predictability

No screen should overwhelm the user with unnecessary information.

The interface should always guide attention toward the current task.

---

# 2. Navigation Flow

The application follows one primary gameplay flow.

```
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
Spin
    ↓
Reveal
    ↓
...
    ↓
Summary
```

The following screens are accessible independently from gameplay.

```
Settings

About

History
```

The following interfaces are overlays.

```
Skip Bottom Sheet

Pass Confirmation Dialog

Confirmation Dialogs

Future Bottom Sheets
```

Overlay components never become standalone routes.

They appear above the currently active screen.

---

# 3. Screen Responsibilities

Each screen owns exactly one responsibility.

Screens coordinate user interaction.

Business logic belongs elsewhere.

The recommended ownership hierarchy is:

```
Screen

↓

Reusable Components

↓

Hooks

↓

Services

↓

Store

↓

Data
```

Screens may:

- compose reusable components
- request data
- dispatch user actions
- navigate

Screens should never:

- contain business rules
- contain persistence logic
- duplicate reusable UI
- define design tokens
- manipulate storage directly

---

# 4. Global Screen Layout

Every production screen should follow the same structural hierarchy.

```
SafeAreaView

└── Screen Container

      ├── Header

      ├── Scrollable Content
      │
      ├── Fixed Bottom Actions (if required)
      │
      └── Bottom Safe Area
```

This hierarchy should remain consistent throughout the application.

Headers should never suddenly move.

Primary actions should always appear in predictable locations.

Spacing should remain visually consistent across every screen.

---

# 5. Safe Areas

Every screen must respect platform safe areas.

Always wrap top-level layouts using:

- SafeAreaView
- or the project's shared screen wrapper component (if introduced later)

Interactive elements must never overlap:

- status bar
- notch
- Dynamic Island
- home indicator
- gesture navigation area

Bottom call-to-action buttons should always remain comfortably reachable without conflicting with safe area insets.

---

# 6. Shared Screen Layout Rules

Every screen must reuse the design system.

Never create screen-specific styling values.

Always import design tokens from:

```ts
import {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  animations,
} from "@/theme";
```

Never import individual token files directly.

Every screen should compose reusable components such as:

- AppText
- AppButton
- AppCard
- AppInput
- AppChip
- AppAvatar
- AppProgressBar
- AppModal
- AppBottomSheet

No production screen should render raw React Native primitives when an equivalent reusable component exists.

Examples:

Never use:

```tsx
<Text />
```

Always use:

```tsx
<AppText />
```

Never manually style buttons.

Always use AppButton.

Never manually build cards.

Always use AppCard.

---

# 7. Visual Rhythm

The visual rhythm defined in UI_SPECIFICATIONS.md must remain consistent across every screen.

Use only theme spacing tokens.

Large sections should breathe.

Interactive controls should never appear crowded.

Maintain generous whitespace.

Visual density should remain moderate.

Every screen should follow approximately this rhythm:

```
Header

↓

Primary Content

↓

Supporting Information

↓

Primary Action

↓

Bottom Safe Area
```

No screen should feel visually heavier than another.

---

# 8. Color Usage

All screens must follow the Warm Material color system.

Background

Surface

Surface Elevated

Primary Ink

Primary Container

Accent Coral

Success

Danger

Text Primary

Text Secondary

Difficulty colors

Mild

Soft Green

Spicy

Coral Orange

Extreme

Warm Red

Colors should communicate meaning rather than decoration.

Examples:

Accent Coral

Primary CTA

Success Green

Completed actions

Danger Red

Destructive actions

Difficulty colors

Gameplay categorization

No screen should introduce additional semantic colors without updating the design system.

---

# 4. Player Setup Screen

## Purpose

The Player Setup screen initializes the game by collecting all participating players before gameplay begins.

This screen is the first interactive screen of the application and should immediately communicate simplicity, warmth, and playfulness.

Users should be able to create a game in only a few seconds.

No unnecessary friction should exist.

---

## Primary Responsibilities

The screen is responsible for:

• Adding players

• Removing players

• Displaying current player count

• Assigning avatar colors

• Preventing invalid player counts

• Preparing the player list for Game Setup

The screen must not contain gameplay configuration.

Only player management belongs here.

---

## Navigation

Previous Screen

Splash

Next Screen

Game Setup

Navigation should only be possible when validation succeeds.

---

## Layout Hierarchy

Safe Area

↓

Scrollable Content

↓

Page Header

↓

Player Counter

↓

Player Name Input

↓

Add Player Button

↓

Player Chip List

↓

Validation Messages (if any)

↓

Primary Continue Button

↓

Bottom Safe Area

---

## Header

Display

Large title

Example

Who's Playing?

Subtitle

Add everyone who's joining the game.

Pass the phone around and let the fun begin.

Typography

Title → Display

Subtitle → Body

Spacing must follow theme spacing tokens.

---

## Player Counter

Position

Directly below the header.

Display

CurrentPlayers / MaximumPlayers

Examples

2 / 20

5 / 20

18 / 20

The counter updates immediately whenever players are added or removed.

Counter color uses:

colors.text.secondary

---

## Player Input

Single-line input.

Placeholder

Enter player name

Uses

AppInput

Requirements

Maximum length

20 characters

Leading/trailing whitespace should be trimmed.

Empty names are not allowed.

Names consisting only of whitespace are invalid.

Duplicate names are not allowed.

Validation occurs before insertion.

The keyboard action should trigger Add Player.

---

## Add Player Button

Component

AppButton

Variant

Primary

Color

Accent

Label

Add Player

State

Enabled

when:

• Input is not empty

• Maximum player count has not been reached

Disabled

when:

• Input is empty

• Maximum player count reached

Pressing the button:

1.

Validates the input.

2.

Creates a Player entity.

3.

Assigns an avatar color.

4.

Clears the text field.

5.

Returns focus to the input.

---

## Avatar Color Assignment

Avatar colors should be assigned automatically.

Selection strategy:

Cycle through predefined semantic avatar colors.

Example sequence

Coral

Green

Blue

Purple

Orange

Pink

Repeat if player count exceeds palette size.

Random color assignment should not be used because it may produce visually similar adjacent players.

Color assignment must remain deterministic.

---

## Player Chip List

Players appear immediately after being added.

Layout

Responsive wrapping layout.

Not a vertical list.

Each player renders using:

AppChip

Chip Contents

• Avatar color dot

• Player name

• Remove icon

Example

● Alex   ✕

Spacing between chips follows spacing tokens.

No overlapping.

No clipping.

Animations should be subtle.

Chip insertion

Small scale + fade

Chip removal

Fade + collapse

Animation duration

Approximately 180–220ms.

---

## Removing Players

Players may be removed by tapping the chip close icon.

Removal should:

Animate smoothly.

Update the player counter.

Update validation.

Re-enable the Add button if maximum count was reached.

No confirmation dialog is required.

Deletion should feel lightweight.

---

## Validation Rules

Minimum players

2

Maximum players

20

Name cannot be empty.

Name cannot exceed maximum length.

Duplicate names are rejected.

Whitespace-only names are rejected.

Validation messages should be concise.

Example

"This player already exists."

"Enter a player name."

"Maximum players reached."

Validation messages use:

colors.status.danger

Typography

Caption

---

## Continue Button

Component

AppButton

Variant

Primary

Position

Pinned near the bottom of the screen.

Label

Continue

Enabled

Only when:

Player count ≥ 2

Disabled

Otherwise.

Disabled styling follows the design system.

No custom disabled styles should be introduced.

---

## Empty State

When no players exist:

Display an illustration or subtle placeholder icon (future enhancement).

Text

No players added yet.

Start by entering your first player above.

Avoid making the screen feel empty or broken.

---

## Interaction Summary

User enters name

↓

Tap Add Player

↓

Player chip animates into list

↓

Counter updates

↓

Continue button enables after second player

↓

Navigate to Game Setup


# 8. Spin Screen

## Purpose

The Spin Screen is the centerpiece of the DareDrop experience.

It builds anticipation before revealing the next player and dare.

Unlike traditional random generators, the interaction should feel physical, playful, and satisfying while remaining quick enough to keep party momentum.

This screen exists purely to create excitement between rounds.

---

## Responsibilities

The screen is responsible for:

* displaying current game progress
* allowing the player to initiate the next round
* visually communicating randomness
* selecting the next player
* selecting a valid dare
* transitioning to the Reveal Screen

The screen must never expose the randomization algorithm.

The experience should always feel fair and unpredictable.

---

## Layout Hierarchy

```
SafeAreaView

├── Header
│   ├── Round Counter
│   └── Progress Bar
│
├── Main Content
│   ├── Decorative Card Stack
│   └── Empty Space
│
├── Primary CTA
│   └── Large Circular Spin Button
│
└── Bottom Safe Area
```

---

## Header

Display:

```
Round 3 of 10
```

Below it:

A thin progress bar representing current progress.

Progress should animate smoothly after each completed round.

---

## Card Stack

The center of the screen contains three to four stacked cards.

Cards should:

* use elevated surface color
* use resting card shadow
* use 24px radius
* include subtle border
* be rotated slightly

Example

```
      _________
     /        /
    /________/

       _________
      /        /
     /________/

          _________
         /        /
        /________/
```

The stack exists purely for visual anticipation.

No interaction occurs directly with these cards.

---

## Spin Button

Large circular button.

Uses Accent color.

Idle state:

Subtle breathing animation.

Tap:

1.

Scale down.

2.

Trigger haptic.

3.

Shuffle animation.

4.

Navigate to Reveal.

---

## Randomization

The screen should never randomly choose:

the same player twice consecutively

unless game rules explicitly allow it.

Dares should avoid repetition whenever possible.

If all available dares have been exhausted:

shuffle history

restart pool

This behavior should be handled by gameplay services, not the screen itself.

---

## Animation Sequence

Idle

↓

Button press

↓

Card shuffle

↓

Card settle

↓

Small delay

↓

Navigate

Entire interaction:

~900ms

Never longer than 1200ms.

---

## Motion Specification

Button

96%

↓

Spring back

Cards

Quick horizontal swaps

Small rotations

Ease-out settle

Progress bar

Animated width

Duration

250ms

---

## Accessibility

Provide:

```
accessibilityRole="button"

accessibilityLabel="Spin to select the next player"

accessibilityHint="Starts the next round"
```

Animations must not prevent gameplay.

Reduce Motion users should still receive instant feedback.

---

# 9. Reveal Screen

## Purpose

Reveal the selected player and their assigned dare.

This is the most important screen in the application.

Everything on this screen should focus attention on the current player's challenge.

---

## Responsibilities

Display:

* selected player
* avatar
* assigned dare
* difficulty
* remaining skips
* gameplay actions

---

## Layout Hierarchy

```
SafeAreaView

├── Player Section
│   ├── Avatar
│   └── Name
│
├── Dare Card
│   ├── Difficulty Badge
│   └── Dare Text
│
├── Remaining Skip Counter
│
├── Action Buttons
│   ├── Next
│   ├── Skip
│   └── Pass
│
└── Safe Area
```

---

## Player Section

Contains:

Large avatar

Player name

Avatar uses assigned avatar color.

Player name uses:

Title typography.

Centered horizontally.

---

## Dare Card

The Dare Card is the visual focal point.

Requirements:

Surface card

24px radius

Card shadow

Hairline border

Generous padding

Difficulty tint applied using low-opacity semantic color.

Examples

Mild

Soft green tint

Spicy

Soft coral tint

Extreme

Soft red tint

Text must always maintain AA accessibility contrast.

---

## Difficulty Badge

Position:

Top-right corner.

Examples

🟢 Mild

🟠 Spicy

🔴 Extreme

Badge uses:

Rounded pill

Semantic fill

White label

Small padding

---

## Dare Text

Typography:

Title

Centered

Readable line height

No truncation.

Support multiline.

Long dares should naturally wrap.

---

## Remaining Skip Counter

Small caption.

Example

```
2 skips remaining
```

Uses Caption typography.

Secondary text color.

---

## Action Buttons

Three actions:

Primary

Next

Secondary

Skip

Tertiary

Pass

Visual priority

```
Next

Skip

Pass
```

Never make destructive actions visually stronger than the primary CTA.

---

## Interaction Rules

Next

Completes round.

Skip

Opens Skip Bottom Sheet.

Pass

Opens Pass Confirmation Dialog.

Buttons should use shared AppButton variants.

---

## Reveal Animation

Card enters with:

Scale

↓

Fade

↓

Settle

Duration

250ms

Animation occurs only once.

---

## Accessibility

Player name

Accessible.

Difficulty

Announced.

Buttons

Proper labels.

Screen readers should read:

Player

↓

Difficulty

↓

Dare

↓

Remaining skips

↓

Actions

---

# 10. Skip Bottom Sheet

## Purpose

Allow players to spend one available skip.

---

## Responsibilities

Display:

Remaining skips

Confirmation message

Confirm

Cancel

---

## Layout

```
Overlay

↓

Bottom Sheet

├── Handle
├── Title
├── Remaining Count
├── Description
├── Confirm Button
└── Cancel Button
```

---

## Behavior

Confirm:

Consumes one skip.

Dismisses sheet.

Advances to next round.

Cancel:

Dismisses only.

No gameplay changes.

---

## Visual Design

Background:

Surface Elevated

Radius:

Large top corners

Shadow:

Sheet elevation

Overlay:

```
rgba(0,0,0,0.32)
```

---

## Confirm Button

Uses danger emphasis because:

A skip is a limited resource.

It communicates:

"Are you sure?"

without feeling destructive.

---

## Animation

Slide from bottom.

Spring animation.

Dismiss:

Reverse spring.

---

## Accessibility

Trap focus inside the sheet.

Dismiss via accessibility escape gesture.

Announce remaining skip count when opened.

---

# 11. Screen State Management

Every screen must have clearly defined ownership of its state.

## Local State

Local state should only contain transient UI information.

Examples:

- currently focused input
- sheet visibility
- dialog visibility
- loading indicators
- temporary animations
- search query
- keyboard visibility

Local state should never contain application business data.

---

## Global State

Global state should contain only shared application data.

Examples:

- players
- game configuration
- current game session
- history
- summary
- application settings
- custom dare packs

Global state should not contain presentation-only information.

---

## Derived State

Whenever possible, compute values instead of storing them.

Examples:

Player Count

Derived from:

players.length

Remaining Skips

Derived from:

skipLimit - skippedRounds

Completion Percentage

Derived from history.

Avoid duplicating derived values in state.

---

# 12. Loading & Empty States

Every screen that displays dynamic content must define:

Loading State

Empty State

Error State

Even if the current implementation does not require them.

Future-proof the architecture.

---

## Loading State

Use skeleton placeholders where appropriate.

Avoid full-screen spinners unless absolutely necessary.

Buttons should indicate loading through disabled states.

---

## Empty State

Examples:

No Players

No History

No Custom Packs

No Custom Dares

Empty states should:

- explain why content is empty
- suggest the next action
- remain visually lightweight

---

## Error State

Although DareDrop is offline-first, runtime failures can still occur.

Examples:

Storage failure

Corrupted custom pack

Unexpected persistence issue

Gracefully display:

- title
- explanation
- recovery action

Never crash silently.

---

# 13. Screen Lifecycle

Each screen has clearly defined lifecycle responsibilities.

---

Splash

Initialize application resources.

Validate persisted data.

Navigate automatically.

---

Player Setup

Create and edit players.

Do not initialize gameplay.

---

Game Setup

Configure the upcoming game.

Configuration remains editable until Start Game.

---

Ready Lobby

Review configuration.

No mutations except returning to previous screens.

---

Spin

Perform random selection.

No UI should allow modifying configuration.

---

Reveal

Execute round outcome.

Update session history.

Proceed to next round.

---

History

Read-only.

Never mutate gameplay.

---

Summary

Read-only.

Derived entirely from completed session data.

---

Settings

Mutate only application preferences.

Never modify gameplay.

---

About

Purely informational.

Contains no mutable state.

---

# 14. Accessibility Standards

Accessibility is a first-class requirement.

Every screen must support:

✓ Screen readers

✓ Font scaling

✓ Keyboard navigation (where applicable)

✓ High contrast

✓ Logical reading order

✓ Accessible touch targets

---

## Text

Every visible text element must use:

<AppText />

Never render React Native Text directly.

---

## Buttons

Every button must define:

accessibilityRole="button"

accessibilityLabel

accessibilityHint (when useful)

---

## Inputs

Every input must expose:

placeholder

accessibilityLabel

returnKeyType

autoCorrect

autoCapitalize

appropriate keyboardType

---

## Dialogs

Dialogs must trap accessibility focus.

Focus should return to the previously focused element after dismissal.

---

## Bottom Sheets

Bottom sheets should announce themselves when opened.

Background content should not receive accessibility focus while the sheet is active.

---

# 15. Performance Standards

Screens should render efficiently.

---

Avoid

Inline objects

Inline arrays

Anonymous callbacks

Heavy computations during render

Nested FlatLists

Unnecessary state duplication

---

Prefer

React.memo

useMemo

useCallback

FlatList

SectionList

Lazy loading

Virtualized rendering

Derived selectors

---

Lists

History

Players

Custom Packs

Custom Dares

must use FlatList or SectionList.

Never render large datasets using ScrollView.

---

# 16. Animation Guidelines

Motion should communicate state changes.

Never animate for decoration alone.

---

Standard Navigation

Duration:

200–250 ms

Curve:

Ease Out

---

Button Press

Scale:

96%

Duration:

80 ms

Spring back naturally.

---

Spin Screen

Card shuffle:

150–200 ms

Cards settle before navigation.

Spin button performs a subtle idle breathing animation only.

---

Reveal Screen

Single entrance animation.

The dare card should not continuously animate.

---

Summary Screen

Confetti:

One-time playback (~1.2 seconds).

Statistics cards animate in with staggered entrances (~80 ms apart).

Never loop celebratory animations.

---

Reduced Motion

Animations should never be required to understand the interface.

If animations are skipped, the screen must remain fully usable.

---

# 17. Visual Consistency Rules

Every screen must feel like part of one cohesive product.

Maintain:

- identical spacing rhythm
- consistent elevations
- consistent corner radii
- unified typography
- semantic color usage
- predictable interaction patterns

Do not invent one-off layouts or styles.

If a new visual pattern is genuinely required, update the design system first.

---

# 18. AI Implementation Workflow

Before implementing any screen:

1. Read PROJECT_CONTEXT.md completely.

2. Read UI_SPECIFICATIONS.md completely.

3. Read GAME_RULES.md.

4. Read DATA_MODEL.md.

5. Read COMPONENT_GUIDELINES.md.

6. Read CURRENT_STATE.md.

7. Read SCREEN_SPECIFICATIONS.md.

8. Inspect the existing reusable components.

9. Reuse components whenever possible.

10. Reuse existing services, hooks, stores, utilities and types.

11. Preserve public APIs unless an explicit refactor is requested.

12. Never duplicate business logic.

13. Never duplicate UI components.

14. Follow the Warm Material design language exactly.

15. Match the official Figma design before introducing improvements.

16. Validate TypeScript.

17. Validate ESLint.

18. Verify accessibility.

19. Verify responsiveness.

20. Stop after completing only the requested screen.

---

# 19. Definition of Production Ready

A screen is considered production-ready only when all of the following are true:

✓ Matches the official Figma design

✓ Follows Warm Material principles

✓ Uses only reusable components

✓ Uses only theme tokens

✓ No hardcoded colors

✓ No hardcoded spacing

✓ No hardcoded typography

✓ No hardcoded radius

✓ No duplicated business logic

✓ Responsive across supported devices

✓ Accessible

✓ Strictly typed

✓ ESLint clean

✓ TypeScript clean

✓ No unnecessary re-renders

✓ Memoized where appropriate

✓ Animation tokens respected

✓ Public APIs preserved

✓ Consistent with every other screen in the application

Only after satisfying every requirement should a screen be considered complete.

