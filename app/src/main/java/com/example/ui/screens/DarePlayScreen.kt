package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.*
import com.example.ui.components.*
import com.example.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun DarePlayScreen(
    gameState: ActiveGameState,
    gameConfig: GameConfig,
    onComplete: () -> Unit,
    onSkip: () -> Unit,
    onPass: () -> Unit,
    onNextTurn: () -> Unit,
    onClearCelebration: () -> Unit,
    onMenuRules: () -> Unit,
    onMenuRestart: () -> Unit,
    onMenuEndGame: () -> Unit
) {
    var showPauseMenu by remember { mutableStateOf(false) }

    val activePlayer = gameState.currentPlayer
    val activeDare = gameState.currentDare

    val skipsLeft = if (activePlayer != null) {
        gameState.remainingSkips[activePlayer.id] ?: 0
    } else 0
    val canSkip = skipsLeft > 0

    // Card drop animation
    val dropAnim = remember { Animatable(-300f) }
    val rotationAnim = remember { Animatable(-4f) }
    val alphaAnim = remember { Animatable(0f) }

    LaunchedEffect(activeDare?.id) {
        com.example.audio.SoundEffects.playDrop()
        dropAnim.snapTo(-300f)
        rotationAnim.snapTo(-4f)
        alphaAnim.snapTo(0f)

        launch {
            alphaAnim.animateTo(1f, tween(180))
        }
        launch {
            rotationAnim.animateTo(
                targetValue = 0f,
                animationSpec = spring(
                    dampingRatio = Spring.DampingRatioMediumBouncy,
                    stiffness = Spring.StiffnessMedium
                )
            )
        }
        dropAnim.animateTo(
            targetValue = 0f,
            animationSpec = spring(
                dampingRatio = Spring.DampingRatioMediumBouncy,
                stiffness = Spring.StiffnessMedium
            )
        )
    }

    if (showPauseMenu) {
        PauseMenuDialog(
            onResume = { showPauseMenu = false },
            onRules = {
                showPauseMenu = false
                onMenuRules()
            },
            onRestart = {
                showPauseMenu = false
                onMenuRestart()
            },
            onEndGame = {
                showPauseMenu = false
                onMenuEndGame()
            },
            onDismiss = { showPauseMenu = false }
        )
    }

    val celebration = gameState.celebration

    Box(
        modifier = Modifier
            .testTag("dare_play_screen")
            .fillMaxSize()
            .background(NightBordeaux)
    ) {
        Scaffold(
            containerColor = Color.Transparent,
            topBar = {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .statusBarsPadding()
                        .padding(horizontal = 20.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Round Progress Pill in Night Bordeaux style
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .background(NightBordeauxElevated)
                            .border(1.dp, CoolHorizonMuted.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = if (gameState.isInfiniteRounds) {
                                "Round ${gameState.currentRound}"
                            } else {
                                "Round ${gameState.currentRound} / ${gameState.totalRounds}"
                            },
                            fontFamily = GeomFontFamily,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = CoolHorizon
                        )
                    }

                    // Pause Menu
                    DareDropTopBar(
                        onBackClick = null,
                        onMenuClick = { showPauseMenu = true },
                        modifier = Modifier.width(60.dp)
                    )
                }
            },
            bottomBar = {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .navigationBarsPadding()
                        .padding(horizontal = 24.dp, vertical = 16.dp)
                ) {
                    if (celebration == null) {
                        Column(
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            // Primary Complete Button
                            PrimaryPillButton(
                                text = "COMPLETE ✓",
                                onClick = {
                                    com.example.audio.SoundEffects.playSuccess()
                                    onComplete()
                                },
                                testTag = "complete_dare_button"
                            )

                            // Action Row: Skip & Pass
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                val skipText = if (skipsLeft == Int.MAX_VALUE) {
                                    "SKIP →"
                                } else if (canSkip) {
                                    "SKIP ($skipsLeft left) →"
                                } else {
                                    "No skips left"
                                }

                                OutlinedPillButton(
                                    text = skipText,
                                    onClick = {
                                        com.example.audio.SoundEffects.playSkip()
                                        onSkip()
                                    },
                                    isSelected = false,
                                    modifier = Modifier.weight(1f),
                                    testTag = "skip_dare_button"
                                )

                                if (gameConfig.rules.allowPasses) {
                                    OutlinedPillButton(
                                        text = "PASS ↺",
                                        onClick = {
                                            com.example.audio.SoundEffects.playSkip()
                                            onPass()
                                        },
                                        isSelected = false,
                                        modifier = Modifier.weight(0.8f),
                                        testTag = "pass_dare_button"
                                    )
                                }
                            }
                        }
                    } else {
                        PrimaryPillButton(
                            text = "NEXT TURN →",
                            onClick = {
                                com.example.audio.SoundEffects.playTap()
                                onNextTurn()
                            },
                            testTag = "next_turn_button"
                        )
                    }
                }
            }
        ) { innerPadding ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(horizontal = 24.dp)
                    .verticalScroll(rememberScrollState()),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                // Header tag with palette flower
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    PaletteFlowerIcon(size = 20.dp, petalColor = CoolHorizon)
                    Text(
                        text = "${activePlayer?.name ?: "Player"}'s Dare",
                        fontFamily = GlutenFontFamily,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 20.sp,
                        color = IvoryMist
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // The Dropped Dare Card - Ivory Mist surface
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .graphicsLayer {
                            translationY = dropAnim.value
                            rotationZ = rotationAnim.value
                            alpha = alphaAnim.value
                        }
                        .shadow(24.dp, RoundedCornerShape(32.dp), ambientColor = Color.Black, spotColor = Color.Black)
                        .clip(RoundedCornerShape(32.dp))
                        .background(IvoryMist)
                        .padding(horizontal = 26.dp, vertical = 32.dp)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(20.dp)
                    ) {
                        // Difficulty badge
                        val diff = activeDare?.difficulty ?: Difficulty.MILD
                        val badgeColor = when (diff) {
                            Difficulty.MILD -> CoolHorizon
                            Difficulty.SPICY -> SpicyColor
                            Difficulty.EXTREME -> ExtremeColor
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(14.dp))
                                .background(badgeColor)
                                .padding(horizontal = 14.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = diff.displayName.uppercase(),
                                fontFamily = GeomFontFamily,
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                color = if (diff == Difficulty.MILD) BordeauxText else Color.White,
                                letterSpacing = 1.sp
                            )
                        }

                        // Main Dare Text
                        Text(
                            text = activeDare?.text ?: "Ready?",
                            fontFamily = GlutenFontFamily,
                            fontWeight = FontWeight.Bold,
                            fontSize = 26.sp,
                            lineHeight = 34.sp,
                            color = BordeauxText,
                            textAlign = TextAlign.Center
                        )

                        // Subtle flower motif divider
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            HorizontalDivider(
                                color = BordeauxText.copy(alpha = 0.15f),
                                thickness = 1.dp,
                                modifier = Modifier.weight(1f)
                            )
                            PaletteFlowerIcon(size = 14.dp, petalColor = CoolHorizon)
                            HorizontalDivider(
                                color = BordeauxText.copy(alpha = 0.15f),
                                thickness = 1.dp,
                                modifier = Modifier.weight(1f)
                            )
                        }

                        Text(
                            text = "Drop the dare. Own the moment.",
                            fontFamily = GeomFontFamily,
                            fontWeight = FontWeight.Normal,
                            fontSize = 13.sp,
                            color = BordeauxTextMuted,
                            textAlign = TextAlign.Center
                        )
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))
            }
        }

        // Celebration Overlay with flower petal burst
        if (celebration != null) {
            if (celebration.type == CelebrationType.COMPLETED) {
                CelebrationParticles()
            }

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.55f)),
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(0.85f)
                        .clip(RoundedCornerShape(26.dp))
                        .background(NightBordeauxElevated)
                        .border(BorderStroke(1.5.dp, CoolHorizon), RoundedCornerShape(26.dp))
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        PaletteFlowerIcon(size = 36.dp, petalColor = CoolHorizon)

                        Text(
                            text = celebration.message,
                            fontFamily = GlutenFontFamily,
                            fontWeight = FontWeight.Bold,
                            fontSize = 24.sp,
                            color = IvoryMist,
                            textAlign = TextAlign.Center
                        )

                        Text(
                            text = if (celebration.type == CelebrationType.COMPLETED) {
                                "You actually did it!"
                            } else if (celebration.type == CelebrationType.SKIPPED) {
                                "Dodged that one. Ready for next player?"
                            } else {
                                "Dare swapped! Take another shot."
                            },
                            fontFamily = GeomFontFamily,
                            fontSize = 15.sp,
                            color = IvoryMistMuted,
                            textAlign = TextAlign.Center
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        PrimaryPillButton(
                            text = if (celebration.type == CelebrationType.PASSED) "Show New Dare" else "Next Turn →",
                            onClick = if (celebration.type == CelebrationType.PASSED) {
                                onClearCelebration
                            } else onNextTurn,
                            testTag = "celebration_next_button"
                        )
                    }
                }
            }
        }
    }
}
