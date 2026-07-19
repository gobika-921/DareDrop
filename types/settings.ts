export interface Settings {
  animations: boolean;
  sound: boolean;
  haptics: boolean;
  // Reserved for future use — see Section 20. Do not read/write until implemented.
  theme?: "light" | "dark" | "system";
  language?: string;       // BCP 47 tag, e.g. "en-US"
  saveHistory?: boolean;   // gates whether Archived sessions persist (Section 12)
}
