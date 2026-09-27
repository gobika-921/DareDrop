package com.example.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*

@Composable
fun PrimaryPillButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    testTag: String = "primary_button"
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(targetValue = if (isPressed) 0.96f else 1f, label = "buttonScale")

    val bgColor = if (enabled) IvoryMist else NightBordeauxElevated
    val textColor = if (enabled) BordeauxText else IvoryMistMuted.copy(alpha = 0.4f)

    Box(
        modifier = modifier
            .testTag(testTag)
            .scale(scale)
            .fillMaxWidth()
            .height(56.dp)
            .shadow(
                elevation = if (enabled) 8.dp else 0.dp,
                shape = RoundedCornerShape(28.dp),
                ambientColor = Color.Black,
                spotColor = Color.Black
            )
            .clip(RoundedCornerShape(28.dp))
            .background(bgColor)
            .clickable(
                enabled = enabled,
                interactionSource = interactionSource,
                indication = null,
                onClick = {
                    com.example.audio.SoundEffects.playTap()
                    onClick()
                }
            ),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            fontFamily = GeomFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 17.sp,
            color = textColor,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
fun OutlinedPillButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isSelected: Boolean = false,
    contentPadding: PaddingValues = PaddingValues(horizontal = 24.dp),
    fontSize: androidx.compose.ui.unit.TextUnit = 15.sp,
    testTag: String = "outlined_pill_button"
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(targetValue = if (isPressed) 0.95f else 1f, label = "pillScale")

    val bgColor = if (isSelected) IvoryMist else Color.Transparent
    val textColor = if (isSelected) BordeauxText else IvoryMist
    val borderStroke = if (isSelected) null else BorderStroke(1.5.dp, CoolHorizonMuted.copy(alpha = 0.6f))

    Box(
        modifier = modifier
            .testTag(testTag)
            .scale(scale)
            .height(48.dp)
            .clip(RoundedCornerShape(24.dp))
            .then(if (borderStroke != null) Modifier.border(borderStroke, RoundedCornerShape(24.dp)) else Modifier)
            .background(bgColor)
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = {
                    com.example.audio.SoundEffects.playTap()
                    onClick()
                }
            )
            .padding(contentPadding),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            fontFamily = GeomFontFamily,
            fontWeight = FontWeight.SemiBold,
            fontSize = fontSize,
            color = textColor,
            textAlign = TextAlign.Center,
            maxLines = 1,
            softWrap = false
        )
    }
}

@Composable
fun OptionCircleButton(
    text: String,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    testTag: String = "option_circle"
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(targetValue = if (isPressed) 0.92f else 1f, label = "circleScale")

    val bgColor = if (isSelected) IvoryMist else Color.Transparent
    val textColor = if (isSelected) BordeauxText else IvoryMist
    val borderStroke = if (isSelected) null else BorderStroke(1.5.dp, CoolHorizonMuted.copy(alpha = 0.5f))

    Box(
        modifier = modifier
            .testTag(testTag)
            .scale(scale)
            .size(50.dp)
            .clip(CircleShape)
            .then(if (borderStroke != null) Modifier.border(borderStroke, CircleShape) else Modifier)
            .background(bgColor)
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = {
                    com.example.audio.SoundEffects.playTap()
                    onClick()
                }
            ),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            fontFamily = GeomFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = textColor
        )
    }
}

@Composable
fun CustomOptionPillButton(
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    testTag: String = "custom_option_pill"
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(targetValue = if (isPressed) 0.96f else 1f, label = "customPillScale")

    val bgColor = if (isSelected) IvoryMist else Color.Transparent
    val textColor = if (isSelected) BordeauxText else IvoryMist
    val borderStroke = if (isSelected) null else BorderStroke(1.5.dp, CoolHorizonMuted.copy(alpha = 0.5f))

    Box(
        modifier = modifier
            .testTag(testTag)
            .scale(scale)
            .height(44.dp)
            .clip(RoundedCornerShape(22.dp))
            .then(if (borderStroke != null) Modifier.border(borderStroke, RoundedCornerShape(22.dp)) else Modifier)
            .background(bgColor)
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = {
                    com.example.audio.SoundEffects.playTap()
                    onClick()
                }
            )
            .padding(horizontal = 22.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            fontFamily = GeomFontFamily,
            fontWeight = FontWeight.SemiBold,
            fontSize = 14.sp,
            color = textColor
        )
    }
}

@Composable
fun DareDropSwitch(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier
) {
    Switch(
        checked = checked,
        onCheckedChange = onCheckedChange,
        modifier = modifier,
        colors = SwitchDefaults.colors(
            checkedThumbColor = ToggleThumbActive,
            checkedTrackColor = ToggleTrackActive,
            checkedBorderColor = Color.Transparent,
            uncheckedThumbColor = ToggleThumbInactive,
            uncheckedTrackColor = ToggleTrackInactive,
            uncheckedBorderColor = Color.Transparent
        )
    )
}
