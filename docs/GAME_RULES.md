# DareDrop — Game Rules

**Version:** 1.0
**Status:** Canonical

This document defines the complete gameplay mechanics, randomization behavior, fairness rules, and edge case handling for DareDrop. It is the authoritative source for all gameplay logic and must be followed exactly by the randomization service and game session store.

---

## 1. Gameplay Lifecycle

A DareDrop session follows a linear progression from setup to completion:

```
Player Setup → Game Setup → Ready Lobby → Spin → Reveal → (Repeat Spin/Reveal) → Summary
```

### 1.1 Session States

| State | Description | Entry Condition | Exit Condition |
|---|---|---|---|
| `Draft` | Players being added | User starts "Start Game" | ≥2 players, user taps Next |
| `Configuring` | Game configuration being set | From Draft with valid players | Valid configuration, user taps Next |
| `Ready` | Final confirmation screen | From Configuring with valid config | User taps "Start Game" |
| `Active` | Gameplay in progress | From Ready | Round limit reached or user ends game |
| `Completed` | Game finished, summary generated | From Active | User navigates away or starts new game |
| `Archived` | Session persisted for history | From Completed | User deletes or session expires |

### 1.2 Round Lifecycle

Each individual round follows this state machine:

```
Pending → Revealed → Resolved
```

| State | Description | Transition Trigger |
|---|---|---|
| `Pending` | Player and dare selected internally | Spin animation begins |
| `Revealed` | Player and dare shown to user | Spin animation completes |
| `Resolved` | Outcome recorded (Completed/Skipped/Passed) | User action (Next/Skip/Pass) |

---

## 2. Round Progression

### 2.1 Round Counting

- Rounds are numbered sequentially starting at 1
- Round numbers are gapless — no skipped numbers
- The maximum round count is determined by `GameConfiguration.rounds`
- If `rounds` is set to ∞, the game continues until all players choose to end

### 2.2 Round Completion

A round is considered complete when:

1. The round state transitions to `Resolved`
2. A `HistoryEntry` is appended to the session history
3. The round counter (if finite) is incremented

### 2.3 Game End Conditions

The game ends when:

- **Natural completion:** The round counter reaches `GameConfiguration.rounds` (if finite)
- **Early termination:** User explicitly ends the game from Reveal or Settings
- **Degenerate case:** All players are removed (should be prevented by UI)

---

## 3. Player Rotation

### 3.1 Selection Pool

The eligible player pool consists of all players in `GameSession.players` (the snapshot taken at game start).

### 3.2 Randomization Rules

Player selection follows these rules in order:

1. **Fairness:** Every eligible player has equal probability of selection per round
2. **No immediate repetition (soft preference):** If possible, avoid selecting the same player twice consecutively
3. **No-repeat rule enforcement:** If `GameConfiguration.rules.noRepeatPlayers` is enabled, no player may be selected twice until all players have been selected at least once in the current cycle

### 3.3 No-Repeat Player Logic

When `noRepeatPlayers` is enabled:

- Track which players have been selected in the current cycle
- A cycle completes when every player has been selected at least once
- When a cycle completes, reset the "selected" tracking and begin a new cycle
- If only one eligible player remains, immediate repetition is unavoidable and permitted

### 3.4 Edge Cases

- **Single player:** Should be prevented by UI validation (minimum 2 players required)
- **All players used in cycle:** Reset tracking, all players become eligible again
- **Game configuration change mid-game:** Not allowed — configuration is immutable once `Active`

---

## 4. Dare Selection

### 4.1 Selection Pool

The eligible dare pool consists of all dares from:

- Bundled packs (if selected in `GameConfiguration.selectedPackIds`)
- Custom packs (if selected and containing dares)
- Filtered by enabled difficulties in `GameConfiguration.difficulty`

### 4.2 Randomization Rules

Dare selection follows these rules in order:

1. **Fairness:** Every eligible dare has equal probability of selection per round
2. **No immediate repetition (soft preference):** If possible, avoid selecting the same dare twice consecutively
3. **No-repeat rule enforcement:** If `GameConfiguration.rules.noRepeatDares` is enabled, no dare may be selected twice until all eligible dares have been used at least once

### 4.3 No-Repeat Dare Logic

When `noRepeatDares` is enabled:

- Track which dares have been used in the current session
- When all eligible dares have been used, reset the "used" tracking
- If only one eligible dare remains, immediate repetition is unavoidable and permitted

### 4.4 Difficulty Filtering

Only dares matching at least one enabled difficulty are eligible:

- If only "Mild" is enabled, only Mild dares are eligible
- If "Mild" and "Spicy" are enabled, both Mild and Spicy dares are eligible
- If no dares match the enabled difficulties, the configuration is invalid (UI should prevent this)

### 4.5 Edge Cases

- **Empty pool:** Should be prevented by UI validation (at least one dare must be eligible)
- **All dares used:** Reset tracking, all eligible dares become available again
- **Custom pack deleted mid-game:** Not allowed — custom content is immutable during `Active` session

---

## 5. Skip Rules

### 5.1 Skip Limit

Each player has a maximum number of skips determined by `GameConfiguration.skipLimit`:

- If `skipLimit` is 0, no skips are allowed
- If `skipLimit` is ∞, unlimited skips are allowed
- If `skipLimit` is N, each player may skip at most N times

### 5.2 Skip Consumption

A skip is consumed when:

1. The user taps "Skip" on the Reveal screen
2. The Skip Bottom Sheet confirms the action
3. The round resolves with `result: "Skipped"`

### 5.3 Skip Tracking

Skip counts are **derived** from `GameSession.history`, not stored on `Player`:

- For a given player, `skipsUsed = count of HistoryEntry where playerId === player.id AND result === "Skipped"`
- This ensures accuracy even if player names change (player IDs are immutable)

### 5.4 Skip Validation

Before allowing a skip, the system must verify:

- `skipsUsed < skipLimit` (or `skipLimit === ∞`)
- If the limit is reached, the Skip button should be disabled/hidden

### 5.5 Edge Cases

- **Skip limit changed mid-game:** Not allowed — configuration is immutable once `Active`
- **Player removed mid-game:** Not allowed — player list is immutable once `Active`
- **Skip limit > rounds:** UI should validate this during Game Setup (`skipLimit ≤ rounds` unless `rounds === ∞`)

---

## 6. Pass Rules

### 6.1 Pass Availability

Passes are only available if `GameConfiguration.rules.allowPasses` is `true`.

### 6.2 Pass Behavior

A pass:

- Does **not** consume a skip
- Does **not** count against any limit
- Resolves the round with `result: "Passed"`
- Is recorded in history like any other outcome

### 6.3 Pass Confirmation

Passes require confirmation via a dialog (not a bottom sheet) because:

- They are a yes/no decision, not a multi-step action
- They don't consume a limited resource (unlike skips)
- A lightweight dialog is appropriate for simple confirmations

### 6.4 Edge Cases

- **Pass rule changed mid-game:** Not allowed — configuration is immutable once `Active`
- **Pass used when disabled:** Should be prevented by UI (Pass button absent if `allowPasses === false`)

---

## 7. History Rules

### 7.1 History Entry Creation

A `HistoryEntry` is created **only** when a round transitions to `Resolved`.

The entry captures:

- `roundNumber`: The sequential round number
- `playerId`: Reference to the player
- `playerNameSnapshot`: Denormalized player name (for historical accuracy)
- `dareId`: Reference to the dare
- `dareTextSnapshot`: Denormalized dare text (for historical accuracy)
- `difficulty`: The dare's difficulty
- `result`: The outcome ("Completed" | "Skipped" | "Passed")
- `timestamp`: ISO 8601 timestamp of resolution

### 7.2 Snapshot Rationale

The snapshot fields (`playerNameSnapshot`, `dareTextSnapshot`) are intentional:

- Player names and custom dare texts are mutable pre-game
- History must remain accurate even if the source entity changes later
- This is the **only** exception to "reference by ID only" in the data model

### 7.3 History Immutability

Once created, a `HistoryEntry` is **never modified or deleted**:

- History is append-only
- No undo or edit operations on past rounds
- This ensures the historical record is trustworthy

### 7.4 History Filtering

The History screen allows filtering by result type:

- All: Show all entries
- Completed: Show only `result === "Completed"`
- Skipped: Show only `result === "Skipped"`
- Passed: Show only `result === "Passed"`

Filtering is a **read-time transformation**, not a separate stored list.

---

## 8. Summary Generation

### 8.1 Generation Timing

A `Summary` is generated **once**, when the `GameSession` transitions to `Completed`.

### 8.2 Summary Contents

The summary includes:

- `totalRounds`: Total number of rounds played
- `completed`: Count of rounds with `result === "Completed"`
- `skipped`: Count of rounds with `result === "Skipped"`
- `passed`: Count of rounds with `result === "Passed"`
- `completionRate`: `completed / totalRounds` (computed once, stored)
- `awards`: Array of `Award` objects (see Section 9)

### 8.3 Statistical Accuracy

The summary statistics are derived from `GameSession.history`:

- `totalRounds = history.length`
- `completed = count(history, entry => entry.result === "Completed")`
- `skipped = count(history, entry => entry.result === "Skipped")`
- `passed = count(history, entry => entry.result === "Passed")`

The invariant: `completed + skipped + passed === totalRounds` must always hold.

### 8.4 Edge Cases

- **Degenerate session (0 rounds):** Summary shows all zeros, awards section omitted
- **Early termination:** Summary reflects whatever rounds were completed
- **Summary regeneration:** Not allowed — summary is write-once

---

## 9. Awards

### 9.1 Award Types

The following awards are computed at game end:

| Award Title | Criteria |
|---|---|
| "Dare Devil" | Highest completion rate among players with ≥3 rounds |
| "Biggest Chicken" | Most skips used among players with ≥3 rounds |
| "Skip Master" | Most skips used without any passes (if any skips exist) |
| "Most Fearless" | Zero skips used and ≥5 rounds completed |
| "Comedy King" | Most completed dares (highest raw count) |

### 9.2 Award Computation

Awards are computed from `GameSession.history`:

1. Group history entries by `playerId`
2. For each player, compute:
   - `roundsPlayed = count of entries for this player`
   - `completed = count of entries with result === "Completed"`
   - `skipped = count of entries with result === "Skipped"`
   - `passed = count of entries with result === "Passed"`
   - `completionRate = completed / roundsPlayed` (if roundsPlayed > 0)
3. Apply award criteria to determine winners
4. Create `Award` objects with `playerId`, `title`, and `description`

### 9.3 Tie-Breaking

When multiple players tie for an award:

- Use the player who joined earliest (lowest index in `GameSession.players`)
- This is deterministic and predictable
- The tie-break rule should be documented in the award description

### 9.4 Minimum Round Threshold

Some awards require a minimum number of rounds to be eligible:

- "Dare Devil", "Biggest Chicken", "Skip Master": ≥3 rounds
- "Most Fearless": ≥5 rounds
- "Comedy King": No minimum (but requires at least 1 completion)

Players below the threshold are not eligible for that award.

### 9.5 Edge Cases

- **No eligible players for an award:** Omit that award from the summary
- **All awards omitted:** Show statistics only, no awards section
- **Single player:** Awards still apply if criteria are met

---

## 10. Edge Cases

### 10.1 Configuration Validation

Before allowing a game to start, validate:

- At least 2 players
- At least one difficulty enabled
- At least one pack selected with ≥1 eligible dare
- `skipLimit ≤ rounds` (unless `rounds === ∞`)
- `rounds` between 5 and 100 (or ∞)

### 10.2 Empty Pool Handling

If randomization produces an empty eligible pool (should not happen with proper validation):

- Fail gracefully with a clear error message
- Suggest returning to Game Setup
- Do not crash or hang

### 10.3 Persistence Recovery

When recovering a persisted `Active` session:

- Validate that all referenced entities still exist
- If a custom dare/pack was deleted, treat the session as corrupted and offer to reset
- If a bundled dare is missing (should never happen), treat as a data integrity error

### 10.4 Concurrent Modification

The following operations are **not allowed** during an `Active` session:

- Modifying `GameConfiguration`
- Adding/removing players
- Editing custom dares/packs
- Changing game rules

These operations are blocked by the store layer, not just the UI.

### 10.5 Network/Offline Behavior

DareDrop is offline-first:

- No network calls during gameplay
- All randomization is local
- No account or authentication required
- No cloud sync (future feature, not in v1)

---

## 11. Restart Behavior

### 11.1 Play Again

"Play Again" from Summary:

- Creates a **new** `GameSession` with the same `players` and `configuration`
- The previous session becomes `Archived`
- Navigation returns to Ready Lobby
- The new session starts at round 1

### 11.2 New Game

"New Game" from Summary:

- Clears the player list
- Returns to Landing/Home
- Requires full setup flow (Player Setup → Game Setup → Ready Lobby)
- The previous session becomes `Archived`

### 11.3 Session Archival

When a session becomes `Archived`:

- It is persisted to `daredrop:archivedSessions` (if history saving is enabled)
- It is no longer the "active" session
- It can be viewed in history but not resumed
- Archived sessions are capped at 50 (FIFO eviction)

---

## 12. Fairness Guarantees

### 12.1 Statistical Fairness

The randomization system guarantees:

- Equal probability for all eligible players per round
- Equal probability for all eligible dares per round
- No hidden weighting or bias
- Reproducible results given the same seed (for testing)

### 12.2 Deterministic Behavior

The randomization function is pure:

- Input: `(eligiblePool, previousSelections, rules)`
- Output: Next selection
- No dependence on global mutable state
- No hidden side effects

### 12.3 Testing Support

For unit testing, the randomization service should:

- Accept an optional seed parameter
- Return deterministic results when seeded
- Allow mocking of the random number generator

---

## 13. Implementation Notes

### 13.1 Service Layer

Gameplay logic must be implemented in `services/`:

- `randomizationService.ts`: Player and dare selection
- `awardService.ts`: Award computation
- `validationService.ts`: Configuration validation

These services must be pure, testable, and independent of UI.

### 13.2 Store Layer

The `gameSessionStore` must:

- Enforce state transitions (Draft → Configuring → Ready → Active → Completed)
- Reject invalid mutations (e.g., modifying configuration during Active)
- Expose actions that delegate to services
- Never contain business logic directly

### 13.3 UI Layer

Screens must:

- Call store actions, not services directly
- Display state, not compute it
- Validate user input, but trust the store for business rules
- Never bypass the store to mutate state

---

## 14. Future Extensions

### 14.1 Reserved for Future Features

The following gameplay extensions are planned but not implemented in v1:

- **Timed Mode:** Add timer per dare with `timerSecondsPerDare` configuration
- **Couples Mode:** Pair players for dares with `pairPlayers` configuration
- **Team Mode:** Divide players into teams with team scoring
- **AI-Generated Dares:** Dynamically generate dares based on player preferences

These extensions must be added to this document before implementation.

### 14.2 Extension Principles

When extending gameplay:

1. Add new configuration fields to `GameConfiguration`
2. Add new award types to the `AwardTitle` union
3. Update this document with the new rules
4. Ensure backward compatibility with existing sessions
5. Add migration logic if needed

---

## 15. Document Governance

This document is versioned independently of the app (currently **v1.0**).

Any change to gameplay rules requires:

- Version bump
- Changelog entry below
- Corresponding updates to `DATA_MODEL.md` if entity shapes change

### Changelog

- **v1.0** — Initial gameplay specification covering lifecycle, progression, rotation, selection, skips, passes, history, summary, awards, and edge cases.