package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.scaleIn
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.Player
import com.example.ui.components.DareDropTopBar
import com.example.ui.components.PaletteFlowerIcon
import com.example.ui.components.PrimaryPillButton
import com.example.ui.theme.*

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun WhosPlayingScreen(
    players: List<Player>,
    errorMessage: String?,
    onBackClick: () -> Unit,
    onAddPlayer: (String) -> Boolean,
    onRemovePlayer: (String) -> Unit,
    onClearError: () -> Unit,
    onNextClick: () -> Unit
) {
    var nameInput by remember { mutableStateOf("") }
    val scrollState = rememberScrollState()

    fun submitPlayer() {
        if (onAddPlayer(nameInput)) {
            com.example.audio.SoundEffects.playAddPlayer()
            nameInput = ""
        } else {
            com.example.audio.SoundEffects.playTap()
        }
    }

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
                    text = "Next >",
                    enabled = players.size >= 2,
                    onClick = onNextClick,
                    testTag = "whos_playing_next_button"
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
            verticalArrangement = Arrangement.spacedBy(18.dp)
        ) {
            // Heading with Palette Flower Icon
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                PaletteFlowerIcon(size = 30.dp, petalColor = CoolHorizon)

                Text(
                    text = "Who's Playing?",
                    fontFamily = GlutenFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 32.sp,
                    color = IvoryMist
                )
            }

            Text(
                text = "Add at least 2 players to get started.",
                fontFamily = GeomFontFamily,
                fontWeight = FontWeight.Normal,
                fontSize = 15.sp,
                color = IvoryMistMuted
            )

            // Input Row styled with Ivory Mist container & Cool Horizon add button
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedTextField(
                    value = nameInput,
                    onValueChange = {
                        nameInput = it
                        if (errorMessage != null) onClearError()
                    },
                    placeholder = {
                        Text(
                            text = "Enter player names",
                            fontFamily = GeomFontFamily,
                            color = BordeauxTextMuted,
                            fontSize = 15.sp
                        )
                    },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        capitalization = KeyboardCapitalization.Words,
                        imeAction = ImeAction.Done
                    ),
                    keyboardActions = KeyboardActions(
                        onDone = { submitPlayer() }
                    ),
                    shape = RoundedCornerShape(26.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = BordeauxText,
                        unfocusedTextColor = BordeauxText,
                        focusedContainerColor = IvoryMist,
                        unfocusedContainerColor = IvoryMist,
                        focusedBorderColor = Color.Transparent,
                        unfocusedBorderColor = Color.Transparent
                    ),
                    modifier = Modifier
                        .testTag("player_name_input")
                        .weight(1f)
                        .height(54.dp)
                )

                // Plus button with tactile pop
                Box(
                    modifier = Modifier
                        .testTag("add_player_button")
                        .size(54.dp)
                        .shadow(6.dp, CircleShape)
                        .clip(CircleShape)
                        .background(CoolHorizon)
                        .clickable { submitPlayer() },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = "Add Player",
                        tint = BordeauxText,
                        modifier = Modifier.size(28.dp)
                    )
                }
            }

            // Error or status indicator
            if (errorMessage != null) {
                Text(
                    text = errorMessage,
                    fontFamily = GeomFontFamily,
                    fontWeight = FontWeight.Medium,
                    fontSize = 13.sp,
                    color = ExtremeColor,
                    modifier = Modifier.testTag("player_error_text")
                )
            } else if (players.size == 1) {
                Text(
                    text = "Add 1 more player to continue",
                    fontFamily = GeomFontFamily,
                    fontWeight = FontWeight.Normal,
                    fontSize = 14.sp,
                    color = CoolHorizon,
                    modifier = Modifier.testTag("player_hint_text")
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            // Player chips
            FlowRow(
                modifier = Modifier
                    .testTag("player_chips_container")
                    .fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                players.forEach { player ->
                    AnimatedVisibility(
                        visible = true,
                        enter = scaleIn() + fadeIn()
                    ) {
                        PlayerChip(
                            name = player.name,
                            onRemove = { onRemovePlayer(player.id) },
                            testTag = "player_chip_${player.name}"
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun PlayerChip(
    name: String,
    onRemove: () -> Unit,
    testTag: String
) {
    Row(
        modifier = Modifier
            .testTag(testTag)
            .height(42.dp)
            .clip(RoundedCornerShape(21.dp))
            .background(NightBordeauxElevated)
            .border(BorderStroke(1.2.dp, CoolHorizonMuted.copy(alpha = 0.7f)), RoundedCornerShape(21.dp))
            .padding(start = 16.dp, end = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        PaletteFlowerIcon(size = 14.dp, petalColor = CoolHorizon)

        Text(
            text = name,
            fontFamily = GeomFontFamily,
            fontWeight = FontWeight.SemiBold,
            fontSize = 15.sp,
            color = IvoryMist
        )

        Icon(
            imageVector = Icons.Default.Close,
            contentDescription = "Remove $name",
            tint = CoolHorizonGlow,
            modifier = Modifier
                .size(16.dp)
                .clickable(onClick = onRemove)
        )
    }
}
