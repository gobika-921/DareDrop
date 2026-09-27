package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.Dare
import com.example.model.Difficulty
import com.example.ui.components.DareDropTopBar
import com.example.ui.components.OutlinedPillButton
import com.example.ui.components.PaletteFlowerIcon
import com.example.ui.components.PrimaryPillButton
import com.example.ui.theme.*

@Composable
fun CustomPackScreen(
    customDares: List<Dare>,
    onAddDare: (String, Difficulty) -> Boolean,
    onDeleteDare: (String) -> Unit,
    onDone: () -> Unit
) {
    var dareText by remember { mutableStateOf("") }
    var selectedDifficulty by remember { mutableStateOf(Difficulty.MILD) }
    var inputError by remember { mutableStateOf<String?>(null) }

    Scaffold(
        containerColor = NightBordeaux,
        topBar = {
            DareDropTopBar(onBackClick = onDone)
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
                    text = "Done →",
                    onClick = onDone,
                    testTag = "custom_pack_done_button"
                )
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                PaletteFlowerIcon(size = 28.dp, petalColor = CoolHorizon)
                Text(
                    text = "Build Your Pack",
                    fontFamily = GlutenFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 32.sp,
                    color = IvoryMist
                )
            }

            Text(
                text = "Create custom dares for your group party session.",
                fontFamily = GeomFontFamily,
                fontSize = 14.sp,
                color = IvoryMistMuted
            )

            // Add Dare Box
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(22.dp))
                    .background(NightBordeauxElevated)
                    .border(1.dp, CoolHorizonMuted.copy(alpha = 0.4f), RoundedCornerShape(22.dp))
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedTextField(
                    value = dareText,
                    onValueChange = {
                        dareText = it
                        inputError = null
                    },
                    placeholder = {
                        Text(
                            text = "Enter a custom dare...",
                            fontFamily = GeomFontFamily,
                            color = IvoryMistMuted
                        )
                    },
                    shape = RoundedCornerShape(16.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = IvoryMist,
                        unfocusedTextColor = IvoryMist,
                        focusedBorderColor = CoolHorizon,
                        unfocusedBorderColor = CoolHorizonMuted.copy(alpha = 0.5f),
                        focusedContainerColor = NightBordeauxCard,
                        unfocusedContainerColor = NightBordeauxCard
                    ),
                    modifier = Modifier
                        .testTag("custom_dare_input")
                        .fillMaxWidth()
                        .height(80.dp)
                )

                // Difficulty selector pills
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Difficulty.values().forEach { diff ->
                        val isSelected = selectedDifficulty == diff
                        OutlinedPillButton(
                            text = diff.displayName,
                            isSelected = isSelected,
                            onClick = { selectedDifficulty = diff },
                            modifier = Modifier.weight(1f),
                            contentPadding = PaddingValues(horizontal = 8.dp),
                            fontSize = 14.sp,
                            testTag = "custom_diff_${diff.name.lowercase()}"
                        )
                    }
                }

                if (inputError != null) {
                    Text(
                        text = inputError ?: "",
                        fontFamily = GeomFontFamily,
                        fontSize = 12.sp,
                        color = ExtremeColor
                    )
                }

                PrimaryPillButton(
                    text = "+ Add to Pack",
                    onClick = {
                        if (dareText.trim().isEmpty()) {
                            inputError = "Dare text cannot be blank"
                        } else {
                            if (onAddDare(dareText, selectedDifficulty)) {
                                dareText = ""
                                inputError = null
                            }
                        }
                    },
                    modifier = Modifier.height(48.dp),
                    testTag = "add_dare_to_pack_button"
                )
            }

            Text(
                text = "Dares in Pack (${customDares.size})",
                fontFamily = GlutenFontFamily,
                fontWeight = FontWeight.SemiBold,
                fontSize = 18.sp,
                color = IvoryMist
            )

            // Dares List
            LazyColumn(
                modifier = Modifier
                    .testTag("custom_dares_list")
                    .weight(1f),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(customDares, key = { it.id }) { dare ->
                    val badgeColor = when (dare.difficulty) {
                        Difficulty.MILD -> CoolHorizon
                        Difficulty.SPICY -> SpicyColor
                        Difficulty.EXTREME -> ExtremeColor
                    }

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(NightBordeauxElevated)
                            .border(BorderStroke(1.dp, CoolHorizonMuted.copy(alpha = 0.4f)), RoundedCornerShape(16.dp))
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(badgeColor)
                                    .padding(horizontal = 8.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = dare.difficulty.displayName,
                                    fontFamily = GeomFontFamily,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 11.sp,
                                    color = if (dare.difficulty == Difficulty.MILD) BordeauxText else IvoryMist
                                )
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = dare.text,
                                fontFamily = GeomFontFamily,
                                fontSize = 14.sp,
                                color = IvoryMist
                            )
                        }

                        IconButton(
                            onClick = { onDeleteDare(dare.id) },
                            modifier = Modifier.size(36.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Delete,
                                contentDescription = "Delete Dare",
                                tint = CoolHorizon,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}
