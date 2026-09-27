package com.example.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.components.PaletteFlowerIcon
import com.example.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(
    onSplashFinished: () -> Unit
) {
    val dropTransition = remember { Animatable(-120f) }
    val logoAlpha = remember { Animatable(0f) }
    val bounceScale = remember { Animatable(0.7f) }
    val flowerRotation = remember { Animatable(0f) }

    LaunchedEffect(Unit) {
        logoAlpha.animateTo(1f, animationSpec = tween(280))
        flowerRotation.animateTo(
            targetValue = 360f,
            animationSpec = tween(700, easing = FastOutSlowInEasing)
        )
        dropTransition.animateTo(
            targetValue = 0f,
            animationSpec = spring(
                dampingRatio = Spring.DampingRatioMediumBouncy,
                stiffness = Spring.StiffnessMedium
            )
        )
        bounceScale.animateTo(
            targetValue = 1f,
            animationSpec = spring(
                dampingRatio = Spring.DampingRatioMediumBouncy,
                stiffness = Spring.StiffnessMedium
            )
        )
        delay(900)
        onSplashFinished()
    }

    Box(
        modifier = Modifier
            .testTag("splash_screen")
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(NightBordeaux, NightBordeauxDark)
                )
            )
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onSplashFinished
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier
                .alpha(logoAlpha.value)
                .graphicsLayer {
                    scaleX = bounceScale.value
                    scaleY = bounceScale.value
                }
        ) {
            // Floating Decorative Flower Badge
            Box(
                modifier = Modifier
                    .size(72.dp)
                    .clip(CircleShape)
                    .background(CoolHorizon)
                    .rotate(flowerRotation.value),
                contentAlignment = Alignment.Center
            ) {
                PaletteFlowerIcon(
                    size = 44.dp,
                    petalColor = NightBordeaux
                )
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "DareDrop",
                    fontFamily = GlutenFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 48.sp,
                    color = IvoryMist
                )

                Text(
                    text = "!",
                    fontFamily = GlutenFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 54.sp,
                    color = CoolHorizon,
                    modifier = Modifier
                        .offset(y = dropTransition.value.dp)
                        .padding(start = 4.dp)
                )
            }

            Text(
                text = "Drop the dare. Own the moment.",
                fontFamily = GeomFontFamily,
                fontWeight = FontWeight.Medium,
                fontSize = 15.sp,
                color = IvoryMistMuted
            )
        }
    }
}
