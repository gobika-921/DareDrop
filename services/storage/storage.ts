import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Settings,
  GameSession,
  Dare,
  DarePack,
} from "../../types";

import { STORAGE_KEYS } from "./keys";
import { safeParse, safeStringify } from "./serializer";
import {
  validateSettings,
  validateGameSession,
  validateGameSessions,
  validateDares,
  validatePacks,
} from "./validation";

/**
 * Generic getter
 */
async function get<T>(key: string, validator: (data: unknown) => T): Promise<T> {
  try {
    const jsonStr = await AsyncStorage.getItem(key);
    const parsed = safeParse<unknown>(jsonStr);
    return validator(parsed);
  } catch (error) {
    console.error(`[Storage] Failed to get ${key}`, error);
    return validator(null); // Return safe default
  }
}

/**
 * Generic setter
 */
async function set<T>(key: string, data: T): Promise<boolean> {
  const jsonStr = safeStringify(data);
  if (jsonStr === null) return false;
  try {
    await AsyncStorage.setItem(key, jsonStr);
    return true;
  } catch (error) {
    console.error(`[Storage] Failed to set ${key}`, error);
    return false;
  }
}

// --- Specific Type-Safe Accessors ---

export async function getSettings(): Promise<Settings> {
  return get(STORAGE_KEYS.SETTINGS, validateSettings);
}

export async function setSettings(settings: Settings): Promise<boolean> {
  return set(STORAGE_KEYS.SETTINGS, settings);
}

export async function getActiveSession(): Promise<GameSession | null> {
  return get(STORAGE_KEYS.ACTIVE_SESSION, validateGameSession);
}

export async function setActiveSession(session: GameSession | null): Promise<boolean> {
  if (session === null) {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
      return true;
    } catch {
      return false;
    }
  }
  return set(STORAGE_KEYS.ACTIVE_SESSION, session);
}

export async function getArchivedSessions(): Promise<GameSession[]> {
  return get(STORAGE_KEYS.ARCHIVED_SESSIONS, validateGameSessions);
}

export async function setArchivedSessions(sessions: GameSession[]): Promise<boolean> {
  return set(STORAGE_KEYS.ARCHIVED_SESSIONS, sessions);
}

export async function getCustomDares(): Promise<Dare[]> {
  return get(STORAGE_KEYS.CUSTOM_DARES, validateDares);
}

export async function setCustomDares(dares: Dare[]): Promise<boolean> {
  return set(STORAGE_KEYS.CUSTOM_DARES, dares);
}

export async function getCustomPacks(): Promise<DarePack[]> {
  return get(STORAGE_KEYS.CUSTOM_PACKS, validatePacks);
}

export async function setCustomPacks(packs: DarePack[]): Promise<boolean> {
  return set(STORAGE_KEYS.CUSTOM_PACKS, packs);
}
