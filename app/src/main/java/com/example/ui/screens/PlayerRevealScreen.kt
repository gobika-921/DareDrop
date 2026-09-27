package com.example.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.ActiveGameState
import com.example.model.Player
import com.example.ui.components.DareDropTopBar
import com.example.ui.components.PaletteFlowerIcon
import com.example.ui.components.PauseMenuDialog
import com.example.ui.components.PrimaryPillButton
import com.example.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun PlayerRevealScreen(
    gameState: ActiveGameState,
    allPlayers: List<Player>,
    onDropDare: () -> Unit,
    onMenuRules: () -> Unit,
    onMenuRestart: () -> Unit,
    onMenuEndGame: () -> Unit
) {
    var showPauseMenu by remember { mutableStateOf(false) }
    var isShuffling by remember { mutableStateOf(true) }
    var displayedName by remember { mutableStateOf(gameState.currentPlayer?.name ?: "Player") }

    val activePlayer = gameState.currentPlayer
    val skipsLeft = if (activePlayer != null) {
        val s = gameState.remainingSkips[activePlayer.id] ?: 0
        if (s == Int.MAX_VALUE) "∞" else "$s"
    } else "0"

    // Snappy shuffle animation on launch
    LaunchedEffect(gameState.currentPlayer) {
        isShuffling = true
        val candidateNames = allPlayers.map { it.name }.shuffled()
        if (candidateNames.isNotEmpty()) {
            for (i in 0..6) {
                displayedName = candidateNames[i % candidateNames.size]
                com.example.audio.SoundEffects.playTick()
                delay(40L + i * 20L)
            }
        }
        displayedName = activePlayer?.name ?: "Player"
        com.example.audio.SoundEffects.playTap()
        isShuffling = false
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

    Scaffold(
        containerColor = NightBordeaux,
        topBar = {
            DareDropTopBar(
                onBackClick = null,
                onMenuClick = { showPauseMenu = true }
            )
        },
        bottomBar = {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(NightBordeaux)
                    .navigationBarsPadding()
                    .padding(horizontal = 24.dp, vertical = 20.dp)
            ) {
                PrimaryPillButton(
                    text = "DROP THE DARE ↓",
                    enabled = !isShuffling,
                    onClick = onDropDare,
                    testTag = "drop_dare_button"
                )
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Round Badge with Cool Horizon border
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(NightBordeauxElevated)
                    .border(1.dp, CoolHorizonMuted.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                Text(
                    text = if (gameState.isInfiniteRounds) {
                        "Round ${gameState.currentRound}"
                    } else {
                        "Round ${gameState.currentRound} / ${gameState.totalRounds}"
                    },
                    fontFamily = GeomFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = CoolHorizon
                )
            }

            // Central Reveal Card with Cool Horizon & Ivory Mist Palette
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.padding(vertical = 20.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    PaletteFlowerIcon(size = 22.dp, petalColor = CoolHorizon)
                    Text(
                        text = if (isShuffling) "Who's next?" else "Who's Up?",
                        fontFamily = GlutenFontFamily,
                        fontWeight = FontWeight.Normal,
                        fontSize = 26.sp,
                        color = IvoryMistMuted
                    )
                }

                // Large Avatar Circle
                Box(
                    modifier = Modifier
                        .size(116.dp)
                        .shadow(12.dp, CircleShape)
                        .clip(CircleShape)
                        .background(if (isShuffling) CoolHorizon else IvoryMist)
                        .border(3.dp, CoolHorizonGlow, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = displayedName.take(1).uppercase(),
                        fontFamily = GlutenFontFamily,
                        fontWeight = FontWeight.Bold,
                        fontSize = 50.sp,
                        color = BordeauxText
                    )
                }

                // Player name reveal
                Text(
                    text = if (isShuffling) displayedName else "${activePlayer?.name ?: "Player"}'s Turn!",
                    fontFamily = GlutenFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 36.sp,
                    color = IvoryMist,
                    textAlign = TextAlign.Center
                )

                Text(
                    text = if (isShuffling) "Shuffling players..." else "Ready to take the drop?",
                    fontFamily = GeomFontFamily,
                    fontWeight = FontWeight.Normal,
                    fontSize = 16.sp,
                    color = IvoryMistMuted,
                    textAlign = TextAlign.Center
                )

                if (!isShuffling) {
                    // Skips status chip with flower icon
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(14.dp))
                            .background(NightBordeauxElevated)
                            .border(1.dp, CoolHorizonMuted.copy(alpha = 0.4f), RoundedCornerShape(14.dp))
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "Skips left: $skipsLeft",
                            fontFamily = GeomFontFamily,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 13.sp,
                            color = CoolHorizon
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}
