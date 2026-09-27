package com.example.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
fun PaletteFlowerIcon(
    modifier: Modifier = Modifier,
    size: Dp = 32.dp,
    petalColor: Color
) {
    Canvas(modifier = modifier.size(size)) {
        val cx = this.size.width / 2f
        val cy = this.size.height / 2f
        val petalRadius = this.size.width * 0.22f
        val petalOffset = this.size.width * 0.28f

        // Center circle
        drawCircle(
            color = petalColor,
            radius = petalRadius * 0.95f,
            center = Offset(cx, cy)
        )

        // 5 circular petals
        for (i in 0 until 5) {
            val angle = Math.toRadians((i * 72.0 - 90.0))
            val px = cx + (petalOffset * Math.cos(angle)).toFloat()
            val py = cy + (petalOffset * Math.sin(angle)).toFloat()
            drawCircle(
                color = petalColor,
                radius = petalRadius,
                center = Offset(px, py)
            )
        }
    }
}
