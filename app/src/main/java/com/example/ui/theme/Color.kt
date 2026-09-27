package com.example.ui.theme

import androidx.compose.ui.graphics.Color

// ==========================================
// COLOR PALETTE / 3
// Cool Horizon:   #80AEE8 (Airy periwinkle sky blue)
// Night Bordeaux: #5B0015 (Rich deep wine bordeaux)
// Ivory Mist:     #F7F2E0 (Warm elegant cream)
// ==========================================

val NightBordeaux = Color(0xFF5B0015)        // Deep luxurious wine bordeaux background
val NightBordeauxDark = Color(0xFF42000F)    // Darker shadow / overlay tone
val NightBordeauxElevated = Color(0xFF730620)// Elevated container / dialog / card surface
val NightBordeauxCard = Color(0xFF66041B)    // Surface layer for list items & badges

val CoolHorizon = Color(0xFF80AEE8)          // Accent sky periwinkle blue
val CoolHorizonMuted = Color(0xFF5F8BBF)     // Secondary / outline periwinkle
val CoolHorizonGlow = Color(0xFF9DC4F5)      // Light radiant periwinkle

val IvoryMist = Color(0xFFF7F2E0)            // Radiant cream surface / active fill / hero text
val IvoryMistMuted = Color(0xFFDED8C3)       // Secondary labels and subtitles on dark
val IvoryMistBorder = Color(0xFF9E7D84)      // Pill / chip outline border on bordeaux
val IvoryMistSubtle = Color(0xFFF2ECE0)

// Text on Ivory Mist surfaces
val BordeauxText = Color(0xFF5B0015)         // Headings / bold text on ivory
val BordeauxTextMuted = Color(0xFF8C3445)    // Subtitle on ivory cards
val IvoryMistDivider = Color(0xFFE5DCBE)     // Subtle dividers inside ivory containers

// Toggles & Switches
val ToggleTrackActive = CoolHorizon
val ToggleThumbActive = IvoryMist
val ToggleTrackInactive = Color(0xFF4A0012)
val ToggleThumbInactive = Color(0xFF8A4654)

// Difficulty Badges
val MildColor = CoolHorizon                  // Fresh Cool Horizon blue
val SpicyColor = Color(0xFFE58852)           // Warm spicy amber peach
val ExtremeColor = Color(0xFFFF5269)         // Electric high-contrast punch pink
