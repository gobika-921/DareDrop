# DareDrop — Data Model Specification

**Version:** 2.0
**Status:** Canonical — supersedes v1.0 in full
**Scope:** Every TypeScript interface, Zustand store, service, hook, utility, persistence layer, and screen in the DareDrop codebase must conform to this document without exception.

If an implementation detail is not covered here, it must be added here before it is written in code — not decided ad hoc inside a component or store.

---

## 0. How To Read This Document

This is not a description of the app. It is a **contract**. Every section that defines a rule uses one of three words deliberately:

- **Must** — a hard invariant. Violating it is a bug regardless of context.
- **Should** — a strong default. Deviating requires a written justification in code comments.
- **May** — an explicitly allowed option, not a requirement.

Where this document conflicts with any existing implementation, this document wins unless a newer, explicitly versioned revision supersedes it.

---

## 1. Purpose

This specification exists to:

1. Establish one shared vocabulary across the entire codebase.
2. Eliminate duplicated or parallel data models.
3. Make every entity's ownership, lifecycle, and mutation rights explicit and unambiguous.
4. Define persistence boundaries so no code has to guess what survives a restart.
5. Remove every decision point where an AI coding assistant (or a human) would otherwise have to invent a structure, a default, or a naming convention.

The measure of success for this document is: **two different engineers (or two different AI sessions), given only this file, would produce structurally identical data layers.**

---

## 2. Domain Philosophy

These principles govern every entity defined below. When a new feature is added and this document doesn't yet cover it, extend it **according to these principles** rather than by local convenience.

1. **Single source of truth.** Every fact about the domain is stored in exactly one place. If a value can be computed from other stored values, it is never also stored.
2. **Ownership flows downward, references flow by ID.** Parents own children. Children never hold a reference to a parent object — only, where necessary, a parent ID. Siblings never hold direct object references to each other; they reference each other by ID.
3. **Immutability by default.** A field is mutable only if this document explicitly says so. The default assumption for any new field is immutable-after-creation.
4. **IDs, not objects, cross boundaries.** `Round.playerId` is a `string`. It is never a `Player` object. This applies to every cross-entity reference in this document.
5. **Derived data is never persisted.** If it can be computed from persisted state, it is computed at read time (or memoized in runtime memory), never written to storage.
6. **Append-only where history is involved.** `HistoryEntry` records are never edited or deleted once written, only appended.
7. **No implicit state.** Every entity that changes over time has an explicit lifecycle (Section 6) with named states — never a boolean flag standing in for a state machine (e.g. no `isDone` *and* `isActive` *and* `isArchived` as three separate booleans that can contradict each other).
8. **Extend, never replace.** Future features (Section 20) must add optional fields or new entities. They must never repurpose an existing field for a new meaning.

---

## 3. Domain Overview

```
Application
│
├── Settings                      (1, global, persisted)
├── CustomPacks                   (0..N, persisted)
├── CustomDares                   (0..N, persisted)
├── BundledPacks                  (N, static asset, never persisted)
├── BundledDares                  (N, static asset, never persisted)
└── CurrentGameSession            (0..1, runtime + session-persisted)

GameSession (Aggregate Root)
│
├── configuration                 (1, immutable once game starts)
├── players                       (2..20, snapshot at game start)
├── rounds                        (1..N, append-only sequence)
├── history                       (0..N, append-only, derived from rounds)
└── summary                       (0..1, generated once, at game end)

Round
│
├── playerId  → Player.id
├── dareId    → Dare.id
└── result    (lifecycle-bound, see Section 6)
```

---

## 4. Aggregate Roots & Entity Ownership

An **aggregate root** is the only entity through which its children may be created, mutated, or deleted. Nothing outside the aggregate root's own store/service may reach in and mutate a child directly.

| Aggregate Root | Owns (children) | Notes |
|---|---|---|
| `Application` (implicit, top-level) | `Settings`, `CustomPack[]`, `CustomDare[]`, `CurrentGameSession` | Not a literal object in code — represents the global store boundary. |
| `GameSession` | `Round[]`, `HistoryEntry[]`, `Summary` | The only entity permitted to create a `Round` or append a `HistoryEntry`. |

**Ownership Invariants (must hold at all times):**

- A `Player` is never owned by a `Round`. `Round` only stores `playerId`.
- A `Dare` is never owned by a `Round`. `Round` only stores `dareId`.
- A `DarePack` never contains embedded `Dare` objects — only `dareIds: string[]`.
- A `HistoryEntry` never embeds `Player` or `Dare` objects — only their IDs plus the minimal denormalized snapshot fields explicitly listed in Section 17.10 (needed because dares can theoretically change after a session, and history must remain historically accurate).
- No entity outside `GameSession` may write to `GameSession.rounds`, `GameSession.history`, or `GameSession.summary`. These are private to the game-session service/store.

---

## 5. Data Relationships

| Relationship | Cardinality | Reference Direction |
|---|---|---|
| Application → Settings | 1 : 1 | Application holds Settings inline (not by ID; Settings has no independent identity). |
| Application → CustomPack | 1 : N | By ID collection. |
| Application → CustomDare | 1 : N | By ID collection. |
| DarePack → Dare | 1 : N | Pack stores `dareIds: string[]`. Dare does **not** store a back-reference to every pack it's in, except `packId` for its *owning* pack (Section 17.2). |
| GameSession → Player | 1 : N (2–20) | Session stores a snapshot array of `players` fixed at game start (Section 6.3 explains why this is a snapshot, not a live reference). |
| GameSession → Round | 1 : N (1–100) | Rounds are created and owned exclusively by the session. |
| Round → Player | N : 1 | By `playerId`. |
| Round → Dare | N : 1 | By `dareId`. |
| GameSession → HistoryEntry | 1 : N | Every `HistoryEntry` is derived from exactly one `Round` at the moment that round resolves. |
| GameSession → Summary | 1 : 0..1 | Summary exists only after `endedAt` is set. |
| Summary → Award | 1 : N | Awards are computed, not stored independently. |

---

## 6. Entity Lifecycle

Every stateful entity has an explicit, named lifecycle. No entity may be represented by ad hoc boolean combinations.

### 6.1 GameSession Lifecycle

```
Draft → Configuring → Ready → Active → Completed → Archived
```

| State | Meaning | Entry Condition | Mutable Fields Allowed |
|---|---|---|---|
| `Draft` | Player list is being built. | User starts "Create Game". | `players` |
| `Configuring` | Game Configuration screen is open. | Player list has ≥2 players and user taps Next. | `configuration` |
| `Ready` | Ready Lobby is shown; nothing has started. | Configuration is valid and complete. | none (read-only recap) |
| `Active` | Gameplay in progress. | User taps "Start Game". `configuration` becomes immutable at this instant. | `rounds`, `history` (append only) |
| `Completed` | All rounds finished or user ended early. | Round count reached `configuration.rounds`, or explicit "End Game". | `summary` (write once) |
| `Archived` | Session persisted only for optional stats; no longer "current". | User taps "New Game" or "Play Again" from a `Completed` session. | none — fully immutable |

**Invariant:** `configuration` is mutable only in `Draft`/`Configuring`. Any attempt to mutate it in `Active` or later must be rejected at the store layer, not merely discouraged by UI.

### 6.2 Round Lifecycle

```
Pending → Revealed → Resolved
```

| State | Meaning | Transition Trigger |
|---|---|---|
| `Pending` | Player + dare selected internally, not yet shown to user. | Spin animation begins. |
| `Revealed` | Player + dare shown on Reveal screen. | Spin animation completes. |
| `Resolved` | Result (`Completed` \| `Skipped` \| `Passed`) has been recorded. | User taps Next / confirms Skip / confirms Pass. |

**Invariant:** A `Round` only produces a `HistoryEntry` upon entering `Resolved`. A `Round` that never resolves (e.g. app closed mid-round) must not appear in `history`.

### 6.3 Player Lifecycle (within a session)

```
Registered → Snapshotted → (Active game) → Final
```

- `Registered`: player exists in the Draft player list; still fully editable (name, removal).
- `Snapshotted`: the moment `Active` begins, the player list is copied by value into `GameSession.players` and becomes immutable for the rest of that session. This is deliberate — if the app allowed editing players mid-game, every past `Round`/`HistoryEntry` referencing that `playerId` would become ambiguous about which name/color was current at that time.
- `Final`: session is `Completed`/`Archived`; player data in that session is permanently fixed.

### 6.4 Dare Lifecycle

```
Draft (custom only) → Active → Retired (custom only, soft-delete)
```

- Bundled dares only ever exist in the `Active` state — they are never edited or deleted, per Section 4.
- Custom dares may move to `Retired` (soft-deleted, hidden from selection) rather than hard-deleted, **if** they are referenced by any `HistoryEntry` in an `Archived` session (to preserve historical accuracy). If a custom dare is not referenced by any history, it may be hard-deleted.

---

## 7. Identifier Rules

1. All entity IDs are **UUID v4 strings**, generated client-side at creation time.
2. IDs are generated exactly once, at the moment the entity is created, and are immutable for the lifetime of the entity — including through soft-deletion/archival.
3. IDs are never reused, even after deletion. There is no ID recycling.
4. IDs are never derived from user-editable content (e.g. never `slugify(name)`), because names are mutable pre-game and IDs must not be.
5. No sequential/incrementing integer IDs anywhere in the domain — this avoids collisions across persisted + runtime + future cloud-synced data.
6. Foreign-key-style fields are always named `<entity>Id` (e.g. `playerId`, `dareId`, `packId`), never just `player`, `dare`, or generic `id` for a reference.

---

## 8. Object Immutability

| Entity | Immutable Fields | Mutable Fields | Mutable Until |
|---|---|---|---|
| Player | `id`, `createdAt` | `name`, `avatarColor` | Game reaches `Active` (Section 6.3) |
| Dare (Bundled) | all fields | none | forever |
| Dare (Custom) | `id`, `source`, `createdAt` | `text`, `difficulty`, `packId`, `updatedAt` | Until `Retired` |
| DarePack (Bundled) | all fields | none | forever |
| DarePack (Custom) | `id`, `type`, `createdAt` | `name`, `description`, `icon`, `dareIds` | Always mutable (custom packs are living lists) |
| GameConfiguration | all fields | — | Immutable the instant `GameSession` enters `Active` |
| GameSession | `id`, `startedAt` | `rounds` (append only), `history` (append only), `summary` (write-once), `endedAt` (write-once) | Per Section 6.1 |
| Round | `roundNumber`, `playerId`, `dareId`, `startedAt` | `result`, `completedAt` | Until `Resolved` |
| HistoryEntry | all fields | none | forever (append-only, Section 2.6) |
| Summary | all fields | none | write-once at game end |
| Award | all fields | none | forever (computed fresh each time, never stored long-term — see Section 19) |
| Settings | all fields | all fields | always (global, user-editable preferences) |

---

## 9. Validation Rules

Validation runs at the **store/service boundary**, not only in UI components — a UI bug must never be able to produce an invalid persisted state.

### 9.1 Player
- `name`: 1–20 characters after trimming whitespace. Must be non-empty after trim.
- `name` uniqueness: case-insensitive uniqueness required **within a single session's player list**. Not required to be globally unique across all time.
- `avatarColor`: must be one of the enumerated design-system avatar colors (Section 17.1) — never an arbitrary hex string.
- Player count: minimum 2, maximum 20, enforced before allowing transition out of `Draft`.

### 9.2 Dare
- `text`: minimum 5 characters, maximum 300 characters (custom dares only — bundled dares are pre-validated at asset build time).
- `difficulty`: must be one of `Mild | Spicy | Extreme`. No arbitrary strings (Section 17.6 enum).
- Custom dare `packId`: must reference an existing `CustomPack.id` at creation time, or be null if unassigned ("loose" custom dares are allowed).

### 9.3 GameConfiguration
- `rounds`: integer, minimum 5, maximum 100.
- `skipLimit`: integer, minimum 0, maximum equal to `rounds` (a skip limit greater than the number of rounds is meaningless and must be rejected).
- `selectedPackIds`: must contain at least one pack with at least one dare matching an enabled difficulty, or the "Next" action is disabled (matches UI spec, Section 3 of UI_SPECIFICATIONS.md).
- `difficulty`: at least one of `Mild | Spicy | Extreme` must be enabled.

### 9.4 GameSession
- Must not transition to `Active` unless `configuration` and `players` both independently pass their own validation.
- `endedAt` must be strictly greater than `startedAt` when set.

### 9.5 Round
- `roundNumber` must be sequential and gapless within a session, starting at 1.
- `result` may only be set once. A second write attempt to an already-`Resolved` round must be rejected, not overwritten.

### 9.6 Cross-Entity Validation
- A `HistoryEntry` must only be created from a `Round` that is `Resolved`. No `HistoryEntry` may exist for a `Pending` or `Revealed` round.
- `Summary` must not be generated while any `Round` in the session is not yet `Resolved`.

---

## 10. Nullability & Optionality

Explicit rule: a field is either **required**, **optional-and-nullable**, or **optional-and-undefined**. This document distinguishes them precisely per entity in Section 17 using TypeScript's own notation (`field: T`, `field?: T`, `field: T | null`) — never left ambiguous in prose. General defaults:

- Timestamps that only exist after an event occurs (`endedAt`, `completedAt`) are typed `T | undefined`, not `T | null` — "not yet happened" is the absence of the field, not a null value.
- Foreign keys that are genuinely optional-by-design (e.g. a custom dare with no pack) are typed `string | null` — "explicitly no pack" is a meaningful null, not an absent field.
- Arrays are never nullable. An empty collection is always `[]`, never `null` or `undefined`.

---

## 11. Mutation Ownership

Only the listed store/service may mutate the listed field. All other code must go through that store's exposed actions — direct object mutation from components or unrelated services is forbidden.

| Field(s) | Sole Owner |
|---|---|
| `Player.name`, `Player.avatarColor` (pre-game) | `PlayerStore` |
| `GameConfiguration.*` | `GameSetupStore`, until session becomes `Active` |
| `GameSession.rounds`, `.history`, `.summary`, `.endedAt` | `GameSessionService` |
| `Round.result`, `.completedAt` | `GameSessionService`, invoked only from the Reveal/Skip/Pass flows |
| `CustomPack.*`, `CustomDare.*` | `CustomContentStore` |
| `Settings.*` | `SettingsStore` |

**Invariant:** No component ever calls `setState` (or equivalent) directly on a domain entity. Components dispatch intents (`resolveRound(roundId, result)`); the owning store performs the mutation and validation together, atomically.

---

## 12. Persistence Model

| Entity | Persisted? | Layer |
|---|---|---|
| `Player` (historical, within Archived sessions) | Yes, as part of `GameSession` snapshot | Local storage |
| `Settings` | Yes | Local storage |
| `CustomPack` | Yes | Local storage |
| `CustomDare` | Yes | Local storage |
| `BundledPack` / `BundledDare` | No — loaded from static app assets at runtime | Bundled JSON asset |
| `CurrentGameSession` (while `Draft`/`Configuring`/`Ready`) | Session-only (survives app backgrounding, not app reinstall) | Local storage, separate key from archived sessions |
| `CurrentGameSession` (while `Active`) | Yes, continuously, so an interrupted game can resume | Local storage |
| Archived `GameSession` (post-`Completed`) | Optional — only if "save history" is enabled in Settings (future flag, Section 20) | Local storage |
| `Summary`, `Award` | Never persisted independently — always recomputed from a persisted session if needed | Runtime only |
| `history` (as a derived cache/index for the History screen) | Never persisted separately — always derived from `GameSession.rounds` at read time | Runtime only |

**Rule:** anything in the "Runtime" / "Never persisted" rows must be fully reconstructable from persisted data alone. If it cannot be reconstructed, it has been misclassified and belongs in the persisted list instead.

---

## 13. Storage Strategy

### 13.1 Storage Keys

| Key | Contents | Shape |
|---|---|---|
| `daredrop:settings` | `Settings` | single object |
| `daredrop:customPacks` | `CustomPack[]` | array |
| `daredrop:customDares` | `CustomDare[]` | array |
| `daredrop:activeSession` | `GameSession \| null` | single object or null |
| `daredrop:archivedSessions` | `GameSession[]` | array, capped (Section 13.3) |
| `daredrop:schemaVersion` | `number` | single integer |

### 13.2 Key Naming Convention
All keys are prefixed `daredrop:` to avoid collision with any other data that might share device storage, and use `camelCase` after the prefix.

### 13.3 Storage Limits
`archivedSessions` is capped at the **50 most recent sessions**. When the cap is exceeded, the oldest session is dropped first (FIFO), never the most recent.

### 13.4 Schema Versioning & Migration
- `daredrop:schemaVersion` is checked on app boot before reading any other key.
- Every change to any persisted entity's shape (Section 12) requires incrementing this version and writing an explicit migration function.
- Migrations are one-directional and cumulative (`v1 → v2 → v3`), never conditional branches based on guessed shape — the stored version number is the only source of truth for which migration path to run.
- If a stored value fails to parse against the current schema after migration, that key is treated as absent (defaulted), not thrown as a fatal error — the app must never hard-crash on corrupted local storage.

---

## 14. Serialization Rules

1. All persisted data is plain JSON — no class instances, no `Map`/`Set`, no functions, no `undefined` values inside stored objects (use omission or `null` per Section 10's rules, since `JSON.stringify` silently drops `undefined` keys, which must be an intentional choice, not an accident).
2. Timestamps are stored as **ISO 8601 strings** (`"2026-07-19T14:03:00.000Z"`), never as `Date` objects or raw epoch numbers — this avoids timezone ambiguity and keeps storage human-readable for debugging.
3. Enums (Section 17 unions) are stored as their exact string literal values (e.g. `"Spicy"`, not `1` or `"SPICY"`). Casing must match the TypeScript union exactly.
4. Arrays of entities are stored in **creation order**, never re-sorted before persistence — any display ordering (e.g. "newest first" on the History screen) is a read-time transformation, not a storage-time one.

---

## 15. Business Invariants

These must hold true at every point in the application's runtime, not just at creation:

1. A session in `Active` always has `configuration.rounds` matching the eventual maximum length of `rounds[]` — the array never grows past that bound.
2. `history.length` is always ≤ `rounds.length`, and equals the count of `Resolved` rounds exactly.
3. The sum of `Completed + Skipped + Passed` counts in any `Summary` always equals `totalRounds` exactly — no round result is ever double-counted or omitted.
4. No two `Round`s in the same session ever have the same `roundNumber`.
5. If `configuration.rules.noRepeatPlayers` is enabled, no player may be selected twice within one full cycle through the player list.
6. If `configuration.rules.noRepeatDares` is enabled, no dare may be selected twice within one session until every eligible dare (matching selected difficulty/pack) has been used at least once.
7. `skipsUsed` for any player never exceeds `configuration.skipLimit`.
8. A `GameSession` can have at most one `Summary`, generated exactly once, immutable thereafter.

---

## 16. Randomization & Fairness Rules

1. Player selection and dare selection are **independent random draws**, each constrained by the active rules (Section 15.5–15.6), not by a single combined weighted table.
2. "Statistically fair" means: absent the no-repeat rules, every eligible player has equal probability of selection each round, and every eligible dare has equal probability of selection each round. No hidden weighting toward custom dares, specific difficulties, or specific players.
3. Immediate repetition avoidance (spec Section 16 of the original UI/gameplay spec) is a soft preference applied only when it doesn't conflict with the hard rules above — e.g. if only one eligible player remains, immediate repetition is unavoidable and permitted.
4. The randomization function must be a pure function of `(eligiblePool, previousSelections, rules)` — it must not depend on hidden mutable global state, so gameplay is testable and reproducible given a fixed seed in tests.

---

## 17. Entities (Full Specification)

Each entity below follows the same shape: Purpose, Ownership, TypeScript definition, field-by-field rules, relationships, persistence, lifecycle pointer, and future extension notes.

### 17.1 Player

**Purpose:** Represents one participant in a game session.
**Ownership:** Owned by `GameSession.players` once snapshotted (Section 6.3); prior to that, owned by `PlayerStore` in `Draft` state.

```typescript
interface Player {
  id: string;              // UUID v4, immutable
  name: string;             // 1–20 chars, unique (case-insensitive) within session
  avatarColor: AvatarColor; // from design-system enum, not arbitrary hex
  createdAt: string;        // ISO 8601, set once
}

type AvatarColor =
  | "coral" | "sage" | "clay" | "sand" | "moss" | "rust" | "slate" | "blush";
```

- **Required:** `id`, `name`, `avatarColor`, `createdAt`.
- **Optional:** none.
- **Mutable:** `name`, `avatarColor` — only pre-game (Section 6.3).
- **Immutable:** `id`, `createdAt` — always.
- Players **never** store `skipsUsed`, `hasPlayed`, or any statistic — those are derived at read time from `GameSession.rounds` (Section 19), correcting the v1.0 spec which incorrectly stored `skipsUsed`/`hasPlayed` directly on `Player`.
- **Relationships:** referenced by `Round.playerId`, `HistoryEntry.playerId`, `Award.playerId`.
- **Persistence:** persisted only as part of a `GameSession` snapshot (Section 12).
- **Future extension:** Team Mode (Section 20) adds an optional `teamId?: string` — never repurposes `avatarColor` to encode team.

---

### 17.2 Dare

**Purpose:** Represents one challenge that can be assigned to a player.
**Ownership:** Bundled dares owned by static app assets; custom dares owned by `CustomContentStore`.

```typescript
interface Dare {
  id: string;
  text: string;              // 5–300 chars (custom); pre-validated (bundled)
  difficulty: Difficulty;
  source: DareSource;
  packId: string | null;     // owning pack; null = unassigned custom dare
  createdAt?: string;        // required for custom, absent for bundled
  updatedAt?: string;        // present only if edited at least once
}

type Difficulty = "Mild" | "Spicy" | "Extreme";
type DareSource = "Bundled" | "Custom";
```

- **Required:** `id`, `text`, `difficulty`, `source`, `packId`.
- **Optional:** `createdAt`, `updatedAt` (bundled dares omit both entirely).
- **Mutable:** `text`, `difficulty`, `packId`, `updatedAt` — custom only, and only until `Retired` (Section 6.4).
- **Immutable:** everything on bundled dares; `id`, `source`, `createdAt` on custom dares.
- **Relationships:** referenced by `Round.dareId`, `HistoryEntry.dareId`; belongs to at most one `DarePack` via `packId`.
- **Persistence:** custom dares persisted directly; bundled dares never persisted (loaded from asset).
- **Future extension:** AI-Generated Dares (Section 20) adds `"AIGenerated"` to `DareSource` as a third literal — additive, not a replacement of the union.

---

### 17.3 Dare Pack

**Purpose:** A named collection of dares (e.g. "Default Pack", a user's custom pack).
**Ownership:** Bundled packs owned by static assets; custom packs owned by `CustomContentStore`.

```typescript
interface DarePack {
  id: string;
  name: string;
  type: PackType;
  description?: string;
  icon?: string;
  dareIds: string[];    // references only — never embedded Dare objects
  createdAt?: string;   // custom packs only
}

type PackType = "BuiltIn" | "Custom";
```

- **Required:** `id`, `name`, `type`, `dareIds`.
- **Optional:** `description`, `icon`, `createdAt`.
- **Mutable:** `name`, `description`, `icon`, `dareIds` — custom packs only, always mutable.
- **Immutable:** all fields on bundled packs.
- `dareCount` is **never stored** — always `dareIds.length` computed at read time (Section 19).
- **Relationships:** referenced by `GameConfiguration.selectedPackIds`.
- **Persistence:** custom packs persisted; bundled packs loaded from asset.

---

### 17.4 Game Configuration

**Purpose:** The full set of choices made on the "Set the Tone" screen before a game starts.
**Ownership:** Owned by `GameSetupStore` until the session becomes `Active`, at which point ownership transfers to the immutable `GameSession.configuration`.

```typescript
interface GameConfiguration {
  difficulty: Difficulty[];        // at least one required
  rounds: number;                  // 5–100
  skipLimit: number;               // 0–rounds
  selectedPackIds: string[];       // at least one pack with ≥1 eligible dare
  allowCustomDares: boolean;
  rules: GameRules;
}

interface GameRules {
  noRepeatPlayers: boolean;
  noRepeatDares: boolean;
  allowPasses: boolean;
}
```

- **Required:** all fields — `GameConfiguration` has no optional fields; every choice must be explicit before a game can start (no silent defaults hidden from the user at the domain layer, even if the UI pre-selects defaults).
- **Mutable:** all fields, until the owning `GameSession` transitions to `Active` (Section 6.1).
- **Immutable:** entirely, from `Active` onward.
- **Relationships:** embedded (by value, not by ID) inside `GameSession` — `GameConfiguration` has no independent identity or ID of its own, since it cannot meaningfully exist outside a session.
- **Future extension:** Timed Mode adds `timerSecondsPerDare?: number`. Couples Mode adds `pairPlayers?: boolean`. Both additive.

---

### 17.5 Game Session

**Purpose:** The root aggregate representing one complete playthrough, from player setup to game summary.
**Ownership:** Self-owned aggregate root; the only entity that owns `Round[]`, `HistoryEntry[]`, and `Summary`.

```typescript
interface GameSession {
  id: string;
  state: GameSessionState;
  configuration: GameConfiguration;
  players: Player[];              // snapshot, fixed at Active (Section 6.3)
  rounds: Round[];
  history: HistoryEntry[];
  summary?: Summary;               // present only once state === "Completed" | "Archived"
  startedAt?: string;              // set on entering Active
  endedAt?: string;                // set on entering Completed
}

type GameSessionState =
  | "Draft" | "Configuring" | "Ready" | "Active" | "Completed" | "Archived";
```

- **Required:** `id`, `state`, `configuration`, `players`, `rounds`, `history`.
- **Optional:** `summary`, `startedAt`, `endedAt` — each absent until its triggering lifecycle event (Section 6.1).
- **Mutable:** `state` (forward-only transitions per Section 6.1), `rounds`/`history` (append-only), `summary`/`endedAt` (write-once).
- **Immutable:** `id`; `configuration` and `players` from `Active` onward.
- **Relationships:** the aggregate root for `Round`, `HistoryEntry`, `Summary`.
- **Persistence:** Section 12 — persisted continuously while `Active`; persisted post-hoc as an archived record only if history-saving is enabled.

---

### 17.6 Round

**Purpose:** One turn of gameplay — one player, one dare, one outcome.
**Ownership:** Owned exclusively by its parent `GameSession`.

```typescript
interface Round {
  roundNumber: number;      // sequential, gapless, starts at 1
  state: RoundState;
  playerId: string;         // → Player.id
  dareId: string;           // → Dare.id
  result?: RoundResult;     // present only once state === "Resolved"
  startedAt: string;
  completedAt?: string;
}

type RoundState = "Pending" | "Revealed" | "Resolved";
type RoundResult = "Completed" | "Skipped" | "Passed";
```

- **Required:** `roundNumber`, `state`, `playerId`, `dareId`, `startedAt`.
- **Optional:** `result`, `completedAt` — set together, exactly once, on resolution.
- **Mutable:** `state` (forward-only per Section 6.2), `result`, `completedAt` (write-once each).
- **Immutable:** `roundNumber`, `playerId`, `dareId`, `startedAt`.
- **Relationships:** references `Player` and `Dare` by ID only (Section 4); produces exactly one `HistoryEntry` upon resolution.
- **Persistence:** persisted as part of the parent `GameSession`.

---

### 17.7 History Entry

**Purpose:** A durable, append-only record of a resolved round, independent of whether the underlying `Dare` or `Player` data later changes.
**Ownership:** Owned by `GameSession.history`; created only by `GameSessionService` when a `Round` resolves.

```typescript
interface HistoryEntry {
  roundNumber: number;
  playerId: string;
  playerNameSnapshot: string;   // denormalized at write time — see rationale below
  dareId: string;
  dareTextSnapshot: string;     // denormalized at write time
  difficulty: Difficulty;
  result: RoundResult;
  timestamp: string;
}
```

- **Required:** all fields — a `HistoryEntry` has no optional fields; it is a completed fact.
- **Immutable:** entirely, forever (Section 2.6, 6.4).
- **Rationale for denormalized snapshot fields:** `playerNameSnapshot` and `dareTextSnapshot` are the **one deliberate exception** to "reference by ID only" (Section 4). Because `Player.name` is mutable pre-game and custom `Dare.text` is mutable pre-retirement, a pure ID reference in a permanent historical record could later point to a name or dare text that no longer matches what was actually shown to the user at that moment. This is not a duplication of source-of-truth — the snapshot fields are historical facts about what happened, not current facts about the `Player`/`Dare` entities, and must never be confused with or synced against the live entity.
- **Relationships:** derived 1:1 from a resolved `Round`.
- **Persistence:** as part of the parent `GameSession`.

---

### 17.8 Summary

**Purpose:** The end-of-game recap shown on the End Game screen.
**Ownership:** Owned by `GameSession.summary`; generated exactly once.

```typescript
interface Summary {
  totalRounds: number;
  completed: number;
  skipped: number;
  passed: number;
  completionRate: number;   // completed / totalRounds, computed at generation time
  awards: Award[];
}
```

- **Required:** all fields.
- **Immutable:** entirely, once generated (Section 6.1, Section 15.8).
- `completionRate` is computed **once, at generation time**, and then stored as part of the immutable summary — this is the one exception to "never persist derived data" (Section 2.5), justified because a `Summary` is itself a permanent historical snapshot, not live state; recomputing it later must always yield the same value, so caching it is safe and avoids recomputing from potentially-archived/pruned round data.
- **Relationships:** contains `Award[]` (Section 17.9).
- **Persistence:** as part of the parent `GameSession`, once `Completed`/`Archived`.

---

### 17.9 Award

**Purpose:** A computed superlative (e.g. "Dare Devil") assigned to a player at game end.
**Ownership:** Exists only within a generated `Summary`; not independently addressable.

```typescript
interface Award {
  playerId: string;
  title: AwardTitle;
  description: string;
}

type AwardTitle =
  | "Dare Devil" | "Biggest Chicken" | "Skip Master"
  | "Most Fearless" | "Comedy King";
```

- **Required:** all fields.
- **Immutable:** entirely, as part of the immutable `Summary`.
- No player statistics are duplicated onto the `Award` — only `playerId` (Section 12 of original spec, preserved).
- **Future extension:** new `AwardTitle` values are additive to the union; award-computation logic lives in a pure function (Section 16.4 pattern) taking `(rounds, players)` and returning `Award[]`.

---

### 17.10 Settings

**Purpose:** Global, persistent, gameplay-independent application preferences.
**Ownership:** Owned by `SettingsStore`; entirely independent of any `GameSession`.

```typescript
interface Settings {
  animations: boolean;
  sound: boolean;
  haptics: boolean;
  // Reserved for future use — see Section 20. Do not read/write until implemented.
  theme?: "light" | "dark" | "system";
  language?: string;       // BCP 47 tag, e.g. "en-US"
  saveHistory?: boolean;   // gates whether Archived sessions persist (Section 12)
}
```

- **Required:** `animations`, `sound`, `haptics`.
- **Optional (reserved, not yet active):** `theme`, `language`, `saveHistory`.
- **Mutable:** all fields, always.
- **Relationships:** none — Settings never references gameplay entities.
- **Persistence:** always persisted (Section 12/13.1).

---

## 18. Custom Content Rules

- Custom dares and packs follow the exact same interfaces as bundled content (Sections 17.2–17.3); the only distinguishing fields are `source`/`type` set to `"Custom"`.
- Users may create, edit, and soft/hard-delete custom dares and packs, per the lifecycle in Section 6.4.
- Bundled content is read-only in all cases, enforced at the store layer (any mutation attempt on a `source: "Bundled"` or `type: "BuiltIn"` entity must throw, not silently no-op).

---

## 19. Derived Data (Never Persisted)

The following are **always computed at read time** from persisted state, never stored:

| Derived Value | Computed From |
|---|---|
| `Player.skipsUsed` (for display) | `count(rounds where round.playerId === player.id && round.result === "Skipped")` |
| `Player.hasPlayed` (for display, current round's fairness check) | `rounds.some(r => r.playerId === player.id)` |
| `DarePack.dareCount` | `dareIds.length` |
| `Summary.completionRate` (if ever recomputed for validation) | `completed / totalRounds` |
| History screen filtered lists (All/Completed/Skipped/Passed) | filter over `GameSession.history` at render time |
| `Award` winners | pure function over `rounds` + `players` at summary-generation time only |
| Player count / round progress ("Round 3 of 10") | `rounds.length` vs `configuration.rounds` |

**Rule:** if a future feature seems to need one of these values persisted for performance, that requires an explicit, written exception added to this document — not a silent addition of a stored field.

---

## 20. Future Compatibility

The model must support the following without breaking existing entities. Each note below states the **additive** change required — no existing field is ever repurposed.

| Feature | Extension |
|---|---|
| Truth Mode | New `PromptType: "Dare" \| "Truth"` on `Dare`; existing dares default to `"Dare"` via migration. |
| Team Mode | Optional `teamId?: string` on `Player`; new `Team` entity (`id`, `name`, `color`). |
| Timed Mode | Optional `timerSecondsPerDare?: number` on `GameConfiguration`; optional `timeTakenSeconds?: number` on `Round`. |
| Couples Mode | Optional `pairPlayers?: boolean` on `GameConfiguration`; optional `partnerId?: string` on `Player`. |
| Favorites | New `FavoriteDare` join entity (`playerScopeId` or global, `dareId`) — never a boolean flag directly on shared `Dare` objects, since favorites are user-scoped, not dare-scoped. |
| Cloud Sync | New `syncedAt?: string` and `remoteId?: string` optional fields on persisted entities; local `id` remains the primary key regardless of sync status. |
| Localization | `Settings.language`; `Dare.text` becomes keyed by locale only for bundled content via a separate translation asset map — custom dares remain single-locale (user-authored). |
| AI-Generated Dares | `"AIGenerated"` added to `DareSource` union (Section 17.2). |
| Pinned Packs | Optional `pinnedPackIds?: string[]` on `Settings`, not a field on `DarePack` itself (pinning is a user preference, not a property of the pack). |
| Online Packs | New `PackSource: "Local" | "Remote"` alongside existing `PackType`; remote packs cache their `dareIds` resolution locally after first fetch. |

---

## 21. TypeScript Architecture

### 21.1 File Structure

```
types/
  player.ts
  dare.ts
  pack.ts
  configuration.ts
  session.ts
  round.ts
  history.ts
  summary.ts
  award.ts
  settings.ts
  enums.ts        // Difficulty, RoundResult, PackType, DareSource, etc.
```

### 21.2 Rules

1. Exactly one exported interface (or type alias) per concern per file. `session.ts` may also export `GameSessionState` since it's intrinsic to `GameSession`, but must not also define unrelated types.
2. Interfaces are never declared inside components, hooks, or store files — always imported from `types/`.
3. All enumerations are **string literal union types**, never TypeScript `enum` (to keep values transparent in JSON storage and avoid numeric-enum serialization ambiguity) and never arbitrary untyped strings.
4. No class instances are used for domain entities — plain object literals only, to guarantee trivial JSON serialization (Section 14).
5. Store actions are typed to accept and return these shared interfaces exactly — no store-local "view model" types that silently diverge from the canonical shape. If a screen needs a transformed view of an entity, that transformation is a selector/hook, not a new stored type.

---

## 22. AI Implementation Rules

Before implementing any feature, in this order:

1. Read `PROJECT_CONTEXT.md`.
2. Read `UI_SPECIFICATIONS.md`.
3. Read `GAME_RULES.md`.
4. Read this document (`data_model.md`) in full.
5. Search the existing codebase for an entity that already satisfies the need before creating a new one.

While implementing:

- Never invent a parallel model for something already defined here (e.g. never create a second "player-like" shape for a new screen — reuse `Player`).
- Never duplicate information across entities — always reference by ID (Section 4), except the one explicit denormalization exception in Section 17.7.
- Never persist something Section 12 marks as runtime-only, and never skip persisting something marked persisted.
- Never add a mutable field to an entity Section 8 marks immutable without first updating this document and bumping its version.
- If a requirement isn't covered by this document, **stop and flag it** rather than silently inventing a convention — propose the addition in the same style as existing sections (Purpose / Ownership / fields / validation / relationships / persistence / lifecycle).

---

## 23. Document Governance

- This document is versioned independently of the app (currently **v2.0**).
- Any change to an entity's shape, lifecycle, or ownership requires a version bump and a one-line changelog entry below.
- No implementation PR that changes a data shape should be merged without a corresponding update to this file in the same change.

### Changelog

- **v2.0** — Full rewrite to production-grade specification: added explicit lifecycles, ownership invariants, mutation ownership, persistence boundaries, identifier rules, serialization rules, nullability rules, business invariants, and full per-entity TypeScript definitions. Corrected v1.0 error of storing `skipsUsed`/`hasPlayed` directly on `Player` (now derived, Section 19).
- **v1.0** — Initial entity list and relationships (superseded).