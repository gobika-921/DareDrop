package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.ui.theme.*

@Composable
fun PauseMenuDialog(
    onResume: () -> Unit,
    onRules: () -> Unit,
    onRestart: () -> Unit,
    onEndGame: () -> Unit,
    onDismiss: () -> Unit
) {
    var showEndConfirm by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .clip(RoundedCornerShape(28.dp))
                .background(NightBordeauxElevated)
                .border(1.5.dp, CoolHorizonMuted.copy(alpha = 0.5f), RoundedCornerShape(28.dp))
                .padding(24.dp)
        ) {
            if (!showEndConfirm) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    PaletteFlowerIcon(size = 32.dp, petalColor = CoolHorizon)

                    Text(
                        text = "Game Paused",
                        fontFamily = GlutenFontFamily,
                        fontSize = 24.sp,
                        color = IvoryMist,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    PrimaryPillButton(
                        text = "Resume",
                        onClick = onResume,
                        testTag = "dialog_resume_button"
                    )

                    OutlinedPillButton(
                        text = "How to Play",
                        onClick = onRules,
                        modifier = Modifier.fillMaxWidth(),
                        testTag = "dialog_rules_button"
                    )

                    OutlinedPillButton(
                        text = "Restart Game",
                        onClick = onRestart,
                        modifier = Modifier.fillMaxWidth(),
                        testTag = "dialog_restart_button"
                    )

                    TextButton(
                        onClick = { showEndConfirm = true },
                        modifier = Modifier.testTag("dialog_end_game_button")
                    ) {
                        Text(
                            text = "End Game",
                            fontFamily = GeomFontFamily,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 15.sp,
                            color = ExtremeColor
                        )
                    }
                }
            } else {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Text(
                        text = "End this game?",
                        fontFamily = GlutenFontFamily,
                        fontSize = 22.sp,
                        color = IvoryMist,
                        textAlign = TextAlign.Center
                    )

                    Text(
                        text = "Your current session will wrap up and final stats will be calculated.",
                        fontFamily = GeomFontFamily,
                        fontSize = 14.sp,
                        color = IvoryMistMuted,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    PrimaryPillButton(
                        text = "Keep Playing",
                        onClick = { showEndConfirm = false },
                        testTag = "dialog_keep_playing_button"
                    )

                    OutlinedPillButton(
                        text = "End Game Now",
                        onClick = onEndGame,
                        modifier = Modifier.fillMaxWidth(),
                        testTag = "dialog_confirm_end_button"
                    )
                }
            }
        }
    }
}
