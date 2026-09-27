package com.example.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.rotate
import com.example.ui.theme.*
import kotlin.random.Random

private data class FlowerParticle(
    val x: Float,
    val y: Float,
    val size: Float,
    val speedY: Float,
    val speedX: Float,
    val rotation: Float,
    val rotationSpeed: Float,
    val color: Color
)

@Composable
fun CelebrationParticles(
    modifier: Modifier = Modifier
) {
    val particles = remember {
        val colors = listOf(CoolHorizon, IvoryMist, CoolHorizonGlow, SpicyColor)
        List(24) {
            FlowerParticle(
                x = Random.nextFloat(),
                y = Random.nextFloat() * -0.3f,
                size = Random.nextFloat() * 10f + 8f,
                speedY = Random.nextFloat() * 0.6f + 0.35f,
                speedX = (Random.nextFloat() - 0.5f) * 0.2f,
                rotation = Random.nextFloat() * 360f,
                rotationSpeed = (Random.nextFloat() - 0.5f) * 5f,
                color = colors.random()
            )
        }
    }

    val transition = rememberInfiniteTransition(label = "particles")
    val progress by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(2200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "particleProgress"
    )

    Canvas(modifier = modifier.fillMaxSize()) {
        val w = size.width
        val h = size.height

        particles.forEach { p ->
            val currentY = ((p.y + progress * p.speedY) % 1.15f) * h
            val currentX = ((p.x + progress * p.speedX + 1.0f) % 1.0f) * w
            val currentRotation = p.rotation + progress * p.rotationSpeed * 360f

            rotate(currentRotation, pivot = Offset(currentX, currentY)) {
                // Draw playful 5-petal flower icon inspired by the palette image!
                val petalRadius = p.size * 0.42f
                val centerOffset = p.size * 0.55f

                // Center core
                drawCircle(
                    color = p.color.copy(alpha = 0.9f),
                    radius = petalRadius * 0.95f,
                    center = Offset(currentX, currentY)
                )

                // 5 Petals
                for (i in 0 until 5) {
                    val angle = Math.toRadians((i * 72.0))
                    val px = currentX + (centerOffset * Math.cos(angle)).toFloat()
                    val py = currentY + (centerOffset * Math.sin(angle)).toFloat()
                    drawCircle(
                        color = p.color.copy(alpha = 0.85f),
                        radius = petalRadius,
                        center = Offset(px, py)
                    )
                }
            }
        }
    }
}
