/**
 * Centralized registry of all AsyncStorage keys.
 * No hardcoded "magic strings" are allowed outside this file.
 */
export const STORAGE_KEYS = {
  SETTINGS: "daredrop:settings",
  CUSTOM_PACKS: "daredrop:customPacks",
  CUSTOM_DARES: "daredrop:customDares",
  ACTIVE_SESSION: "daredrop:activeSession",
  ARCHIVED_SESSIONS: "daredrop:archivedSessions",
  SCHEMA_VERSION: "daredrop:schemaVersion",
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
