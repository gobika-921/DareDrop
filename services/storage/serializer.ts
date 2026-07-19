/**
 * Safe serialization layer.
 * Hides raw JSON.parse/stringify to ensure the application never crashes
 * due to corrupted storage data.
 */

/**
 * Safely parses a JSON string into a typed object.
 * Returns null if parsing fails, ensuring the app handles corrupted data gracefully.
 *
 * @param jsonString The raw JSON string from storage.
 * @returns The parsed object of type T, or null if invalid/empty.
 */
export function safeParse<T>(jsonString: string | null | undefined): T | null {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("[Storage] Failed to parse JSON data:", error);
    return null;
  }
}

/**
 * Safely serializes an object to a JSON string.
 * Returns null if serialization fails (e.g., circular references, though our domain shouldn't have them).
 *
 * @param data The object to serialize.
 * @returns The JSON string, or null if serialization fails.
 */
export function safeStringify<T>(data: T): string | null {
  if (data === undefined) return null;
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error("[Storage] Failed to stringify data:", error);
    return null;
  }
}
