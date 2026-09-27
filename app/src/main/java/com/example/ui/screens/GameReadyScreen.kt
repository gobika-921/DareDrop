package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.GameConfig
import com.example.model.Player
import com.example.model.RoundsOption
import com.example.model.SkipLimitOption
import com.example.ui.components.DareDropTopBar
import com.example.ui.components.PaletteFlowerIcon
import com.example.ui.components.PrimaryPillButton
import com.example.ui.theme.*

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun GameReadyScreen(
    players: List<Player>,
    gameConfig: GameConfig,
    onBackClick: () -> Unit,
    onStartGame: () -> Unit
) {
    val scrollState = rememberScrollState()

    Scaffold(
        containerColor = NightBordeaux,
        topBar = {
            DareDropTopBar(onBackClick = onBackClick)
        },
        bottomBar = {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(NightBordeaux)
                    .navigationBarsPadding()
                    .padding(horizontal = 24.dp, vertical = 16.dp)
            ) {
                PrimaryPillButton(
                    text = "START THE GAME 🚀",
                    onClick = onStartGame,
                    testTag = "ready_start_game_button"
                )
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(scrollState)
                .padding(horizontal = 24.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(22.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                PaletteFlowerIcon(size = 30.dp, petalColor = CoolHorizon)
                Text(
                    text = "Are You Ready?",
                    fontFamily = GlutenFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 32.sp,
                    color = IvoryMist
                )
            }

            // Players Section
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "Players",
                    fontFamily = GlutenFontFamily,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 18.sp,
                    color = IvoryMist
                )

                FlowRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    players.forEach { player ->
                        Box(
                            modifier = Modifier
                                .height(38.dp)
                                .clip(RoundedCornerShape(19.dp))
                                .background(IvoryMist)
                                .padding(horizontal = 18.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = player.name,
                                fontFamily = GeomFontFamily,
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp,
                                color = BordeauxText
                            )
                        }
                    }
                }
            }

            HorizontalDivider(color = CoolHorizonMuted.copy(alpha = 0.35f), thickness = 1.dp)

            // Difficulty Level Section
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "Difficulty Level",
                    fontFamily = GlutenFontFamily,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 18.sp,
                    color = IvoryMist
                )

                FlowRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    gameConfig.enabledDifficulties.forEach { diff ->
                        val badgeBg = when (diff) {
                            com.example.model.Difficulty.MILD -> CoolHorizon
                            com.example.model.Difficulty.SPICY -> SpicyColor
                            com.example.model.Difficulty.EXTREME -> ExtremeColor
                        }

                        Box(
                            modifier = Modifier
                                .height(36.dp)
                                .clip(RoundedCornerShape(18.dp))
                                .background(badgeBg)
                                .padding(horizontal = 16.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = diff.displayName,
                                fontFamily = GeomFontFamily,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = if (diff == com.example.model.Difficulty.MILD) BordeauxText else IvoryMist
                            )
                        }
                    }
                }
            }

            HorizontalDivider(color = CoolHorizonMuted.copy(alpha = 0.35f), thickness = 1.dp)

            // Rounds & Skips Info Cards
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(
                        text = "Rounds",
                        fontFamily = GlutenFontFamily,
                        fontSize = 16.sp,
                        color = IvoryMist
                    )
                    Text(
                        text = gameConfig.roundsOption.toDisplayString() +
                                if (gameConfig.roundsOption is RoundsOption.Infinite) " (Infinite)" else " turns",
                        fontFamily = GeomFontFamily,
                        fontSize = 14.sp,
                        color = IvoryMistMuted
                    )
                }

                Column(verticalArrangement = Arrangement.spacedBy(4.dp), horizontalAlignment = Alignment.End) {
                    Text(
                        text = "Skip Limit",
                        fontFamily = GlutenFontFamily,
                        fontSize = 16.sp,
                        color = IvoryMist
                    )
                    Text(
                        text = gameConfig.skipLimitOption.toDisplayString() +
                                if (gameConfig.skipLimitOption is SkipLimitOption.Infinite) " (Unlimited)" else " per player",
                        fontFamily = GeomFontFamily,
                        fontSize = 14.sp,
                        color = IvoryMistMuted
                    )
                }
            }

            HorizontalDivider(color = CoolHorizonMuted.copy(alpha = 0.35f), thickness = 1.dp)

            // Rules summary
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(
                    text = "Rules Enabled",
                    fontFamily = GlutenFontFamily,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 18.sp,
                    color = IvoryMist
                )

                RuleCheckRow(
                    label = "No Repeat Players",
                    enabled = gameConfig.rules.noRepeatPlayers
                )
                RuleCheckRow(
                    label = "No Repeat Dares",
                    enabled = gameConfig.rules.noRepeatDares
                )
                RuleCheckRow(
                    label = "Allow Passes",
                    enabled = gameConfig.rules.allowPasses
                )
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
private fun RuleCheckRow(
    label: String,
    enabled: Boolean
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Text(
            text = if (enabled) "✓" else "✕",
            fontFamily = GeomFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = if (enabled) CoolHorizon else IvoryMistBorder
        )
        Text(
            text = label,
            fontFamily = GeomFontFamily,
            fontWeight = FontWeight.Medium,
            fontSize = 14.sp,
            color = if (enabled) IvoryMist else IvoryMistMuted.copy(alpha = 0.6f)
        )
    }
}
