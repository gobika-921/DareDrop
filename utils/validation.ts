import {
  Player,
  Dare,
  GameConfiguration,
  GameSession,
  Round,
  Settings,
  DarePack,
} from "../types";

/**
 * Validates a Player entity.
 * - name: 1–20 chars (after trim)
 * - avatarColor: must be a valid AvatarColor enum (this is mostly enforced by TS, but we can do a runtime check if needed)
 */
export function isValidPlayer(player: Partial<Player>): boolean {
  if (!player.id || typeof player.id !== "string") return false;
  if (!player.name || typeof player.name !== "string" || player.name.trim().length < 1 || player.name.trim().length > 20) return false;
  if (!player.avatarColor) return false;
  if (!player.createdAt || typeof player.createdAt !== "string") return false;
  return true;
}

/**
 * Validates a Dare entity.
 * - text: 5–300 chars (if custom)
 */
export function isValidDare(dare: Partial<Dare>): boolean {
  if (!dare.id || typeof dare.id !== "string") return false;
  if (!dare.text || typeof dare.text !== "string") return false;
  if (dare.source === "Custom" && (dare.text.trim().length < 5 || dare.text.trim().length > 300)) return false;
  if (!dare.difficulty) return false;
  if (!dare.source) return false;
  if (dare.packId === undefined) return false; // can be null, but not undefined
  return true;
}

/**
 * Validates a DarePack entity.
 */
export function isValidDarePack(pack: Partial<DarePack>): boolean {
  if (!pack.id || typeof pack.id !== "string") return false;
  if (!pack.name || typeof pack.name !== "string" || pack.name.trim().length === 0) return false;
  if (!pack.type) return false;
  if (!Array.isArray(pack.dareIds)) return false;
  return true;
}

/**
 * Validates GameConfiguration.
 * - rounds: 5-100
 * - skipLimit: 0-rounds
 * - difficulty: at least 1
 * - selectedPackIds: at least 1
 */
export function isValidConfiguration(config: Partial<GameConfiguration>): boolean {
  if (!config.difficulty || !Array.isArray(config.difficulty) || config.difficulty.length === 0) return false;
  if (typeof config.rounds !== "number" || config.rounds < 5 || config.rounds > 100) return false;
  if (typeof config.skipLimit !== "number" || config.skipLimit < 0 || config.skipLimit > config.rounds) return false;
  if (!config.selectedPackIds || !Array.isArray(config.selectedPackIds) || config.selectedPackIds.length === 0) return false;
  if (typeof config.allowCustomDares !== "boolean") return false;
  if (!config.rules) return false;
  if (typeof config.rules.noRepeatPlayers !== "boolean") return false;
  if (typeof config.rules.noRepeatDares !== "boolean") return false;
  if (typeof config.rules.allowPasses !== "boolean") return false;
  return true;
}

/**
 * Validates a GameSession.
 * Validates the core non-optional fields.
 */
export function isValidGameSession(session: Partial<GameSession>): boolean {
  if (!session.id || typeof session.id !== "string") return false;
  if (!session.state) return false;
  if (!session.configuration || !isValidConfiguration(session.configuration)) return false;
  if (!session.players || !Array.isArray(session.players) || session.players.length < 2 || session.players.length > 20) return false;
  if (!session.rounds || !Array.isArray(session.rounds)) return false;
  if (!session.history || !Array.isArray(session.history)) return false;
  return true;
}

/**
 * Validates a Round entity.
 */
export function isValidRound(round: Partial<Round>): boolean {
  if (typeof round.roundNumber !== "number" || round.roundNumber < 1) return false;
  if (!round.state) return false;
  if (!round.playerId || typeof round.playerId !== "string") return false;
  if (!round.dareId || typeof round.dareId !== "string") return false;
  if (!round.startedAt || typeof round.startedAt !== "string") return false;
  return true;
}

/**
 * Validates Settings.
 */
export function isValidSettings(settings: Partial<Settings>): boolean {
  if (typeof settings.animations !== "boolean") return false;
  if (typeof settings.sound !== "boolean") return false;
  if (typeof settings.haptics !== "boolean") return false;
  return true;
}
