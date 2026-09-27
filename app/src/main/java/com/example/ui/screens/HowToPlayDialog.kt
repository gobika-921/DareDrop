package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.ui.components.PaletteFlowerIcon
import com.example.ui.components.PrimaryPillButton
import com.example.ui.theme.*

@Composable
fun HowToPlayDialog(
    onDismiss: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Box(
            modifier = Modifier
                .testTag("how_to_play_dialog")
                .fillMaxWidth(0.92f)
                .clip(RoundedCornerShape(26.dp))
                .background(NightBordeauxElevated)
                .border(1.5.dp, CoolHorizonMuted.copy(alpha = 0.5f), RoundedCornerShape(26.dp))
                .padding(24.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                PaletteFlowerIcon(size = 36.dp, petalColor = CoolHorizon)

                Text(
                    text = "How to Play",
                    fontFamily = GlutenFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 24.sp,
                    color = IvoryMist,
                    textAlign = TextAlign.Center
                )

                Text(
                    text = "Pass the phone around and brace for the drops!",
                    fontFamily = GeomFontFamily,
                    fontSize = 14.sp,
                    color = IvoryMistMuted,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(4.dp))

                StepRow(
                    stepNumber = "1",
                    title = "Add Players",
                    description = "Add everyone playing together in the room."
                )

                StepRow(
                    stepNumber = "2",
                    title = "Set the Tone",
                    description = "Choose difficulty (Mild, Spicy, Extreme), rounds, skips, and rules."
                )

                StepRow(
                    stepNumber = "3",
                    title = "Drop the Dare",
                    description = "A player is selected, anticipation builds, and their dare drops down!"
                )

                StepRow(
                    stepNumber = "4",
                    title = "Complete, Skip or Pass",
                    description = "Complete the dare to score, use a skip if you dare not, or pass if enabled."
                )

                Spacer(modifier = Modifier.height(8.dp))

                PrimaryPillButton(
                    text = "Got It! Let's Play",
                    onClick = onDismiss,
                    testTag = "how_to_play_got_it"
                )
            }
        }
    }
}

@Composable
private fun StepRow(
    stepNumber: String,
    title: String,
    description: String
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(14.dp),
        verticalAlignment = Alignment.Top
    ) {
        Box(
            modifier = Modifier
                .size(32.dp)
                .clip(CircleShape)
                .background(CoolHorizon),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = stepNumber,
                fontFamily = GlutenFontFamily,
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                color = BordeauxText
            )
        }

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontFamily = GeomFontFamily,
                fontWeight = FontWeight.SemiBold,
                fontSize = 16.sp,
                color = IvoryMist
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = description,
                fontFamily = GeomFontFamily,
                fontWeight = FontWeight.Normal,
                fontSize = 13.sp,
                color = IvoryMistMuted
            )
        }
    }
}
