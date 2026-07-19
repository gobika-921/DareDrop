export type AvatarColor =
  | "coral"
  | "sage"
  | "clay"
  | "sand"
  | "moss"
  | "rust"
  | "slate"
  | "blush";

export type Difficulty = "Mild" | "Spicy" | "Extreme";

export type DareSource = "Bundled" | "Custom";

export type PackType = "BuiltIn" | "Custom";

export type GameSessionState =
  | "Draft"
  | "Configuring"
  | "Ready"
  | "Active"
  | "Completed"
  | "Archived";

export type RoundState = "Pending" | "Revealed" | "Resolved";

export type RoundResult = "Completed" | "Skipped" | "Passed";

export type AwardTitle =
  | "Dare Devil"
  | "Biggest Chicken"
  | "Skip Master"
  | "Most Fearless"
  | "Comedy King";
