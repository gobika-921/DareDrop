package com.example.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.audio.SoundEffects
import com.example.ui.components.OutlinedPillButton
import com.example.ui.components.PaletteFlowerIcon
import com.example.ui.components.PrimaryPillButton
import com.example.ui.theme.*

@Composable
fun HomeScreen(
    onStartGame: () -> Unit,
    onHowToPlay: () -> Unit,
    onCustomPack: () -> Unit
) {
    var isMuted by remember { mutableStateOf(SoundEffects.isMuted()) }

    // Gentle rotating flower animation for signature visual flair
    val infiniteTransition = rememberInfiniteTransition(label = "flowerRotate")
    val flowerRotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(18000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "rotate"
    )

    Box(
        modifier = Modifier
            .testTag("home_screen")
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(NightBordeaux, NightBordeauxDark)
                )
            )
    ) {
        // Decorative ambient subtle shapes
        Canvas(modifier = Modifier.fillMaxSize()) {
            val w = size.width
            val h = size.height

            drawCircle(
                color = CoolHorizon.copy(alpha = 0.08f),
                radius = 160f,
                center = Offset(w * 0.9f, h * 0.18f)
            )
            drawCircle(
                color = IvoryMist.copy(alpha = 0.05f),
                radius = 120f,
                center = Offset(w * 0.1f, h * 0.8f)
            )
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .padding(horizontal = 24.dp, vertical = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top Bar with Sound Toggle
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(NightBordeauxElevated)
                        .border(1.dp, CoolHorizonMuted.copy(alpha = 0.4f), RoundedCornerShape(16.dp))
                        .clickable {
                            isMuted = SoundEffects.toggleMute()
                            if (!isMuted) SoundEffects.playTap()
                        }
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(
                            text = if (isMuted) "🔇 Muted" else "🔊 Sound ON",
                            fontFamily = GeomFontFamily,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 12.sp,
                            color = if (isMuted) IvoryMistMuted else CoolHorizon
                        )
                    }
                }
            }

            // Central Hero Title and Badges
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(18.dp)
            ) {
                // Rotating Flower Emblem
                Box(
                    modifier = Modifier
                        .size(90.dp)
                        .shadow(12.dp, CircleShape)
                        .clip(CircleShape)
                        .background(CoolHorizon)
                        .rotate(flowerRotation),
                    contentAlignment = Alignment.Center
                ) {
                    PaletteFlowerIcon(
                        size = 56.dp,
                        petalColor = BordeauxText
                    )
                }

                // Title and tagline
                Text(
                    text = "DareDrop!",
                    fontFamily = GlutenFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 46.sp,
                    color = IvoryMist,
                    textAlign = TextAlign.Center
                )

                Text(
                    text = "Drop the dare. Own the moment.",
                    fontFamily = GeomFontFamily,
                    fontWeight = FontWeight.Normal,
                    fontSize = 16.sp,
                    color = IvoryMistMuted,
                    textAlign = TextAlign.Center
                )

                // Highlighted Ivory Mist chip
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(18.dp))
                        .background(IvoryMist.copy(alpha = 0.12f))
                        .border(1.dp, CoolHorizonMuted.copy(alpha = 0.5f), RoundedCornerShape(18.dp))
                        .padding(horizontal = 18.dp, vertical = 8.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        PaletteFlowerIcon(size = 18.dp, petalColor = CoolHorizon)
                        Text(
                            text = "Multiplayer Party Edition",
                            fontFamily = GeomFontFamily,
                            fontWeight = FontWeight.Medium,
                            fontSize = 13.sp,
                            color = IvoryMist
                        )
                    }
                }
            }

            // Bottom Actions
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(14.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                PrimaryPillButton(
                    text = "Start Game →",
                    onClick = {
                        SoundEffects.playTap()
                        onStartGame()
                    },
                    testTag = "start_game_button"
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedPillButton(
                        text = "How to Play",
                        onClick = {
                            SoundEffects.playTap()
                            onHowToPlay()
                        },
                        modifier = Modifier.weight(1f),
                        testTag = "how_to_play_button"
                    )

                    OutlinedPillButton(
                        text = "Custom Pack",
                        onClick = {
                            SoundEffects.playTap()
                            onCustomPack()
                        },
                        modifier = Modifier.weight(1f),
                        testTag = "custom_pack_button"
                    )
                }
            }
        }
    }
}
