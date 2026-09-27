package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import com.example.model.*
import com.example.ui.components.*
import com.example.ui.theme.*

@Composable
fun SetToneScreen(
    gameConfig: GameConfig,
    onBackClick: () -> Unit,
    onPackTypeChange: (DarePackType) -> Unit,
    onDifficultyToggle: (Difficulty) -> Unit,
    onSkipLimitChange: (SkipLimitOption) -> Unit,
    onRoundsChange: (RoundsOption) -> Unit,
    onToggleNoRepeatPlayers: () -> Unit,
    onToggleNoRepeatDares: () -> Unit,
    onToggleAllowPasses: () -> Unit,
    onNextClick: () -> Unit,
    onManageCustomPack: () -> Unit
) {
    var showCustomSkipsDialog by remember { mutableStateOf(false) }
    var showCustomRoundsDialog by remember { mutableStateOf(false) }

    val scrollState = rememberScrollState()

    if (showCustomSkipsDialog) {
        CustomNumberDialog(
            title = "Custom Skip Limit",
            initialValue = if (gameConfig.skipLimitOption is SkipLimitOption.Custom) {
                gameConfig.skipLimitOption.count
            } else 4,
            minValue = 0,
            maxValue = 99,
            onConfirm = { count ->
                onSkipLimitChange(SkipLimitOption.Custom(count))
                showCustomSkipsDialog = false
            },
            onDismiss = { showCustomSkipsDialog = false }
        )
    }

    if (showCustomRoundsDialog) {
        CustomNumberDialog(
            title = "Custom Rounds",
            initialValue = if (gameConfig.roundsOption is RoundsOption.Custom) {
                gameConfig.roundsOption.count
            } else 25,
            minValue = 1,
            maxValue = 200,
            onConfirm = { count ->
                onRoundsChange(RoundsOption.Custom(count))
                showCustomRoundsDialog = false
            },
            onDismiss = { showCustomRoundsDialog = false }
        )
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
                    enabled = gameConfig.isValid,
                    onClick = onNextClick,
                    testTag = "set_tone_next_button"
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
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            // Heading
            Text(
                text = "Set the Tone",
                fontFamily = GlutenFontFamily,
                fontWeight = FontWeight.Bold,
                fontSize = 32.sp,
                color = IvoryMist
            )

            // Section 1: Dare Pack
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "Dare Pack",
                    fontFamily = GlutenFontFamily,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 18.sp,
                    color = IvoryMist
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    OutlinedPillButton(
                        text = "Default",
                        isSelected = gameConfig.packType == DarePackType.DEFAULT,
                        onClick = { onPackTypeChange(DarePackType.DEFAULT) },
                        modifier = Modifier.weight(1f),
                        testTag = "pack_default_button"
                    )

                    OutlinedPillButton(
                        text = "Custom",
                        isSelected = gameConfig.packType == DarePackType.CUSTOM,
                        onClick = {
                            onPackTypeChange(DarePackType.CUSTOM)
                            onManageCustomPack()
                        },
                        modifier = Modifier.weight(1f),
                        testTag = "pack_custom_button"
                    )
                }
            }

            HorizontalDivider(color = CoolHorizonMuted.copy(alpha = 0.3f), thickness = 1.dp)

            // Section 2: Difficulty Level Card (Ivory Mist background with Bordeaux text)
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    PaletteFlowerIcon(size = 20.dp, petalColor = CoolHorizon)
                    Text(
                        text = "Difficulty Level",
                        fontFamily = GlutenFontFamily,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 18.sp,
                        color = IvoryMist
                    )
                }

                // Ivory Mist Card Container
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(24.dp))
                        .background(IvoryMist)
                        .padding(horizontal = 20.dp, vertical = 8.dp)
                ) {
                    // Mild
                    SettingToggleRow(
                        title = "Mild",
                        subtitle = "Safe, fun and friendly",
                        checked = gameConfig.enabledDifficulties.contains(Difficulty.MILD),
                        onCheckedChange = { onDifficultyToggle(Difficulty.MILD) },
                        testTag = "difficulty_mild_switch"
                    )

                    HorizontalDivider(color = IvoryMistDivider, thickness = 1.dp)

                    // Spicy
                    SettingToggleRow(
                        title = "Spicy",
                        subtitle = "Things get a little awkward",
                        checked = gameConfig.enabledDifficulties.contains(Difficulty.SPICY),
                        onCheckedChange = { onDifficultyToggle(Difficulty.SPICY) },
                        testTag = "difficulty_spicy_switch"
                    )

                    HorizontalDivider(color = IvoryMistDivider, thickness = 1.dp)

                    // Extreme
                    SettingToggleRow(
                        title = "Extreme",
                        subtitle = "Not for the faint-hearted",
                        checked = gameConfig.enabledDifficulties.contains(Difficulty.EXTREME),
                        onCheckedChange = { onDifficultyToggle(Difficulty.EXTREME) },
                        testTag = "difficulty_extreme_switch"
                    )
                }
            }

            HorizontalDivider(color = CoolHorizonMuted.copy(alpha = 0.3f), thickness = 1.dp)

            // Section 3: Skip Limit
            Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Text(
                    text = "Skip Limit",
                    fontFamily = GlutenFontFamily,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 18.sp,
                    color = IvoryMist
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OptionCircleButton(
                        text = "0",
                        isSelected = gameConfig.skipLimitOption is SkipLimitOption.Zero,
                        onClick = { onSkipLimitChange(SkipLimitOption.Zero) },
                        testTag = "skip_0"
                    )
                    OptionCircleButton(
                        text = "1",
                        isSelected = gameConfig.skipLimitOption is SkipLimitOption.One,
                        onClick = { onSkipLimitChange(SkipLimitOption.One) },
                        testTag = "skip_1"
                    )
                    OptionCircleButton(
                        text = "2",
                        isSelected = gameConfig.skipLimitOption is SkipLimitOption.Two,
                        onClick = { onSkipLimitChange(SkipLimitOption.Two) },
                        testTag = "skip_2"
                    )
                    OptionCircleButton(
                        text = "3",
                        isSelected = gameConfig.skipLimitOption is SkipLimitOption.Three,
                        onClick = { onSkipLimitChange(SkipLimitOption.Three) },
                        testTag = "skip_3"
                    )
                    OptionCircleButton(
                        text = "∞",
                        isSelected = gameConfig.skipLimitOption is SkipLimitOption.Infinite,
                        onClick = { onSkipLimitChange(SkipLimitOption.Infinite) },
                        testTag = "skip_inf"
                    )
                }

                val isCustomSkip = gameConfig.skipLimitOption is SkipLimitOption.Custom
                val customSkipLabel = if (isCustomSkip) {
                    "Custom: ${(gameConfig.skipLimitOption as SkipLimitOption.Custom).count}"
                } else "Custom"

                CustomOptionPillButton(
                    label = customSkipLabel,
                    isSelected = isCustomSkip,
                    onClick = { showCustomSkipsDialog = true },
                    testTag = "skip_custom_button"
                )
            }

            HorizontalDivider(color = CoolHorizonMuted.copy(alpha = 0.3f), thickness = 1.dp)

            // Section 4: Rounds
            Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Text(
                    text = "Rounds",
                    fontFamily = GlutenFontFamily,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 18.sp,
                    color = IvoryMist
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OptionCircleButton(
                        text = "10",
                        isSelected = gameConfig.roundsOption is RoundsOption.Ten,
                        onClick = { onRoundsChange(RoundsOption.Ten) },
                        testTag = "rounds_10"
                    )
                    OptionCircleButton(
                        text = "20",
                        isSelected = gameConfig.roundsOption is RoundsOption.Twenty,
                        onClick = { onRoundsChange(RoundsOption.Twenty) },
                        testTag = "rounds_20"
                    )
                    OptionCircleButton(
                        text = "30",
                        isSelected = gameConfig.roundsOption is RoundsOption.Thirty,
                        onClick = { onRoundsChange(RoundsOption.Thirty) },
                        testTag = "rounds_30"
                    )
                    OptionCircleButton(
                        text = "50",
                        isSelected = gameConfig.roundsOption is RoundsOption.Fifty,
                        onClick = { onRoundsChange(RoundsOption.Fifty) },
                        testTag = "rounds_50"
                    )
                    OptionCircleButton(
                        text = "∞",
                        isSelected = gameConfig.roundsOption is RoundsOption.Infinite,
                        onClick = { onRoundsChange(RoundsOption.Infinite) },
                        testTag = "rounds_inf"
                    )
                }

                val isCustomRounds = gameConfig.roundsOption is RoundsOption.Custom
                val customRoundsLabel = if (isCustomRounds) {
                    "Custom: ${(gameConfig.roundsOption as RoundsOption.Custom).count}"
                } else "Custom"

                CustomOptionPillButton(
                    label = customRoundsLabel,
                    isSelected = isCustomRounds,
                    onClick = { showCustomRoundsDialog = true },
                    testTag = "rounds_custom_button"
                )
            }

            HorizontalDivider(color = CoolHorizonMuted.copy(alpha = 0.3f), thickness = 1.dp)

            // Section 5: Rules Card
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "Rules",
                    fontFamily = GlutenFontFamily,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 18.sp,
                    color = IvoryMist
                )

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(24.dp))
                        .background(IvoryMist)
                        .padding(horizontal = 20.dp, vertical = 8.dp)
                ) {
                    SettingToggleRow(
                        title = "No Repeat Players",
                        subtitle = "Cycles through all players",
                        checked = gameConfig.rules.noRepeatPlayers,
                        onCheckedChange = { onToggleNoRepeatPlayers() },
                        testTag = "rule_no_repeat_players_switch"
                    )

                    HorizontalDivider(color = IvoryMistDivider, thickness = 1.dp)

                    SettingToggleRow(
                        title = "No Repeat Dares",
                        subtitle = "Each dare plays only one per session",
                        checked = gameConfig.rules.noRepeatDares,
                        onCheckedChange = { onToggleNoRepeatDares() },
                        testTag = "rule_no_repeat_dares_switch"
                    )

                    HorizontalDivider(color = IvoryMistDivider, thickness = 1.dp)

                    SettingToggleRow(
                        title = "Allow Passes",
                        subtitle = "Can refuse a dare without using skip",
                        checked = gameConfig.rules.allowPasses,
                        onCheckedChange = { onToggleAllowPasses() },
                        testTag = "rule_allow_passes_switch"
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
private fun SettingToggleRow(
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    testTag: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontFamily = GeomFontFamily,
                fontWeight = FontWeight.SemiBold,
                fontSize = 16.sp,
                color = BordeauxText
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = subtitle,
                fontFamily = GeomFontFamily,
                fontWeight = FontWeight.Normal,
                fontSize = 13.sp,
                color = BordeauxTextMuted
            )
        }

        Spacer(modifier = Modifier.width(12.dp))

        DareDropSwitch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            modifier = Modifier.testTag(testTag)
        )
    }
}
