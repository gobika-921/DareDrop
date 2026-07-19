# Phase 1 — Foundation Stabilization (Blocking Sprint)

> **Goal:** Stabilize the project foundation before implementing a single production screen. This phase eliminates architectural drift, fixes documentation inaccuracies, aligns the design system with the canonical specification, and builds the minimum platform required for feature development.
>
> **Outcome:** After this phase, DareDrop becomes a trustworthy, specification-aligned platform that future gameplay and UI development can safely build upon.

---

# Phase Objectives

This phase focuses exclusively on foundation work.

No gameplay features, no navigation flow, and no production screens should be implemented during this phase.

Instead, this sprint resolves every issue that would otherwise cause large-scale refactoring later in development.

---

# 1. Documentation Integrity

## Objective

Bring every documentation file back into sync with the actual repository.

Documentation becomes the single source of truth.

---

## Tasks

### Restore GAME_RULES.md

Current issue:

* File is corrupted
* Contains duplicated CURRENT_STATE content
* Actual gameplay rules are missing

Replace it with proper documentation covering:

* player turn algorithm
* random selection rules
* skip logic
* pass logic
* history recording
* awards
* statistics
* end-game conditions
* edge cases
* tie-breaking
* randomization guarantees

---

### Correct CURRENT_STATE.md

Current file significantly overstates implementation.

Update it to accurately reflect:

Implemented

* Expo Router shell
* Theme system
* Existing reusable components
* Font loading
* Tooling

Not Implemented

* Screens
* Navigation flow
* Zustand stores
* Services
* Persistence
* Bundled dare packs
* Gameplay
* Tests

This document must always represent repository reality.

---

### Cross-check all documentation

Verify consistency across:

* PROJECT_CONTEXT.md
* UI_SPECIFICATION.md
* COMPONENT_GUIDELINES.md
* SCREEN_SPECIFICATIONS.md
* DATA_MODEL.md
* GAME_RULES.md
* CURRENT_STATE.md

Resolve conflicting statements.

Examples:

* Landing/Home screen references
* Theme token definitions
* Component inventories
* Navigation flow
* Feature completeness

---

# 2. Design System Reconciliation

## Objective

The implementation must exactly match PROJECT_CONTEXT.md.

The documentation is the canonical design source.

---

## Colors

Verify every semantic color.

Ensure:

* identical naming
* identical hierarchy
* identical values

Remove token drift.

---

## Typography

Update typography scale to specification.

Correct:

* font sizes
* line heights
* font weights
* semantic naming

Remove undocumented variants.

---

## Spacing

Replace current spacing scale with documented scale.

Every spacing token must match the specification exactly.

---

## Radius

Replace current radius system with specification.

No undocumented values should remain.

---

## Elevation

Replace current three-level shadow system.

Implement only:

* resting
* elevated

Exactly as defined.

---

## Motion

Rename and align motion tokens.

Current

```
theme/animations.ts
```

Expected

```
theme/motion.ts
```

Ensure exported API matches documentation.

---

## NativeWind

Current implementation contains unrelated dark theme variables.

Either

* fully align CSS variables with Warm Material

or

* temporarily remove them until dark mode exists.

There must never be two competing design systems.

---

# 3. Component Library Stabilization

## Objective

Fix every reusable component before screens begin.

No screen should require modifying shared components later.

---

## Remove Duplicate AppText

Current issue:

Two AppText implementations exist.

Keep only one.

Merge:

* hex-safe color resolution
* accessibility improvements
* current API

Delete obsolete implementation.

---

## Fix AppButton

Critical blocker.

Fix:

* invisible primary text
* semantic color lookup
* proper button heights
* missing accent variant
* disabled appearance
* loading state consistency

Validate:

* contrast
* accessibility
* focus behavior

---

## Fix AppCard

Align with specification:

* radius
* elevation
* padding
* shadow strength

---

## Fix AppInput

Align:

* border radius
* focus styling
* spacing
* validation states

---

## Fix AppChip

Correct:

* height
* padding
* typography
* touch targets

---

## Fix AppAvatar

Correct:

* color type
* borders
* sizing
* hitSlop
* accessibility

---

## Fix AppSwitch

Correct:

* thumb travel distance
* active colors
* animation timing
* interaction consistency

---

## Validate Remaining Components

Review:

* AppDivider
* AppText

Ensure full specification compliance.

---

# 4. Missing Core Components (P0)

## Objective

Implement the reusable components required by every screen.

---

Implement:

### AppModal

Reusable modal wrapper

Supports

* confirmation dialogs
* alerts
* destructive actions

---

### AppBottomSheet

Reusable sheet component

Supports

* skip dialog
* player actions
* settings

---

### AppProgressBar

Reusable progress indicator

Supports:

* rounds
* loading
* gameplay progression

---

### AppEmptyState

Reusable empty state

Supports:

* history
* custom dares
* packs

---

All components must follow:

* theme
* accessibility
* memoization
* documentation
* animation standards

---

# 5. Project Structure Validation

Review folder ownership.

Ensure every module belongs to exactly one location.

Validate:

```
app/

components/

theme/

hooks/

constants/

types/

services/

store/

data/

animations/

utils/
```

Remove ambiguity.

No duplicate ownership.

---

# 6. Dependency Audit

Review every installed dependency.

Classify as:

Required Now

Required Later

Remove

Current candidates:

* zustand
* nanoid
* dayjs
* clsx
* tailwind-merge
* class-variance-authority
* carousel

Document why each dependency exists.

Unused packages should not remain indefinitely.

---

# 7. Build System Validation

Confirm:

* TypeScript strict passes
* ESLint passes
* import ordering
* aliases
* Expo configuration
* Metro configuration

Fix any remaining warnings.

Target:

Zero lint warnings.

Zero type errors.

---

# 8. Font & Launch Flow

Current implementation shows a blank screen while fonts load.

Replace with proper Expo SplashScreen handling.

Flow:

```
Native Splash

↓

Load Fonts

↓

Hide Splash

↓

Navigate to App
```

No blank frame.

No flicker.

---

# 9. Repository Cleanup

Remove:

* dead files
* duplicate modules
* obsolete exports
* stale comments
* inaccurate TODOs

Verify barrel exports.

Verify imports.

Ensure consistent naming.

---

# Deliverables

By the end of Phase 1, the repository should include:

* Correct documentation
* Restored GAME_RULES.md
* Accurate CURRENT_STATE.md
* Unified design tokens
* Stabilized theme system
* Fixed shared components
* AppModal
* AppBottomSheet
* AppProgressBar
* AppEmptyState
* Single AppText implementation
* Correct button accessibility
* Fixed launch flow
* Clean repository structure
* Zero architectural drift

---

# Exit Criteria

Phase 1 is complete only if all of the following are true:

* Documentation matches implementation.
* Every design token matches the specification.
* No duplicate modules remain.
* Shared components are production-ready.
* Core reusable components are complete.
* Theme system is fully aligned.
* Font loading uses Expo SplashScreen correctly.
* Repository passes TypeScript without errors.
* Repository passes ESLint without warnings.
* Repository structure is clean and deterministic.
* The project foundation is stable enough to begin implementing screens without future architectural rework.

# Phase 2 — Core UI Foundation & Design System Completion

> **Objective**
>
> Complete the shared UI component library so every screen in the application can be built entirely from reusable, production-grade components. No gameplay logic or navigation should be implemented during this phase.

---

# Goal

Transform the existing design system into a complete, production-ready component library that fully matches the specifications in:

- PROJECT_CONTEXT.md
- UI_SPECIFICATION.md
- COMPONENT_GUIDELINES.md

After this phase:

- every common UI element exists
- every component follows one API style
- every component follows the design tokens
- no screen requires custom UI implementation

This phase finishes the UI platform before building any screens.

---

# Success Criteria

- Complete component library
- Pixel-consistent implementation
- Full accessibility support
- Dark mode ready architecture
- Zero duplicated styling logic
- Every component documented
- No token violations
- Production quality animations
- Theme-driven styling only

---

# 2.1 Fix Existing Components

Before creating new components, existing ones must fully match the specification.

---

## AppButton

Current audit issues:

- Fix invisible primary button text
- Replace incorrect semantic color lookup
- Add Accent variant
- Verify all sizes
- Verify loading state
- Verify disabled state
- Verify icon spacing
- Verify minimum touch target
- Improve pressed animation
- Add focus state
- Add accessibility improvements

Final variants:

- Primary
- Secondary
- Accent
- Ghost
- Destructive
- Text

Support:

- icons
- loading
- disabled
- fullWidth
- different sizes

---

## AppCard

Fix:

- Radius
- Elevation
- Padding
- Pressable variant
- Surface variants
- Interactive animation

---

## AppInput

Improve:

- validation states
- helper text
- character count
- prefix
- suffix
- password visibility
- multiline
- accessibility labels
- focus styling

---

## AppChip

Fix:

- correct height
- spacing
- selected state
- removable chips
- icon chips

---

## AppAvatar

Fix:

- AvatarColor enum
- borders
- initials rendering
- sizes
- accessibility
- press feedback

---

## AppSwitch

Fix:

- thumb animation
- ON colors
- OFF colors
- Reanimated animation
- accessibility

---

## AppDivider

Verify:

- spacing
- orientation
- inset variants

---

## AppText

Consolidate duplicate implementations.

Requirements:

- single source
- semantic colors
- hex fallback
- typography variants
- accessibility support

Delete duplicate AppText.tsx.

---

# 2.2 Build Missing Components

Implement every documented reusable component.

---

## AppModal

Supports:

- confirmation dialogs
- alerts
- custom content
- destructive actions
- animation
- accessibility

---

## AppBottomSheet

Supports:

- skip confirmation
- menus
- future extensions

Features:

- drag gesture
- snap points
- backdrop
- keyboard handling

---

## AppProgressBar

Supports:

- game progress
- loading
- animated fill

---

## AppEmptyState

Supports:

- illustration
- title
- subtitle
- optional action

Used by:

- History
- Custom dares
- Packs

---

## AppDareCard

Contains:

- difficulty badge
- dare text
- category
- premium styling

---

## DifficultyBadge

Supports:

- Easy
- Medium
- Hard
- Extreme

---

## AwardCard

Used by:

- Summary screen

Contains:

- icon
- title
- description

---

## StatisticCard

Displays:

- number
- label
- optional trend
- icon

---

## ListRow

Reusable settings row.

Supports:

- icon
- title
- subtitle
- trailing widget
- chevron
- switch

---

## SectionHeader

Reusable screen section title.

---

## ScreenContainer

Shared layout wrapper.

Responsibilities:

- SafeArea
- keyboard handling
- consistent padding
- scrolling
- background color

Every screen must use ScreenContainer.

---

## LoadingOverlay

Reusable full-screen loader.

---

## ConfirmationDialog

Reusable confirmation dialog built using AppModal.

---

## Toast

Reusable temporary feedback component.

Future use:

- import success
- delete success
- save success

---

# 2.3 Component Folder Standardization

Every component follows exactly the same structure.

Example:

```
components/
    AppButton/
        index.ts
        AppButton.tsx
        styles.ts
        types.ts
```

No loose component files.

---

# 2.4 Styling Rules

Every component must:

- use theme tokens
- avoid hardcoded colors
- avoid hardcoded spacing
- avoid duplicated values

Never use:

```
padding: 14
margin: 17
color: "#FFFFFF"
```

Always use:

```
spacing
radius
colors
typography
shadows
motion
```

---

# 2.5 Accessibility

Every component must include:

- accessibilityRole
- accessibilityLabel
- accessibilityHint where appropriate
- minimum 44dp touch target
- TalkBack compatibility
- VoiceOver compatibility

---

# 2.6 Motion

Replace JS-thread animations with Reanimated.

Use:

- scale
- opacity
- elevation
- ripple
- transitions

Animation durations must come from theme tokens.

---

# 2.7 Documentation

Every component should include:

- purpose
- props
- usage example
- accessibility notes
- supported variants

---

# Deliverables

By the end of this phase, the repository should include:

- Fixed AppButton
- Fixed AppCard
- Fixed AppInput
- Fixed AppChip
- Fixed AppAvatar
- Fixed AppSwitch
- Fixed AppDivider
- Consolidated AppText
- AppModal
- AppBottomSheet
- AppProgressBar
- AppEmptyState
- AppDareCard
- DifficultyBadge
- AwardCard
- StatisticCard
- ListRow
- SectionHeader
- ScreenContainer
- LoadingOverlay
- ConfirmationDialog
- Toast

All components should:

- use design tokens exclusively
- be fully accessible
- support dark mode architecture
- use Reanimated where appropriate
- expose clean, reusable APIs
- match the UI specification
- be production-ready

---

# Exit Criteria

Phase 2 is complete only when:

- Every shared component defined in the specifications has been implemented.
- Existing components fully conform to the design system.
- Duplicate implementations have been removed.
- No component contains hardcoded design values.
- All animations use the shared motion system.
- All components satisfy accessibility requirements.
- Every screen required by the product can be built exclusively using the shared component library without introducing screen-specific UI primitives.

# Phase 3 — Domain Layer, Persistence & Offline Engine

## Objective

Build the complete application backbone before implementing any screens.

At the end of this phase the application should have:

- complete domain models
- persistent storage
- Zustand state management
- offline-first architecture
- bundled dare packs
- randomization engine
- gameplay services
- award calculation
- session recovery
- versioned persistence

No UI should depend on mock data after this phase.

---

# Success Criteria

After this phase:

- every piece of game state lives inside Zustand
- every store persists correctly
- all domain types match DATA_MODEL.md
- bundled dare packs load successfully
- sessions survive app restarts
- services contain business logic
- screens can become thin presentation layers

---

# 3.1 Create Domain Types

Create the complete domain layer under:

```
types/
```

Implement every model defined in:

```
docs/DATA_MODEL.md
```

Examples include:

```
Player
GameSettings
GameSession
Round
Dare
DarePack
Difficulty
Award
HistoryEntry
CustomPack
AppSettings
Statistics
SessionState
```

Requirements:

- readonly where appropriate
- discriminated unions
- enums replaced with literal unions where beneficial
- reusable utility types
- exported from barrel

No duplicated interfaces.

---

# 3.2 Build Storage Layer

Create

```
services/storage.ts
```

This becomes the only persistence API.

No component or store should directly call AsyncStorage.

Responsibilities:

- save()
- load()
- remove()
- clear()
- migrate()
- export()
- import()

Include:

- schema version
- migration support
- corruption detection
- safe parsing
- fallback defaults

Never expose raw AsyncStorage.

---

# 3.3 Define Storage Keys

Create

```
constants/storage.ts
```

Centralize every key.

Example

```
SETTINGS
GAME_SESSION
PLAYERS
CUSTOM_DARES
CUSTOM_PACKS
STATISTICS
APP_VERSION
```

No hardcoded storage strings.

---

# 3.4 Build Repository Layer

Create services that sit above storage.

Example:

```
PlayerRepository
SettingsRepository
SessionRepository
HistoryRepository
CustomPackRepository
StatisticsRepository
```

Responsibilities:

- persistence
- serialization
- deserialization
- validation
- migration

No business logic.

---

# 3.5 Implement Zustand Stores

Create

```
store/
```

Implement:

```
settingsStore
playerStore
gameSetupStore
gameSessionStore
historyStore
statisticsStore
customContentStore
uiStore
```

Each store should expose:

State

Selectors

Actions

Computed values

Reset methods

Persistence hooks

Avoid giant monolithic stores.

---

# 3.6 Store Design Rules

Stores should never:

- manipulate UI directly
- navigate
- display alerts
- call React hooks
- contain component logic

Stores only manage application state.

---

# 3.7 Implement Randomization Engine

Create

```
services/randomizer.ts
```

Requirements:

No repeated dares until pack exhausted.

Respect:

- enabled packs
- difficulty
- player history
- skipped dares
- passed dares

Support:

```
Next Dare
Shuffle
Reset
Replay
```

Algorithm must be deterministic when seeded.

---

# 3.8 Dare Loading Engine

Create

```
services/dareLoader.ts
```

Responsibilities:

Load:

```
bundled packs

custom packs

merged packs
```

Validate:

- schema
- ids
- duplicates
- difficulty

Reject malformed data.

---

# 3.9 Session Engine

Create

```
services/session.ts
```

Responsibilities:

Create session

Resume session

Save progress

Advance round

Advance player

Finish session

Reset session

Recover interrupted games.

---

# 3.10 History Service

Create

```
services/history.ts
```

Responsibilities:

Add entry

Remove entry

Filter

Search

Sort

Statistics generation

History should be immutable once written.

---

# 3.11 Statistics Engine

Create

```
services/statistics.ts
```

Compute:

Games played

Rounds played

Completed dares

Skipped

Passed

Favorite difficulty

Player participation

Completion %

Average skips

Average passes

Play time

Everything derived automatically.

---

# 3.12 Award Engine

Create

```
services/awards.ts
```

Implements GAME_RULES.md.

Responsible for:

Most Brave

Most Chaotic

Most Skipped

Most Passed

Wildcard awards

Tie-breaking

Should be pure functions.

---

# 3.13 Validation Layer

Create

```
services/validation.ts
```

Validate:

Players

Game settings

Custom dares

Custom packs

Storage imports

No invalid state should enter stores.

---

# 3.14 Seeded Random Utilities

Create

```
utils/random.ts
```

Support:

```
seed

shuffle

pick

weighted pick

unique pick
```

Avoid Math.random directly.

---

# 3.15 Offline Data Packs

Populate

```
data/
```

with bundled packs.

Minimum:

```
Classic
Chaos
Extreme
```

Each pack should:

have metadata

difficulty

categories

unique ids

No placeholder text.

---

# 3.16 Constants

Create centralized constants:

```
difficulty.ts

awards.ts

limits.ts

defaults.ts

routes.ts
```

Avoid magic numbers.

---

# 3.17 Error Handling

Implement shared result pattern.

Example:

```
Success<T>

Failure<E>
```

Avoid throwing expected runtime errors.

Prefer typed failures.

---

# 3.18 Dependency Rules

Architecture should become:

```
UI

↓

Stores

↓

Services

↓

Repositories

↓

Storage
```

Never allow reverse dependencies.

---

# 3.19 Testing

Add Jest.

Write unit tests for:

Randomizer

Award engine

Validation

Storage

Repositories

Statistics

Session engine

Target:

>90% coverage on services.

---

# 3.20 Documentation

Update:

CURRENT_STATE.md

Architecture diagrams

Folder tree

Service responsibilities

Store responsibilities

Persistence schema

Migration strategy

---

# Exit Criteria

This phase is complete only when:

- all domain types implemented
- all stores functional
- persistence working
- bundled packs loading
- session recovery working
- statistics generated
- awards generated
- randomization tested
- services unit tested
- architecture follows UI → Store → Service → Repository → Storage
- zero mock data required by future screens
- documentation updated to match implementation

# Phase 4 — Core Game Engine & Domain Logic

## Objective

Implement the complete gameplay engine that powers DareDrop. This phase transforms the project from a collection of screens into a fully functional offline game by building the domain layer, business rules, gameplay lifecycle, persistence integration, statistics, awards, and validation systems.

This phase must contain **zero UI-specific business logic**. Screens should only display state and dispatch actions. All gameplay decisions must originate from the domain layer.

---

# 4.1 Domain Architecture

## Goal

Implement a clean separation between UI, state management, and business logic.

Target architecture:

UI Screens
↓
UI Components
↓
Zustand Stores
↓
Domain Services
↓
Persistence Layer

Business rules must never exist inside:

- React Components
- Expo Router pages
- UI hooks

Business rules belong exclusively inside services.

---

# 4.2 Gameplay State Machine

Define the complete gameplay lifecycle.

```
IDLE
↓
NEW GAME
↓
PLAYER TURN
↓
DARE SELECTION
↓
DARE REVEAL
↓
PLAYER ACTION
↓
TURN COMPLETE
↓
NEXT PLAYER
↓
ROUND COMPLETE
↓
NEXT ROUND
↓
GAME COMPLETE
↓
SUMMARY
↓
FINISHED
```

Every transition must be deterministic.

Invalid transitions must be rejected.

Example:

Cannot reveal a dare before selecting one.

Cannot finish a round twice.

Cannot start a new turn while another is active.

---

# 4.3 Game Session Management

Implement the complete lifecycle of a game session.

Responsibilities:

- Create session
- Resume session
- Save session
- End session
- Delete session
- Reset session

Session must contain:

- unique session id
- timestamp
- players
- settings
- rounds
- history
- statistics
- awards
- active player
- current round
- completed state

Only one active session may exist at a time.

---

# 4.4 Player Rotation Engine

Implement deterministic player rotation.

Requirements

- Circular rotation
- No skipped players
- No duplicate turns
- Support 2–12 players
- Preserve order throughout game

Example

A → B → C → D

↓

B → C → D → A

Player rotation must remain correct after:

- skip
- pass
- round transition
- app restart
- session resume

---

# 4.5 Round Management

Implement round progression.

Responsibilities

- Track current round
- Detect round completion
- Advance round
- Detect game completion

Validation

Round must never exceed configured total.

Game automatically completes after final round.

---

# 4.6 Dare Selection Engine

Create deterministic random dare selection.

Pipeline

Load Packs

↓

Merge Active Packs

↓

Apply Difficulty Filter

↓

Remove Previously Used Dares

↓

Shuffle Pool

↓

Select Random Dare

↓

Store Selection

↓

Persist Session

Requirements

- No repeated dares
- Respect enabled packs
- Respect selected difficulty
- Support custom dares
- Handle empty pools gracefully

---

# 4.7 Dare History Management

Maintain a complete gameplay history.

Each record stores:

- turn id
- player
- dare
- difficulty
- timestamp
- result
- skipped flag
- passed flag
- pack id

History must always be chronological.

History must survive app restart.

---

# 4.8 Player Actions

Implement every gameplay action.

Supported actions

Complete Dare

Skip Dare

Pass Turn

Cancel

Retry

Each action updates:

- history
- statistics
- awards
- session state
- persistence

---

# 4.9 Skip Logic

Implement skip rules.

Requirements

Respect configured skip limit.

Track skips per session.

Prevent skips after limit reached.

Update statistics immediately.

Persist new state.

---

# 4.10 Pass Logic

Implement pass rules.

Requirements

Allow pass without affecting skip count.

Record pass history.

Advance to next player.

Persist immediately.

---

# 4.11 Statistics Engine

Create a dedicated statistics calculator.

Statistics include:

- total dares
- completed
- skipped
- passed
- completion percentage
- rounds played
- average difficulty
- total players
- session duration

Per-player statistics

- completed dares
- skipped dares
- passed turns
- completion percentage

Statistics must always be derived from history.

Never duplicate calculated values unnecessarily.

---

# 4.12 Award Engine

Implement configurable award calculation.

Architecture

Award Definitions

↓

Rule Evaluation

↓

Award Results

↓

Summary Screen

Awards should be rule-based.

Avoid hardcoded if-else chains.

Possible awards

- Daredevil
- Most Fearless
- Biggest Skipper
- Team Player
- MVP
- Survivor
- Social Butterfly

Future awards should require configuration only.

---

# 4.13 Validation Layer

Create centralized validation utilities.

Validation modules

Player Validation

Session Validation

Pack Validation

History Validation

Award Validation

Statistics Validation

Storage Validation

Validation must occur before every state mutation.

---

# 4.14 Game Invariants

Enforce application invariants.

Examples

Current player always exists.

Round number is always valid.

Current dare cannot be null during gameplay.

Skip count cannot become negative.

History cannot contain duplicate ids.

Statistics cannot reference missing players.

Session cannot finish twice.

Broken invariants must immediately throw recoverable errors.

---

# 4.15 Persistence Integration

Persist gameplay automatically.

Persist after:

- new game
- player action
- skip
- pass
- next player
- next round
- settings update
- custom dare changes
- game completion

Do not persist:

- animation state
- modal visibility
- navigation state
- temporary UI state

---

# 4.16 Resume Game

Implement session recovery.

Requirements

Restore:

- players
- rounds
- active player
- history
- statistics
- settings
- custom packs

Resume must continue exactly where gameplay stopped.

No duplicated turns.

No lost history.

---

# 4.17 Error Recovery

Gracefully recover from failures.

Handle

Missing data

Corrupted storage

Invalid session

Missing packs

Migration failures

Recovery flow

Validate

↓

Repair

↓

Migrate

↓

Fallback

↓

Notify User

↓

Continue

App should never crash because gameplay data is invalid.

---

# 4.18 Performance

Optimize game logic.

Requirements

Pure functions where possible.

Avoid unnecessary object cloning.

Memoize derived selectors.

Avoid expensive recalculations.

Statistics should be recomputed only when history changes.

---

# 4.19 Unit Testing

Create comprehensive tests.

Services

- Game Engine
- Player Rotation
- Round Manager
- Dare Selector
- Statistics
- Awards
- Validation
- History
- Persistence

Test scenarios

- New Game
- Resume Game
- Complete Dare
- Skip
- Pass
- Round Transition
- Final Round
- Game Completion
- Statistics Generation
- Award Calculation

Edge cases

- Single remaining dare
- Empty pack
- Skip limit reached
- Resume after interruption
- Corrupted storage
- Maximum player count
- Duplicate custom dares

Target coverage:

- All domain services
- All stores
- Critical gameplay logic

---

# Exit Criteria

Before moving to Phase 5:

- Complete gameplay loop functions correctly.
- Full game can be played offline.
- Session resume works reliably.
- No duplicate dares occur.
- Player rotation is deterministic.
- Statistics are accurate.
- Awards calculate correctly.
- History persists across restarts.
- All gameplay validation passes.
- Core domain services are covered by automated tests.

# Phase 5 — Screen Implementation & User Experience

## Objective

Build the complete DareDrop user experience by implementing every screen defined in the product specifications using the shared design system, domain layer, and state management created in previous phases.

This phase is focused entirely on presentation and user interaction. Business logic must remain inside the domain layer implemented in Phase 4.

Every screen should act as a thin UI layer that renders application state and dispatches actions.

---

# 5.1 Navigation Architecture

Implement the complete application navigation.

Navigation Flow

```
Splash
↓

Landing / Home
↓

Player Setup
↓

Game Setup
↓

Ready Lobby
↓

Spin
↓

Dare Reveal
↓

Summary
```

Secondary Screens

- History
- Settings
- About
- Manage Custom Dares

Overlay Screens

- Skip Bottom Sheet
- Pass Confirmation
- Reset Confirmation
- Delete Confirmation
- Exit Confirmation

Navigation should use Expo Router with typed routes.

Avoid deeply nested navigation.

---

# 5.2 Splash Screen

Implement the branded splash experience.

Responsibilities

- Load fonts
- Initialize storage
- Validate saved session
- Perform migrations
- Prepare theme
- Navigate automatically

Requirements

- Display DareDrop branding
- Warm Material styling
- Minimum display duration
- Smooth fade transition

Splash must never show a blank screen.

---

# 5.3 Landing / Home Screen

Implement the application entry screen.

Features

- Continue Game (when available)
- New Game
- Manage Custom Dares
- Settings
- About

Display

- application logo
- version
- subtle branding
- session resume card (if active)

Primary CTA must always be visually dominant.

---

# 5.4 Player Setup Screen

Implement player management.

Features

- Add player
- Remove player
- Edit player
- Avatar selection
- Color assignment
- Player counter

Validation

- Minimum players
- Maximum players
- Duplicate names
- Empty names

Display validation inline.

Bottom CTA remains disabled until requirements are satisfied.

---

# 5.5 Game Setup Screen

Implement session configuration.

Settings

- Difficulty
- Number of rounds
- Skip limit
- Enabled packs

Preferences

- Sound
- Haptics
- Animations

Display live summary of selected configuration.

---

# 5.6 Ready Lobby

Provide a final review before gameplay.

Display

- Player list
- Avatar previews
- Difficulty
- Round count
- Skip limit
- Enabled packs

Primary CTA

Start Game

Secondary CTA

Back

No configuration should change on this screen.

---

# 5.7 Spin Screen

Implement gameplay transition.

Responsibilities

- Display current player
- Display progress
- Trigger random selection
- Animate card selection

Requirements

- Smooth animation
- Prevent double taps
- Disable interaction while spinning
- Navigate automatically after completion

Selection should originate from the domain layer.

---

# 5.8 Dare Reveal Screen

Implement the primary gameplay screen.

Display

- Player avatar
- Player name
- Dare card
- Difficulty badge
- Progress
- Round indicator

Actions

Complete

Skip

Pass

Every action should produce immediate feedback.

---

# 5.9 Skip Bottom Sheet

Implement skip confirmation.

Display

- Remaining skips
- Warning message
- Confirm button
- Cancel button

Disable confirmation when skip limit reached.

---

# 5.10 Pass Confirmation Dialog

Implement pass confirmation.

Display

- Explanation
- Current player
- Confirmation buttons

Passing should never consume skips.

---

# 5.11 History Screen

Implement session history.

Features

- Chronological list
- Difficulty badges
- Player avatars
- Result indicators
- Empty state

Support future filtering without architectural changes.

---

# 5.12 Summary Screen

Implement the end-of-game experience.

Display

- Celebration header
- Statistics
- Awards
- Player rankings

Actions

Play Again

New Game

Return Home

Summary should feel rewarding and memorable.

---

# 5.13 Settings Screen

Implement application preferences.

Settings

- Sound
- Haptics
- Animations

Actions

- Reset Data
- Clear Session

Display

- Version
- Storage information

All destructive actions require confirmation.

---

# 5.14 About Screen

Implement project information.

Display

- Logo
- Version
- Credits
- License
- Repository
- Acknowledgements

---

# 5.15 Manage Custom Dares

Implement custom content management.

Features

- Create dare
- Edit dare
- Delete dare
- Search
- Difficulty assignment
- Pack assignment

Validation

- Empty content
- Duplicate entries
- Length limits

Changes should persist immediately.

---

# 5.16 Empty States

Implement meaningful empty states.

Examples

- No players
- No custom dares
- No history
- No active session
- No search results

Every empty state should guide the user toward the next action.

---

# 5.17 Loading States

Implement loading experiences.

Examples

- Initial startup
- Session restoration
- Pack loading
- Data migration

Avoid blank screens.

---

# 5.18 Error States

Implement graceful error handling.

Display

- Friendly messages
- Recovery actions
- Retry options

Never expose raw errors.

---

# 5.19 Interaction Design

Every interactive element should provide feedback.

Requirements

- Press animation
- Disabled state
- Loading state
- Success feedback
- Error feedback
- Haptic feedback (optional)

Interaction feedback should be consistent across the application.

---

# 5.20 Responsive Layout

Support various device sizes.

Requirements

- Small phones
- Large phones
- Tablets
- Landscape orientation

Prevent clipping and overflow.

Respect safe areas.

---

# 5.21 Accessibility

Every screen must support accessibility.

Requirements

- Screen reader labels
- Accessibility roles
- Focus order
- Large touch targets
- Dynamic font scaling
- High contrast

All dialogs and sheets must trap focus correctly.

---

# 5.22 Navigation Guards

Prevent accidental data loss.

Prompt users before:

- Leaving active game
- Resetting data
- Deleting custom dares
- Starting a new game while another exists

---

# 5.23 UI Consistency

Every screen must use shared components.

Do not introduce one-off UI implementations.

Spacing

Typography

Elevation

Corner radius

Animation

Colors

must all come from the design system.

---

# 5.24 Screen-Level Testing

Verify every screen.

Test

- Happy path
- Validation
- Error states
- Empty states
- Navigation
- Accessibility
- Orientation changes

Every primary user flow should be exercised before Phase 6.

---

# Exit Criteria

Before moving to Phase 6:

- All documented screens are implemented.
- Complete navigation flow works correctly.
- Every overlay functions properly.
- No screen contains business logic.
- All screens use shared components.
- Validation is fully functional.
- Accessibility requirements are satisfied.
- Responsive layouts are verified.
- Navigation guards prevent accidental data loss.
- Complete gameplay flow can be executed from Splash to Summary without UI issues.

# Phase 6 — Production Hardening, Testing & Release Readiness

## Objective

Transform DareDrop from a feature-complete application into a production-ready mobile product.

This phase focuses on quality, stability, performance, accessibility, testing, documentation, and release preparation.

No new user-facing features should be introduced during this phase unless they are required to resolve production issues.

---

# 6.1 Performance Optimization

Optimize the application for smooth performance across supported devices.

Objectives

- Eliminate unnecessary re-renders.
- Reduce startup time.
- Improve animation performance.
- Minimize memory usage.
- Reduce JavaScript thread workload.

Tasks

- Profile React rendering.
- Optimize expensive components.
- Memoize derived values.
- Review React.memo usage.
- Optimize FlatList rendering.
- Remove unnecessary state updates.
- Use Reanimated worklets for animations.
- Avoid inline object creation during renders.

Verify smooth performance on low-end Android devices.

---

# 6.2 Animation Polish

Finalize the application's motion system.

Review

- Screen transitions
- Button feedback
- Card animations
- Bottom sheets
- Dialogs
- Progress transitions
- Success animations
- Celebration animations

Requirements

- 60 FPS animations
- Consistent easing
- Consistent durations
- Native-driven animations where possible

Respect reduced-motion accessibility settings.

---

# 6.3 Accessibility Audit

Perform a complete accessibility review.

Verify

- Screen reader support
- Accessibility labels
- Accessibility hints
- Roles
- Focus order
- Focus trapping
- Dynamic font scaling
- High contrast
- Minimum touch target sizes

Test using

- VoiceOver (iOS)
- TalkBack (Android)

Every screen should be fully navigable without sight.

---

# 6.4 Error Handling & Recovery

Review every failure scenario.

Examples

- Corrupted storage
- Failed migrations
- Missing packs
- Invalid session
- Empty database
- Unexpected exceptions

Implement

- Friendly error messages
- Recovery actions
- Retry flows
- Safe fallbacks

Never expose raw JavaScript errors to users.

---

# 6.5 Data Validation

Validate every persisted object.

Verify

- Schema correctness
- Required fields
- Version compatibility
- Migration success
- Duplicate prevention

Reject invalid data safely.

---

# 6.6 Storage Reliability

Stress test persistence.

Verify

- App restarts
- Device reboots
- Force close recovery
- Session restoration
- Data integrity

Ensure no user data is lost during normal usage.

---

# 6.7 Testing Infrastructure

Establish comprehensive automated testing.

Configure

- Jest
- React Native Testing Library

Implement

Unit Tests

- Services
- Utilities
- Domain logic
- Stores

Component Tests

- Shared UI components
- Dialogs
- Bottom sheets

Integration Tests

- Gameplay flow
- Session lifecycle
- Persistence
- Navigation

Aim for meaningful coverage of critical functionality rather than percentage-based targets.

---

# 6.8 Manual QA

Perform structured manual testing.

Verify

- Every screen
- Every navigation path
- Every button
- Every dialog
- Every sheet
- Every animation
- Every validation rule

Test

- Small phones
- Large phones
- Tablets
- Portrait
- Landscape

---

# 6.9 Gameplay Validation

Verify complete gameplay correctness.

Review

- Random player selection
- Dare selection
- Skip logic
- Pass logic
- Award calculations
- Summary statistics
- History accuracy

Cross-check implementation against GAME_RULES.md.

---

# 6.10 Documentation Synchronization

Update all project documentation.

Verify

- PROJECT_CONTEXT.md
- CURRENT_STATE.md
- GAME_RULES.md
- DATA_MODEL.md
- UI_SPECIFICATION.md
- SCREEN_SPECIFICATIONS.md
- README.md

Remove outdated information.

Documentation must accurately reflect the implementation.

---

# 6.11 Dependency Audit

Review project dependencies.

Tasks

- Remove unused packages.
- Update outdated packages.
- Resolve security advisories.
- Remove duplicate utilities.
- Verify Expo compatibility.

Every dependency should have a clear purpose.

---

# 6.12 Code Quality Review

Perform a repository-wide review.

Verify

- No duplicated code
- No dead code
- No unused imports
- No console statements
- No TODO comments
- No debugging artifacts
- No commented-out code

Maintain strict TypeScript compliance.

---

# 6.13 Release Configuration

Prepare the application for distribution.

Verify

- App icons
- Splash assets
- Version numbers
- Build numbers
- App metadata
- Permissions
- Package identifiers

Ensure production configuration is complete.

---

# 6.14 Security Review

Review application safety.

Verify

- Safe storage usage
- Input sanitization
- Data validation
- No sensitive logging
- Proper error boundaries

Although DareDrop is offline-first, defensive programming practices should still be followed.

---

# 6.15 Build Verification

Validate production builds.

Generate

- Android APK
- Android AAB
- iOS Release Build

Verify

- Installation
- Startup
- Persistence
- Gameplay
- Performance

No release build should behave differently from development builds.

---

# 6.16 Release Checklist

Before release, verify

- No lint errors
- No TypeScript errors
- No runtime warnings
- No crashes during gameplay
- Complete navigation flow
- Stable persistence
- Accessibility compliance
- Documentation updated
- Production assets finalized
- Version numbers updated

---

# 6.17 Final Production Audit

Conduct one complete repository review.

Review

- Architecture
- Design system
- Components
- Navigation
- State management
- Services
- Performance
- Accessibility
- Testing
- Documentation
- Gameplay
- Storage

Every item from previous audit reports should be resolved or intentionally deferred with documented justification.

---

# 6.18 Release Candidate Validation

Execute a complete end-to-end gameplay session.

Scenario

Launch App

↓

Create Players

↓

Configure Game

↓

Play Multiple Rounds

↓

Skip

↓

Pass

↓

Complete Game

↓

Review History

↓

View Summary

↓

Restart Game

↓

Close App

↓

Resume Session

↓

Reset Data

↓

Launch Again

No crashes, visual defects, or incorrect state transitions should occur throughout the entire workflow.

---

# Exit Criteria

DareDrop is considered production-ready when:

- All previous roadmap phases are complete.
- All critical and high-priority audit findings are resolved.
- No known blocking defects remain.
- Documentation accurately reflects the implementation.
- Automated tests cover critical business logic.
- Manual QA passes on supported devices.
- Performance meets target requirements.
- Accessibility requirements are satisfied.
- Production builds are stable.
- Complete gameplay can be executed without errors from launch to summary.
- The application is ready for internal testing or public release.