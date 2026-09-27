package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.GameStats
import com.example.model.Player
import com.example.ui.components.CelebrationParticles
import com.example.ui.components.OutlinedPillButton
import com.example.ui.components.PaletteFlowerIcon
import com.example.ui.components.PrimaryPillButton
import com.example.ui.theme.*

@Composable
fun GameCompleteScreen(
    stats: GameStats,
    players: List<Player>,
    onPlayAgain: () -> Unit,
    onNewGame: () -> Unit,
    onHome: () -> Unit
) {
    val scrollState = rememberScrollState()

    LaunchedEffect(Unit) {
        com.example.audio.SoundEffects.playSuccess()
    }

    Box(
        modifier = Modifier
            .testTag("game_complete_screen")
            .fillMaxSize()
            .background(NightBordeaux)
    ) {
        CelebrationParticles()

        Scaffold(
            containerColor = Color.Transparent,
            bottomBar = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(NightBordeaux)
                        .navigationBarsPadding()
                        .padding(horizontal = 24.dp, vertical = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    PrimaryPillButton(
                        text = "PLAY AGAIN ↺",
                        onClick = onPlayAgain,
                        testTag = "play_again_button"
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        OutlinedPillButton(
                            text = "New Game",
                            onClick = onNewGame,
                            modifier = Modifier.weight(1f),
                            testTag = "new_game_button"
                        )

                        OutlinedPillButton(
                            text = "Home",
                            onClick = onHome,
                            modifier = Modifier.weight(1f),
                            testTag = "home_button"
                        )
                    }
                }
            }
        ) { innerPadding ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .verticalScroll(scrollState)
                    .padding(horizontal = 24.dp, vertical = 16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                Spacer(modifier = Modifier.height(8.dp))

                // Title Section with Flower Accent
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    PaletteFlowerIcon(size = 40.dp, petalColor = CoolHorizon)

                    Text(
                        text = "That's a Wrap!",
                        fontFamily = GlutenFontFamily,
                        fontWeight = FontWeight.Bold,
                        fontSize = 36.sp,
                        color = IvoryMist,
                        textAlign = TextAlign.Center
                    )

                    Text(
                        text = "You survived DareDrop.",
                        fontFamily = GeomFontFamily,
                        fontWeight = FontWeight.Normal,
                        fontSize = 16.sp,
                        color = IvoryMistMuted,
                        textAlign = TextAlign.Center
                    )
                }

                // MVP Banner if available
                if (stats.mostDaringPlayerName != null) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .shadow(8.dp, RoundedCornerShape(22.dp))
                            .clip(RoundedCornerShape(22.dp))
                            .background(NightBordeauxElevated)
                            .border(1.5.dp, CoolHorizon, RoundedCornerShape(22.dp))
                            .padding(18.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Text(
                                text = "👑 MOST DARING PLAYER",
                                fontFamily = GeomFontFamily,
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                color = CoolHorizon,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = stats.mostDaringPlayerName,
                                fontFamily = GlutenFontFamily,
                                fontWeight = FontWeight.Bold,
                                fontSize = 28.sp,
                                color = IvoryMist
                            )
                        }
                    }
                }

                // Stats Grid Card - Ivory Mist surface
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .shadow(12.dp, RoundedCornerShape(26.dp))
                        .clip(RoundedCornerShape(26.dp))
                        .background(IvoryMist)
                        .padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Game Stats",
                            fontFamily = GlutenFontFamily,
                            fontWeight = FontWeight.Bold,
                            fontSize = 20.sp,
                            color = BordeauxText
                        )
                        PaletteFlowerIcon(size = 20.dp, petalColor = CoolHorizon)
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        StatItem("Rounds Played", "${stats.roundsPlayed}")
                        StatItem("Completed", "${stats.daresCompleted}")
                    }

                    HorizontalDivider(color = IvoryMistDivider, thickness = 1.dp)

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        StatItem("Skipped", "${stats.daresSkipped}")
                        StatItem("Passed", "${stats.daresPassed}")
                    }
                }

                // Player Leaderboard
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(22.dp))
                        .background(NightBordeauxElevated)
                        .border(1.dp, CoolHorizonMuted.copy(alpha = 0.4f), RoundedCornerShape(22.dp))
                        .padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Player Breakdown",
                        fontFamily = GlutenFontFamily,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 18.sp,
                        color = IvoryMist
                    )

                    players.forEach { player ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                PaletteFlowerIcon(size = 14.dp, petalColor = CoolHorizon)
                                Text(
                                    text = player.name,
                                    fontFamily = GeomFontFamily,
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 15.sp,
                                    color = IvoryMist
                                )
                            }

                            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                Text(
                                    text = "✓ ${player.completedCount}",
                                    fontFamily = GeomFontFamily,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = CoolHorizon
                                )
                                Text(
                                    text = "✕ ${player.skippedCount}",
                                    fontFamily = GeomFontFamily,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = ExtremeColor
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Composable
private fun StatItem(label: String, value: String) {
    Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
        Text(
            text = label,
            fontFamily = GeomFontFamily,
            fontWeight = FontWeight.Normal,
            fontSize = 13.sp,
            color = BordeauxTextMuted
        )
        Text(
            text = value,
            fontFamily = GlutenFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 26.sp,
            color = BordeauxText
        )
    }
}
