import { useFonts } from "expo-font";

import { fontAssets } from "@/theme/fonts";

export function useAppFonts() {
  const [loaded] = useFonts(fontAssets);
  return loaded;
}


