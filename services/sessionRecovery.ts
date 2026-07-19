import { Dare, GameSession } from "../types";

import { validateSessionIntegrity } from "./gameValidator";

/**
 * Attempts to recover a persisted Active game session.
 *
 * Recovery rules (GAME_RULES.md §10.3):
 * - Validate that all referenced entities still exist.
 * - If a custom dare/pack was deleted, the session is corrupted.
 * - If a bundled dare is missing, treat as a data integrity error.
 *
 * @param storedSession The session loaded from storage.
 * @param allDares      All currently available dares (bundled + custom).
 * @returns The validated session, or null if corrupted.
 */
export function recoverSession(
  storedSession: GameSession | null,
  allDares: readonly Dare[],
): GameSession | null {
  if (!storedSession) return null;

  // Only Active sessions are recoverable
  if (storedSession.state !== "Active") {
    console.warn("[SessionRecovery] Session is not Active — cannot recover.", storedSession.state);
    return null;
  }

  const error = validateSessionIntegrity(storedSession, allDares);
  if (error) {
    console.error("[SessionRecovery] Session integrity check failed:", error);
    return null;
  }

  console.info("[SessionRecovery] Session recovered successfully.");
  return storedSession;
}
