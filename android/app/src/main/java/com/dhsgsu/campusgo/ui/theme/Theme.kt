package com.dhsgsu.campusgo.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = TransportGreen,
    onPrimary = SurfaceWhite,
    primaryContainer = TransportGreenBg,
    onPrimaryContainer = TransportGreenDark,
    secondary = CharcoalDark,
    onSecondary = SurfaceWhite,
    background = OffWhiteBg,
    onBackground = TextPrimary,
    surface = SurfaceWhite,
    onSurface = TextPrimary,
    surfaceVariant = OffWhiteBg,
    onSurfaceVariant = TextSecondary,
    outline = BorderLight,
    error = LiveRed
)

private val DarkColorScheme = darkColorScheme(
    primary = TransportGreen,
    onPrimary = CharcoalDark,
    primaryContainer = TransportGreenDark,
    onPrimaryContainer = SurfaceWhite,
    secondary = SurfaceWhite,
    onSecondary = CharcoalDark,
    background = CharcoalDark,
    onBackground = OffWhiteBg,
    surface = CharcoalSurface,
    onSurface = OffWhiteBg,
    surfaceVariant = CharcoalDark,
    onSurfaceVariant = TextMuted,
    outline = BorderLight,
    error = LiveRed
)

@Composable
fun CampusGoTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.secondary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
