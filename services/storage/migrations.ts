import AsyncStorage from "@react-native-async-storage/async-storage";

import { STORAGE_KEYS } from "./keys";
import { CURRENT_SCHEMA_VERSION } from "./version";

/**
 * Migration framework.
 * Currently no-op as this is the baseline (v2), but sets up the exact infrastructure
 * required for future schema migrations without refactoring.
 */
export async function runMigrations(): Promise<void> {
  try {
    const storedVersionStr = await AsyncStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);
    const storedVersion = storedVersionStr ? parseInt(storedVersionStr, 10) : 0;

    if (storedVersion === CURRENT_SCHEMA_VERSION) {
      // Up to date
      return;
    }

    if (storedVersion > CURRENT_SCHEMA_VERSION) {
      console.warn(`[Storage] Future schema version detected (${storedVersion} > ${CURRENT_SCHEMA_VERSION}). Downgrades are not supported.`);
      return;
    }

    console.info(`[Storage] Migrating from version ${storedVersion} to ${CURRENT_SCHEMA_VERSION}`);

    // If storedVersion is 0, it might be a fresh install or a v1 migration.
    // In a real scenario, we would loop through migration scripts here:
    // for (let v = storedVersion + 1; v <= CURRENT_SCHEMA_VERSION; v++) {
    //   await executeMigration(v);
    // }

    // After successful migration, persist the new version
    await AsyncStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION.toString());
    console.info(`[Storage] Migration to version ${CURRENT_SCHEMA_VERSION} complete.`);
  } catch (error) {
    console.error("[Storage] Migration failed. Using existing schema with fallback.", error);
    // We swallow the error so the app can still boot (and rely on safeParse/validation)
  }
}
