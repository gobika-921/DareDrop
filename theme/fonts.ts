import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import {
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

export const fonts = {
  display: "Poppins",
  body: "Inter",
  fallback: "System",
} as const;


export const fontAssets = {
  Poppins_600SemiBold,
  Poppins_700Bold,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} as const;


export type AppFont = keyof typeof fonts;



