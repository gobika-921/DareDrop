package com.example.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.CoolHorizon
import com.example.ui.theme.GeomFontFamily
import com.example.ui.theme.IvoryMist
import com.example.ui.theme.IvoryMistMuted

@Composable
fun DareDropTopBar(
    onBackClick: (() -> Unit)? = null,
    onMenuClick: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        if (onBackClick != null) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .testTag("back_button")
                    .clickable(onClick = onBackClick)
                    .padding(vertical = 8.dp, horizontal = 4.dp)
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back",
                    tint = CoolHorizon,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Back",
                    fontFamily = GeomFontFamily,
                    fontWeight = FontWeight.Medium,
                    fontSize = 16.sp,
                    color = CoolHorizon
                )
            }
        } else {
            Spacer(modifier = Modifier.size(24.dp))
        }

        if (onMenuClick != null) {
            IconButton(
                onClick = onMenuClick,
                modifier = Modifier
                    .testTag("game_menu_button")
                    .size(44.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.MoreVert,
                    contentDescription = "Game Menu",
                    tint = IvoryMist,
                    modifier = Modifier.size(24.dp)
                )
            }
        } else {
            Spacer(modifier = Modifier.size(24.dp))
        }
    }
}
