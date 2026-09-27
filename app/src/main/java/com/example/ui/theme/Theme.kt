package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DareDropColorScheme = darkColorScheme(
    primary = IvoryMist,
    onPrimary = BordeauxText,
    primaryContainer = IvoryMist,
    onPrimaryContainer = BordeauxText,
    secondary = CoolHorizon,
    onSecondary = BordeauxText,
    background = NightBordeaux,
    onBackground = IvoryMist,
    surface = NightBordeauxElevated,
    onSurface = IvoryMist,
    surfaceVariant = NightBordeauxCard,
    onSurfaceVariant = IvoryMistMuted,
    outline = IvoryMistBorder
)

@Composable
fun MyApplicationTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DareDropColorScheme,
        typography = Typography,
        content = content
    )
}
