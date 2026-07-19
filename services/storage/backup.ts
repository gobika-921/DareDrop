import AsyncStorage from "@react-native-async-storage/async-storage";

import { STORAGE_KEYS } from "./keys";

/**
 * Backup and Recovery utilities for development, debugging, and hard-resets.
 */

/**
 * Completely clears all DareDrop storage data, reverting the app to a fresh install state.
 */
export async function clearAllStorage(): Promise<boolean> {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    console.info("[Storage] All app storage cleared.");
    return true;
  } catch (error) {
    console.error("[Storage] Failed to clear storage", error);
    return false;
  }
}

/**
 * Retrieves a raw JSON backup of all DareDrop storage.
 * Useful for future Export/Sync features.
 */
export async function createBackup(): Promise<string | null> {
  try {
    const keys = Object.values(STORAGE_KEYS);
    const entries = await AsyncStorage.multiGet(keys);
    const backup: Record<string, string | null> = {};
    for (const [key, value] of entries) {
      backup[key] = value;
    }
    return JSON.stringify(backup);
  } catch (error) {
    console.error("[Storage] Failed to create backup", error);
    return null;
  }
}

/**
 * Restores a raw JSON backup. Completely overrides existing data.
 */
export async function restoreBackup(backupJson: string): Promise<boolean> {
  try {
    const backup = JSON.parse(backupJson) as Record<string, string | null>;
    const kvPairs: [string, string][] = [];
    
    for (const [key, value] of Object.entries(backup)) {
      if (value !== null && typeof value === "string") {
        kvPairs.push([key, value]);
      }
    }
    
    // Clear existing before restore to avoid merging artifacts
    await clearAllStorage();
    if (kvPairs.length > 0) {
      await AsyncStorage.multiSet(kvPairs);
    }
    
    console.info("[Storage] Backup restored successfully.");
    return true;
  } catch (error) {
    console.error("[Storage] Failed to restore backup", error);
    return false;
  }
}
