import { AvatarColor } from "./enums";

export interface Player {
  id: string;              // UUID v4, immutable
  name: string;             // 1–20 chars, unique (case-insensitive) within session
  avatarColor: AvatarColor; // from design-system enum, not arbitrary hex
  createdAt: string;        // ISO 8601, set once
}
