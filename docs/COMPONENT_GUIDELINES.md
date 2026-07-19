# DareDrop — Component Engineering Guidelines

> This document defines the architectural, engineering, and design standards for every reusable UI component within DareDrop.
>
> It is the authoritative specification governing component design, implementation, maintenance, and future evolution.
>
> Every reusable component—whether built today or years from now—must follow this specification unless a newer version explicitly supersedes part of it.
>
> This document exists to ensure that every component contributes to one cohesive design system rather than becoming an isolated implementation.
>
> If any implementation conflicts with this document, this document takes precedence unless an explicit architectural decision replaces the affected section.

---

# 1. Purpose

Reusable components are the foundation of DareDrop.

Screens should never be responsible for implementing visual controls repeatedly.

Instead, screens compose reusable building blocks.

Every reusable component represents a contract between the design system and the application.

That contract should remain stable, predictable, and easy to understand.

The purpose of a component is not simply to reduce duplicated code.

Its primary responsibilities are:

• enforcing visual consistency

• enforcing design system usage

• encapsulating implementation details

• exposing a stable public API

• improving maintainability

• improving readability

• reducing long-term engineering cost

Whenever multiple screens require the same visual behavior, that behavior belongs inside a reusable component rather than being duplicated.

---

# 2. Engineering Philosophy

DareDrop follows a Design System First architecture.

The design system owns:

- colors
- typography
- spacing
- elevation
- radius
- motion
- visual hierarchy

Components exist to consume those tokens.

Components must never redefine them.

Every component should resemble code written by senior engineers working on a mature consumer application.

The application should never feel like a collection of unrelated widgets.

Instead, it should feel like one carefully designed product.

Whenever multiple implementation approaches exist, always choose the approach that maximizes:

• clarity

• predictability

• maintainability

• accessibility

• scalability

rather than minimizing the number of lines written.

Readable code is always preferred over clever code.

---

# 3. Design Philosophy

DareDrop follows the "Warm Material" design language.

Components should communicate warmth without sacrificing clarity.

The interface should feel:

• calm

• approachable

• playful

• premium

• modern

Visual decisions should be intentional.

Nothing should feel accidental.

Avoid unnecessary decoration.

Avoid excessive visual weight.

Avoid inconsistent spacing.

Avoid inconsistent corner radii.

Avoid inconsistent animation.

Every reusable component should appear as though it belongs to the same family.

Users should never notice where one component ends and another begins.

Instead, the entire interface should feel cohesive.

---

# 4. Component Responsibilities

Each reusable component should have exactly one primary responsibility.

Examples

AppButton

Responsible only for button presentation and interaction.

It should not contain application-specific logic.

---

AppCard

Responsible only for displaying elevated surfaces.

It should not fetch data.

It should not own business logic.

---

AppAvatar

Responsible only for displaying player avatars.

It should not calculate game statistics.

---

AppText

Responsible only for rendering typography according to the design system.

It should never determine application state.

---

Whenever a component begins handling multiple unrelated concerns, it should be split into smaller reusable pieces.

Single-responsibility components are easier to:

- understand

- test

- maintain

- extend

- replace

---

# 5. Component Hierarchy

Components should exist in clear layers.

Layer 1

Primitive Components

Examples

AppText

AppIcon

AppDivider

AppSpacer

These components expose the lowest-level building blocks.

---

Layer 2

Foundation Components

Examples

AppButton

AppChip

AppAvatar

AppCard

AppBadge

These combine primitive components into reusable controls.

---

Layer 3

Composite Components

Examples

PlayerChip

DifficultySelector

RoundProgress

HistoryItem

AwardCard

Composite components combine multiple foundation components.

---

Layer 4

Screen Sections

Examples

PlayerListSection

GameConfigurationCard

SummaryStatisticsSection

These exist only to simplify large screens.

---

Layer 5

Screens

Screens compose everything.

Screens should contain almost no styling logic.

Screens primarily:

- arrange layout

- coordinate state

- call services

- connect navigation

The lower the layer, the more reusable it should become.

---

# 6. Folder Organization

Every reusable component owns its own directory.

Example

components/

    AppButton/

        AppButton.tsx
        index.ts

As complexity increases, additional files may be introduced.

Example

components/

    AppButton/

        AppButton.tsx
        styles.ts
        types.ts
        constants.ts
        hooks.ts
        animations.ts
        index.ts

Additional files should only be created when they improve maintainability.

Do not split files prematurely.

Avoid unnecessary fragmentation.

Small components should remain small.

---

# 7. Naming Strategy

Every reusable UI component begins with the "App" prefix.

Examples

AppButton

AppCard

AppAvatar

AppText

AppInput

AppModal

AppBottomSheet

AppDialog

This naming convention prevents conflicts with:

React Native

React Native Paper

Expo

Third-party UI libraries

Native components

Avoid generic names.

Incorrect

Button

Card

Avatar

Input

Modal

Correct

AppButton

AppCard

AppAvatar

AppInput

AppModal

Public APIs should always communicate ownership.

---

# 8. Public API Philosophy

Every reusable component exposes a public interface.

Consumers should interact only with that interface.

Internal implementation details should remain private.

Consumers should never need to understand:

internal styles

internal animation logic

layout implementation

render optimization

future refactoring

A component's public API should remain stable over time.

Future improvements should happen internally without forcing changes to existing screens.

Breaking API changes should be extremely rare.

Whenever possible, extend existing APIs rather than replacing them.

---

# 9. Component Ownership

Every piece of logic should have exactly one owner.

Examples

Theme

Owns colors.

Components consume colors.

---

Typography

Owns font sizes.

Components consume typography.

---

Store

Owns application state.

Components render state.

---

Services

Own data manipulation.

Components never perform persistence.

---

Navigation

Owns routing.

Components never perform navigation automatically unless explicitly designed to do so.

Maintaining clear ownership prevents architecture from becoming tightly coupled.

---

# 10. Design System Ownership

The design system is the single source of truth.

Components must never redefine design decisions.

The design system owns:

• colors

• spacing

• typography

• radius

• elevation

• shadows

• motion

Components consume those decisions.

They do not reinterpret them.

Whenever a visual inconsistency appears between two screens, the solution should usually be found by improving the design system rather than overriding individual components.

This ensures consistency scales as the application grows.

---

# 11. Long-Term Maintainability

Every component should be written with the assumption that it will exist for years.

Future engineers should be able to understand the implementation quickly.

Prioritize:

predictable APIs

clear naming

strong typing

small responsibilities

minimal duplication

Avoid:

clever abstractions

premature optimization

hidden behavior

implicit dependencies

deep inheritance

When making architectural decisions, optimize for maintainability over short-term convenience.

The cost of reading code throughout its lifetime is significantly greater than the cost of writing it once.

---

# 12. Future Scalability

DareDrop is intentionally designed to grow beyond its initial release.

Future features may include:

• custom themes

• localization

• online multiplayer

• AI-generated dare packs

• downloadable content

• accessibility improvements

• tablets

• foldable devices

• desktop support

• wearable integration

Reusable components should therefore avoid assumptions that make future expansion difficult.

Instead, components should remain flexible while preserving a stable API.

Good reusable components rarely need to be rewritten.

They simply become capable of supporting additional use cases over time.

# 13. Theme Architecture

The DareDrop Design System is the single source of truth for all visual decisions.

Every reusable component must consume its visual properties exclusively through the theme layer.

The theme layer owns:

• Colors

• Typography

• Spacing

• Radius

• Shadows

• Elevation

• Motion

Components are consumers of these tokens.

They must never redefine them.

The separation of responsibilities is intentional.

Theme
↓

Design Decisions

↓

Reusable Components

↓

Screens

↓

Application

Whenever a visual change is required across the application, the modification should happen inside the theme rather than inside individual components.

For example:

Changing the primary color should require editing only the theme.

Changing the card radius should require editing only the theme.

Changing spacing rhythm should require editing only the spacing tokens.

This architecture minimizes maintenance cost while ensuring visual consistency.

---

# 14. Theme Import Rules

All reusable components must import design tokens from the public theme barrel.

Correct

import {
colors,
spacing,
radius,
typography,
animations,
shadows,
} from "@/theme";

Incorrect

import { colors } from "@/theme/colors";

import { spacing } from "@/theme/spacing";

import { typography } from "@/theme/typography";

Direct imports tightly couple components to internal file structure.

The barrel file exists specifically to provide a stable public API.

Future reorganizations of the theme layer should not require modifying hundreds of components.

---

# 15. Styling Philosophy

Every reusable component should use deterministic styling.

Visual appearance should never depend on arbitrary runtime calculations.

Styles should be:

predictable

readable

cacheable

theme-driven

Reusable components should avoid creating style objects during render.

Correct

const styles = StyleSheet.create({...})

Incorrect

<View style={{
padding: spacing.md,
backgroundColor: colors.surface.default
}} />

Using StyleSheet.create provides:

• improved readability

• better organization

• static style extraction

• improved debugging

• reduced allocation during rendering

Dynamic styles should be limited to values that genuinely depend on component props.

Everything else belongs inside StyleSheet.create.

---

# 16. NativeWind Usage Guidelines

NativeWind is part of DareDrop's architecture.

However, it is not the primary styling system.

NativeWind exists to simplify layout—not to replace the design system.

Recommended use cases

• flex

• flex-row

• justify-center

• items-center

• absolute

• relative

• overflow-hidden

• self-center

• w-full

Avoid using NativeWind for design tokens.

Incorrect

className="bg-white"

className="rounded-xl"

className="text-red-500"

className="p-6"

Correct

backgroundColor: colors.surface.default

borderRadius: radius.card

padding: spacing.lg

color: colors.text.primary

The design system—not Tailwind—is responsible for visual consistency.

NativeWind is a layout helper.

The theme is the design authority.

---

# 17. Typography Rules

Typography establishes hierarchy.

It is one of the strongest contributors to perceived quality.

Every text element must render through AppText.

Never render React Native's Text component directly inside screens or reusable components unless implementing AppText itself.

Correct

<AppText variant="body">
Hello
</AppText>

Incorrect

<Text>Hello</Text>

Typography variants should always originate from the typography tokens.

Never hardcode:

fontSize

fontWeight

lineHeight

letterSpacing

fontFamily

Future typography changes should require updating only the design system.

---

# 18. Color Rules

Color communicates meaning.

It should never exist purely for decoration.

Every color must come from semantic tokens.

Correct

colors.text.primary

colors.status.success

colors.surface.default

colors.primary.DEFAULT

Incorrect

"#FFFFFF"

"#000000"

"#FF0000"

"red"

Using semantic colors instead of raw values allows the design system to evolve without breaking components.

Future support for:

Dark Mode

High Contrast

Brand Refresh

Seasonal Themes

should require changing only the theme layer.

---

# 19. Spacing Rules

Spacing defines visual rhythm.

Every margin, padding, gap, inset, and separation must originate from spacing tokens.

Correct

paddingHorizontal: spacing.lg

gap: spacing.md

marginBottom: spacing.xl

Incorrect

padding: 13

marginTop: 21

gap: 7

Spacing tokens communicate hierarchy.

Example

Screen Padding

↓

Section Gap

↓

Card Padding

↓

Internal Element Gap

↓

Micro Gap

Components should preserve this hierarchy instead of inventing arbitrary spacing values.

A consistent spacing rhythm makes interfaces feel intentionally designed.

---

# 20. Radius Rules

Corner radius communicates softness and hierarchy.

Every rounded surface must use predefined radius tokens.

Correct

borderRadius: radius.card

borderRadius: radius.button

Incorrect

borderRadius: 17

borderRadius: 29

Radius values should never be chosen based on visual preference alone.

They represent reusable design decisions.

Cards, dialogs, chips, buttons, avatars, and bottom sheets each communicate different visual weight through radius.

Changing the radius scale should require updating only the design system.

---

# 21. Shadow & Elevation Rules

Elevation communicates depth.

Shadows should never exist merely as decoration.

Use shadow tokens exclusively.

Correct

...shadows.card

...shadows.sheet

Incorrect

shadowOpacity: 0.15

shadowRadius: 18

elevation: 7

Components should never manually recreate shadow styles.

The shadow system exists to provide:

consistent hierarchy

predictable depth

platform parity

future visual refinements

Every elevated surface should belong to one of the predefined elevation levels.

Avoid creating intermediate elevations.

---

# 22. Layout Ownership

Reusable components own their internal layout.

Screens own external layout.

Example

AppButton controls:

internal padding

text alignment

icon spacing

border radius

height

The screen controls:

margin

position

flex allocation

layout ordering

This separation keeps components reusable across different screens.

Components should not assume where they will be placed.

---

# 23. Responsive Design

Although DareDrop is primarily designed for phones, reusable components should avoid assumptions about screen dimensions.

Avoid:

fixed widths

absolute positioning unless required

magic numbers

Prefer:

flex layouts

intrinsic sizing

content-driven sizing

Components should naturally adapt to:

small phones

large phones

tablets

future foldables

Future responsive layouts should not require rewriting reusable components.

---

# 24. Visual Consistency Rules

Consistency is more valuable than originality.

Every component should appear as though it was created by the same designer.

Before introducing a new visual pattern, ask:

Can an existing component solve this?

Can an existing variant solve this?

Can the design system be extended instead?

Creating a completely new visual language should always be the last option.

Users build familiarity through repetition.

The design system should reinforce that familiarity rather than constantly introducing novelty.

---

# 25. Anti-Patterns

Avoid the following patterns.

❌ Hardcoded colors

❌ Hardcoded spacing

❌ Hardcoded typography

❌ Runtime style creation

❌ Duplicate design tokens

❌ Inline shadow definitions

❌ Direct Text usage

❌ Random border radius values

❌ Magic numbers

❌ Multiple competing styling approaches

❌ Styling based on business logic

❌ Components modifying theme values

When these patterns appear, they should be considered architectural issues rather than stylistic preferences.

Every deviation from the design system increases long-term maintenance cost.

# 26. Component API Philosophy

Every reusable component exposes a public API.

That API is a long-term contract between the component and the rest of the application.

A well-designed API should remain stable even if the internal implementation changes completely.

Consumers should never depend on implementation details.

Instead, they should only interact with documented props.

The public API should be:

• predictable

• discoverable

• self-documenting

• strongly typed

• minimal

Avoid exposing props that leak internal implementation.

For example, avoid props such as:

internalPadding

shadowOpacity

backgroundHex

fontWeight

Instead expose semantic properties.

Example

variant="primary"

size="large"

disabled

loading

This keeps the API stable even when the underlying design system evolves.

---

# 27. API Stability

Breaking changes should be considered a last resort.

Whenever possible:

• extend existing APIs

• add optional props

• introduce new variants

Avoid removing props that existing consumers rely on.

A stable API reduces migration effort and improves maintainability.

Future versions of a component should feel like natural extensions rather than complete rewrites.

---

# 28. Props Design Principles

Every prop should answer one question.

Examples

variant

"What visual style should this component use?"

size

"What size should this component render?"

disabled

"Can the user interact with it?"

loading

"Is the component waiting for an asynchronous action?"

Avoid props that answer multiple questions simultaneously.

Poor Example

type="danger-large-loading"

Good Example

variant="danger"

size="large"

loading

Props should describe intent rather than implementation.

---

# 29. Required vs Optional Props

Only require props that are essential for rendering.

Everything else should have sensible defaults.

Example

<AppButton>

requires

title

onPress

optional

variant

size

loading

disabled

icon

This keeps components simple while still allowing customization.

---

# 30. Controlled vs Uncontrolled Components

Whenever user interaction modifies state, components should support controlled behavior whenever practical.

Example

AppSwitch

Correct

<AppSwitch

value={enabled}

onValueChange={setEnabled}

/>

Incorrect

<AppSwitch />

where the component secretly owns application state.

Application state belongs to screens or stores.

Reusable components should render state rather than own business logic.

Internal state is acceptable only for:

temporary animation

focus state

gesture tracking

layout measurement

Internal state should never become the application's source of truth.

---

# 31. Component Variants

Variants represent semantic design decisions.

Variants should replace styling booleans.

Preferred

variant="primary"

variant="secondary"

variant="outline"

variant="ghost"

variant="danger"

Avoid

primary

outlined

filled

danger

isPrimary

isSecondary

Multiple boolean styling props quickly become impossible to reason about.

Variants scale naturally.

Future variants can be introduced without changing the API structure.

---

# 32. Size System

Components should expose semantic sizes.

Preferred values

small

medium

large

Avoid

width={74}

height={41}

size={19}

Numeric sizing should remain an implementation detail.

Consumers should describe intent.

The design system determines the physical dimensions.

---

# 33. Composition Over Configuration

Reusable components should favor composition whenever it improves flexibility.

Example

<AppCard>

<AppText />

<AppButton />

</AppCard>

instead of

<AppCard

title="..."

subtitle="..."

footerButtonTitle="..."

footerButtonVariant="..."

iconLeft="..."

iconRight="..."

badge="..."

status="..."

Configuration-heavy APIs become increasingly difficult to maintain.

Composition produces simpler components and cleaner APIs.

---

# 34. Dependency Rules

Reusable components should have minimal dependencies.

A component may depend on:

React

React Native

Theme

Other reusable components

Utility helpers

Animation helpers

Avoid depending directly on:

stores

navigation

services

business logic

API clients

database layers

Reusable UI should remain portable.

---

# 35. State Ownership

The owner of application state should always be obvious.

Application

↓

Store

↓

Screen

↓

Reusable Component

↓

Primitive Element

Reusable components receive state.

They do not own application state.

Incorrect

AppButton internally decides when the game starts.

Correct

AppButton notifies via onPress.

The screen decides what happens.

---

# 36. Event Handling

Reusable components communicate through callbacks.

Examples

onPress

onChange

onSubmit

onDismiss

onFocus

onBlur

Callbacks should communicate events.

They should not contain business logic.

Avoid component props such as

startGame

deletePlayer

resetApplication

Instead expose generic interaction callbacks.

Business decisions belong outside reusable components.

---

# 37. Ref Forwarding

Components wrapping native elements should forward refs whenever appropriate.

Example

AppInput

should expose

focus()

blur()

clear()

through React.forwardRef.

This enables better interoperability with forms and accessibility.

Avoid exposing imperative methods unless genuinely useful.

---

# 38. Prop Naming

Prop names should be explicit.

Good

loading

disabled

selected

variant

size

placeholder

accessibilityLabel

Bad

flag

mode

state

type2

styleType

Avoid abbreviations.

Names should remain understandable without documentation.

---

# 39. Default Values

Every optional prop should have a documented default.

Example

variant

default

primary

size

default

medium

loading

default

false

disabled

default

false

Predictable defaults reduce boilerplate while improving consistency.

---

# 40. TypeScript Standards

Every exported component must export its prop interface.

Example

export interface AppButtonProps

Avoid anonymous prop types.

Do not declare interfaces inside function parameters.

Incorrect

const AppButton = (

props: {

title: string

}

)

Correct

interface AppButtonProps

...

const AppButton = (props: AppButtonProps)

Shared types should live inside the component folder unless reused globally.

---

# 41. Generic Components

Avoid unnecessary generic complexity.

Do not introduce generics simply because TypeScript allows it.

Use generics only when they genuinely improve reuse.

Example

Generic list components.

Generic picker components.

Avoid generic buttons, generic cards, or generic avatars.

Simple APIs are easier to understand.

---

# 42. Extensibility

Every reusable component should be designed with future growth in mind.

Future enhancements should require adding functionality rather than rewriting architecture.

Examples

AppButton

Future icon support

Future loading spinner

Future badge

Future accessibility improvements

All without changing existing usage.

Design APIs that can evolve gracefully.

---

# 43. Backward Compatibility

Whenever a component evolves:

Existing screens should continue functioning.

New functionality should be additive.

Avoid renaming props unless absolutely necessary.

If deprecation becomes necessary:

mark the old prop

document the replacement

provide a migration path

Breaking compatibility should always be intentional and documented.

---

# 44. Decision Matrix

Before adding a new prop, ask:

Can an existing prop solve this?

Can a new variant solve this?

Can composition solve this?

Does this belong inside the screen instead?

Does this belong inside the theme?

If the answer is yes to any of the above, avoid expanding the public API unnecessarily.

Every additional prop increases long-term maintenance cost.

A smaller API is generally a better API.

---

# 45. Anti-Patterns

Avoid exposing implementation details.

Avoid styling props that duplicate the design system.

Avoid business-specific props.

Avoid tightly coupling components to application state.

Avoid prop names that require reading documentation to understand.

Avoid multiple props controlling the same behavior.

Avoid configuration-heavy components with dozens of optional props.

Avoid deeply nested conditional rendering based solely on prop combinations.

If a component becomes difficult to understand by simply reading its prop interface, the API should be redesigned.

A good public API should feel obvious even before reading the implementation.

# 46. Performance Philosophy

Performance is a feature.

Users should never consciously notice the performance of the interface.

Instead, interactions should feel immediate, fluid, and responsive.

Every reusable component should be designed with rendering efficiency in mind.

However, performance should never come at the expense of readability.

Avoid premature optimization.

Optimize only where it provides measurable value.

The preferred order of priorities is:

Correctness

↓

Readability

↓

Maintainability

↓

Performance

Well-structured code is easier to optimize than poorly structured code.

---

# 47. React.memo Guidelines

Presentational components should generally be wrapped with React.memo.

React.memo prevents unnecessary re-renders when component props have not changed.

Examples

✓ AppButton

✓ AppCard

✓ AppAvatar

✓ AppText

✓ AppChip

✓ AppBadge

React.memo is most effective when:

• props are immutable

• props are primitive values

• parent components render frequently

Do not wrap components with React.memo simply because it exists.

If a component:

- depends heavily on context
- receives changing object references
- performs minimal rendering work

then memoization may provide little or no benefit.

Always optimize intentionally.

Never optimize blindly.

---

# 48. useMemo Guidelines

useMemo should only be used to cache expensive computations.

Correct examples

Filtering large collections

Sorting datasets

Complex formatting

Derived calculations

Incorrect examples

Simple string concatenation

Boolean checks

Small object creation

Simple arithmetic

Avoid wrapping trivial calculations in useMemo.

The cost of memoization may exceed the cost of recalculating simple values.

When in doubt, prioritize readability.

---

# 49. useCallback Guidelines

useCallback exists to stabilize function references.

It should primarily be used when:

• passing callbacks to memoized children

• dependency arrays require stable references

• gesture handlers benefit from stable identities

Do not wrap every function with useCallback.

Doing so increases code complexity without necessarily improving performance.

Prefer simplicity unless a measurable performance improvement exists.

---

# 50. Render Optimization

Every render should be predictable.

Avoid creating new objects during render whenever possible.

Incorrect

style={{
padding: spacing.md
}}

Correct

styles.container

Avoid creating arrays inside render.

Incorrect

style={[styles.container, dynamicStyle]}

where dynamicStyle is recreated every render.

Prefer memoized values when dynamic styling is required.

Render functions should remain lightweight.

---

# 51. Object Identity

React compares object references.

Creating new objects during every render defeats memoization.

Avoid

{}

[]

() => {}

inside JSX whenever practical.

Instead:

move constants outside the component

memoize computed values

reuse existing references

Stable references reduce unnecessary renders throughout the component tree.

---

# 52. Accessibility Philosophy

Accessibility is not an optional enhancement.

Accessibility is a fundamental quality requirement.

Every reusable component should remain usable by:

screen readers

larger font settings

reduced vision users

motor-impaired users

future accessibility tools

Accessibility should be considered during initial implementation rather than added later.

---

# 53. Accessibility Requirements

Interactive components should support:

accessibilityRole

accessibilityLabel

accessible

testID

allowFontScaling (where applicable)

maximumFontSizeMultiplier

importantForAccessibility

Non-interactive components should remain accessible only when they communicate meaningful information.

Decorative elements should be hidden from accessibility services.

---

# 54. Touch Targets

Touch targets should never be unnecessarily small.

Interactive components should aim for a minimum touch area of:

44 × 44 points

Padding may be used to increase touchable area without affecting visual appearance.

Never sacrifice usability for aesthetics.

---

# 55. Font Scaling

Typography should support Dynamic Type whenever practical.

Avoid disabling allowFontScaling unless there is a compelling design reason.

Large font users should still be able to interact with the application comfortably.

Layouts should gracefully adapt to larger text rather than clipping content.

---

# 56. Color Accessibility

Never rely on color alone to communicate information.

Examples

Correct

Red badge + warning icon

Green badge + checkmark

Orange badge + status label

Incorrect

Only changing the text color

Users with color vision deficiencies should still understand interface meaning.

Color should reinforce information rather than replace it.

---

# 57. Motion Accessibility

Animations should improve usability.

They should never become necessary for understanding the interface.

Every interaction should remain understandable even if animations are disabled.

Future support for reduced motion should require minimal architectural changes.

Avoid excessive movement.

Avoid looping animations except intentional idle micro-interactions.

---

# 58. Error Handling

Reusable components should fail gracefully.

Optional props should always have sensible defaults.

Components should never crash because a consumer omitted a non-essential prop.

Guard against:

undefined

null

empty arrays

missing children

unexpected values

Fail safely.

Never fail catastrophically.

---

# 59. Defensive Programming

Validate assumptions inside reusable components.

For example:

Ensure variants exist.

Ensure sizes are supported.

Fallback gracefully when invalid values are encountered during development.

Development errors should be obvious.

Production behavior should remain stable whenever possible.

---

# 60. Testing Philosophy

Reusable components should be deterministic.

Given identical props, they should always produce identical output.

Avoid hidden side effects.

Avoid unpredictable rendering.

Support stable testing through:

testID

consistent prop behavior

predictable rendering

Reusable components should be straightforward to verify using automated tests.

---

# 61. Debuggability

Components should be easy to inspect during development.

Prefer descriptive display names.

Example

AppButton.displayName = "AppButton"

Meaningful display names improve debugging with React DevTools.

Avoid anonymous memoized components.

---

# 62. Logging

Reusable UI components should never perform application logging.

Avoid:

console.log()

console.warn()

analytics tracking

error reporting

inside reusable UI.

Business layers own logging responsibilities.

Components own presentation.

---

# 63. Animation Ownership

Reusable components may own small interaction animations.

Examples

Button press feedback

Card hover feedback

Icon rotation

Opacity transitions

Components should never own application-level animations.

Examples

Screen transitions

Navigation animations

Game flow animations

Confetti sequences

These belong to higher architectural layers.

---

# 64. Platform Consistency

Components should behave consistently across iOS and Android.

Avoid platform-specific styling unless absolutely necessary.

If platform differences exist, they should be intentional and documented.

Users should perceive one cohesive application rather than two different implementations.

---

# 65. Future Compatibility

Components should remain compatible with future React Native improvements.

Avoid depending on undocumented implementation details.

Prefer stable public APIs.

Future compatibility should include:

Fabric

TurboModules

React Compiler

Improved accessibility APIs

Future Expo SDK releases

The component library should evolve naturally alongside the React Native ecosystem.

---

# 66. Production Definition

A reusable component is considered production-ready only when it satisfies all of the following:

✓ Fully typed

✓ Theme-driven

✓ Accessible

✓ Responsive

✓ Memoized where appropriate

✓ Uses StyleSheet.create

✓ Imports exclusively from "@/theme"

✓ No hardcoded design values

✓ Stable public API

✓ No duplicated logic

✓ No business logic

✓ Deterministic rendering

✓ ESLint clean

✓ TypeScript clean

✓ Readable implementation

✓ Easy to maintain

A component that fails any of these criteria should be considered incomplete.

---

# 67. Engineering Review Checklist

Before merging a reusable component, verify:

□ Does it follow the design system?

□ Does it expose a minimal API?

□ Is every prop necessary?

□ Does it support accessibility?

□ Does it avoid business logic?

□ Does it reuse existing components?

□ Does it avoid hardcoded values?

□ Is TypeScript strict?

□ Does ESLint pass?

□ Is it future extensible?

□ Is the implementation readable?

□ Would another engineer understand it within a few minutes?

If the answer to any question is "No", the component should be revised before being considered complete.

