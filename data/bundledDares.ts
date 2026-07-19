import { Dare } from "../types";

/**
 * Bundled dares — static, immutable, never persisted.
 * 15 dares per difficulty tier (45 total).
 * IDs are stable UUIDs so that history references remain valid across app updates.
 */

// ─── Mild Dares ────────────────────────────────────────────────────────────────

export const MILD_DARES: readonly Dare[] = [
  { id: "d-mild-001", text: "Do your best impression of a celebrity", difficulty: "Mild", source: "Bundled", packId: "pack-mild" },
  { id: "d-mild-002", text: "Speak in an accent for the next two rounds", difficulty: "Mild", source: "Bundled", packId: "pack-mild" },
  { id: "d-mild-003", text: "Show the last photo you took on your phone", difficulty: "Mild", source: "Bundled", packId: "pack-mild" },
  { id: "d-mild-004", text: "Let someone else post a story on your social media", difficulty: "Mild", source: "Bundled", packId: "pack-mild" },
  { id: "d-mild-005", text: "Do ten jumping jacks right now", difficulty: "Mild", source: "Bundled", packId: "pack-mild" },
  { id: "d-mild-006", text: "Tell an embarrassing childhood story", difficulty: "Mild", source: "Bundled", packId: "pack-mild" },
  { id: "d-mild-007", text: "Sing the chorus of your favorite song", difficulty: "Mild", source: "Bundled", packId: "pack-mild" },
  { id: "d-mild-008", text: "Let the group give you a nickname for the rest of the game", difficulty: "Mild", source: "Bundled", packId: "pack-mild" },
  { id: "d-mild-009", text: "Do a dramatic reading of your last sent text message", difficulty: "Mild", source: "Bundled", packId: "pack-mild" },
  { id: "d-mild-010", text: "Try to make someone laugh without touching them", difficulty: "Mild", source: "Bundled", packId: "pack-mild" },
  { id: "d-mild-011", text: "Hold a straight face while everyone tries to make you laugh for 30 seconds", difficulty: "Mild", source: "Bundled", packId: "pack-mild" },
  { id: "d-mild-012", text: "Talk in slow motion for the next minute", difficulty: "Mild", source: "Bundled", packId: "pack-mild" },
  { id: "d-mild-013", text: "Tell the group your most unpopular opinion", difficulty: "Mild", source: "Bundled", packId: "pack-mild" },
  { id: "d-mild-014", text: "Let someone draw something on your hand with a pen", difficulty: "Mild", source: "Bundled", packId: "pack-mild" },
  { id: "d-mild-015", text: "Do your best dance move right now", difficulty: "Mild", source: "Bundled", packId: "pack-mild" },
] as const;

// ─── Spicy Dares ───────────────────────────────────────────────────────────────

export const SPICY_DARES: readonly Dare[] = [
  { id: "d-spicy-001", text: "Call a random contact and sing Happy Birthday to them", difficulty: "Spicy", source: "Bundled", packId: "pack-spicy" },
  { id: "d-spicy-002", text: "Let someone send a text from your phone to anyone they choose", difficulty: "Spicy", source: "Bundled", packId: "pack-spicy" },
  { id: "d-spicy-003", text: "Post an unflattering selfie on your social media", difficulty: "Spicy", source: "Bundled", packId: "pack-spicy" },
  { id: "d-spicy-004", text: "Do a dramatic breakup scene with the person to your left", difficulty: "Spicy", source: "Bundled", packId: "pack-spicy" },
  { id: "d-spicy-005", text: "Let the group go through your camera roll for 30 seconds", difficulty: "Spicy", source: "Bundled", packId: "pack-spicy" },
  { id: "d-spicy-006", text: "Give a one-minute speech about why you are the best person in the room", difficulty: "Spicy", source: "Bundled", packId: "pack-spicy" },
  { id: "d-spicy-007", text: "Eat a spoonful of a condiment chosen by the group", difficulty: "Spicy", source: "Bundled", packId: "pack-spicy" },
  { id: "d-spicy-008", text: "Do your most embarrassing talent in front of everyone", difficulty: "Spicy", source: "Bundled", packId: "pack-spicy" },
  { id: "d-spicy-009", text: "Let someone style your hair however they want", difficulty: "Spicy", source: "Bundled", packId: "pack-spicy" },
  { id: "d-spicy-010", text: "Recreate a famous movie scene by yourself", difficulty: "Spicy", source: "Bundled", packId: "pack-spicy" },
  { id: "d-spicy-011", text: "Talk in a baby voice for the next three rounds", difficulty: "Spicy", source: "Bundled", packId: "pack-spicy" },
  { id: "d-spicy-012", text: "Do a catwalk across the room with full confidence", difficulty: "Spicy", source: "Bundled", packId: "pack-spicy" },
  { id: "d-spicy-013", text: "Let the group pick a song and you have to dance to it for a full minute", difficulty: "Spicy", source: "Bundled", packId: "pack-spicy" },
  { id: "d-spicy-014", text: "Read out loud your most recent search history item", difficulty: "Spicy", source: "Bundled", packId: "pack-spicy" },
  { id: "d-spicy-015", text: "Attempt to do the worm or another breakdance move", difficulty: "Spicy", source: "Bundled", packId: "pack-spicy" },
] as const;

// ─── Extreme Dares ─────────────────────────────────────────────────────────────

export const EXTREME_DARES: readonly Dare[] = [
  { id: "d-extreme-001", text: "Go outside and compliment the first stranger you see", difficulty: "Extreme", source: "Bundled", packId: "pack-extreme" },
  { id: "d-extreme-002", text: "Let someone write anything on your forehead with a marker", difficulty: "Extreme", source: "Bundled", packId: "pack-extreme" },
  { id: "d-extreme-003", text: "Call your mom and tell her you got a tattoo", difficulty: "Extreme", source: "Bundled", packId: "pack-extreme" },
  { id: "d-extreme-004", text: "Go live on social media for at least 60 seconds doing something embarrassing", difficulty: "Extreme", source: "Bundled", packId: "pack-extreme" },
  { id: "d-extreme-005", text: "Let the group compose and send a DM from your account", difficulty: "Extreme", source: "Bundled", packId: "pack-extreme" },
  { id: "d-extreme-006", text: "Swap an item of clothing with the person to your right for the rest of the game", difficulty: "Extreme", source: "Bundled", packId: "pack-extreme" },
  { id: "d-extreme-007", text: "Do karaoke to a song chosen by the group — no backing out", difficulty: "Extreme", source: "Bundled", packId: "pack-extreme" },
  { id: "d-extreme-008", text: "Let someone pick a dare from your phone's search suggestions and do it", difficulty: "Extreme", source: "Bundled", packId: "pack-extreme" },
  { id: "d-extreme-009", text: "Act out a proposal scene to someone in the group on one knee", difficulty: "Extreme", source: "Bundled", packId: "pack-extreme" },
  { id: "d-extreme-010", text: "Record a video of yourself doing something cringeworthy and keep it on your phone", difficulty: "Extreme", source: "Bundled", packId: "pack-extreme" },
  { id: "d-extreme-011", text: "Let the group change your phone wallpaper to whatever they want", difficulty: "Extreme", source: "Bundled", packId: "pack-extreme" },
  { id: "d-extreme-012", text: "Walk up to a neighbor and ask to borrow something ridiculous", difficulty: "Extreme", source: "Bundled", packId: "pack-extreme" },
  { id: "d-extreme-013", text: "Post a public status or tweet that the group writes for you", difficulty: "Extreme", source: "Bundled", packId: "pack-extreme" },
  { id: "d-extreme-014", text: "Do an interpretive dance to a song of the group's choice in a public area", difficulty: "Extreme", source: "Bundled", packId: "pack-extreme" },
  { id: "d-extreme-015", text: "Let the group record a 15-second video of you doing anything they choose", difficulty: "Extreme", source: "Bundled", packId: "pack-extreme" },
] as const;

/** All bundled dares combined. */
export const BUNDLED_DARES: readonly Dare[] = [
  ...MILD_DARES,
  ...SPICY_DARES,
  ...EXTREME_DARES,
];
