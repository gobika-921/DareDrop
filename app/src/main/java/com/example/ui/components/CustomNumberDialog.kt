package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.ui.theme.*

@Composable
fun CustomNumberDialog(
    title: String,
    initialValue: Int = 5,
    minValue: Int = 1,
    maxValue: Int = 100,
    onConfirm: (Int) -> Unit,
    onDismiss: () -> Unit
) {
    var textValue by remember { mutableStateOf(initialValue.toString()) }
    var error by remember { mutableStateOf<String?>(null) }

    Dialog(onDismissRequest = onDismiss) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.85f)
                .clip(RoundedCornerShape(24.dp))
                .background(NightBordeauxElevated)
                .border(1.5.dp, CoolHorizonMuted.copy(alpha = 0.5f), RoundedCornerShape(24.dp))
                .padding(24.dp)
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                PaletteFlowerIcon(size = 28.dp, petalColor = CoolHorizon)

                Text(
                    text = title,
                    fontFamily = GlutenFontFamily,
                    fontSize = 20.sp,
                    color = IvoryMist,
                    textAlign = TextAlign.Center
                )

                OutlinedTextField(
                    value = textValue,
                    onValueChange = {
                        textValue = it.filter { ch -> ch.isDigit() }
                        error = null
                    },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier
                        .testTag("custom_number_input")
                        .fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = IvoryMist,
                        unfocusedTextColor = IvoryMist,
                        focusedBorderColor = CoolHorizon,
                        unfocusedBorderColor = CoolHorizonMuted.copy(alpha = 0.5f),
                        focusedContainerColor = NightBordeauxCard,
                        unfocusedContainerColor = NightBordeauxCard
                    )
                )

                if (error != null) {
                    Text(
                        text = error ?: "",
                        fontFamily = GeomFontFamily,
                        fontSize = 12.sp,
                        color = ExtremeColor,
                        textAlign = TextAlign.Center
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedPillButton(
                        text = "Cancel",
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        testTag = "custom_cancel_button"
                    )

                    PrimaryPillButton(
                        text = "Save",
                        onClick = {
                            val parsed = textValue.toIntOrNull()
                            if (parsed == null || parsed < minValue || parsed > maxValue) {
                                error = "Enter a number between $minValue and $maxValue"
                            } else {
                                onConfirm(parsed)
                            }
                        },
                        modifier = Modifier.weight(1f),
                        testTag = "custom_save_button"
                    )
                }
            }
        }
    }
}
