import {
  Settings,
  GameSession,
  Dare,
  DarePack,
} from "../../types";
import {
  isValidSettings,
  isValidGameSession,
  isValidDare,
  isValidDarePack,
} from "../../utils/validation";

/**
 * Validates storage structures on load.
 * Wraps the core domain validators and provides safe defaults when storage is corrupted or empty.
 */

export function validateSettings(data: unknown): Settings {
  if (data && typeof data === "object" && isValidSettings(data as Partial<Settings>)) {
    return data as Settings;
  }
  // Safe default
  return {
    animations: true,
    sound: true,
    haptics: true,
  };
}

export function validateGameSession(data: unknown): GameSession | null {
  if (data && typeof data === "object" && isValidGameSession(data as Partial<GameSession>)) {
    return data as GameSession;
  }
  return null;
}

export function validateGameSessions(data: unknown): GameSession[] {
  if (Array.isArray(data)) {
    return data.filter((item) => item && typeof item === "object" && isValidGameSession(item as Partial<GameSession>)) as GameSession[];
  }
  return [];
}

export function validateDares(data: unknown): Dare[] {
  if (Array.isArray(data)) {
    return data.filter((item) => item && typeof item === "object" && isValidDare(item as Partial<Dare>)) as Dare[];
  }
  return [];
}

export function validatePacks(data: unknown): DarePack[] {
  if (Array.isArray(data)) {
    return data.filter((item) => item && typeof item === "object" && isValidDarePack(item as Partial<DarePack>)) as DarePack[];
  }
  return [];
}
