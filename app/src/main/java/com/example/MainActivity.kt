package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.model.AppScreen
import com.example.ui.screens.*
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.NightBordeaux
import com.example.viewmodel.DareDropViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                DareDropApp()
            }
        }
    }
}

@Composable
fun DareDropApp(
    viewModel: DareDropViewModel = viewModel()
) {
    val currentScreen by viewModel.currentScreen.collectAsStateWithLifecycle()
    val gameConfig by viewModel.gameConfig.collectAsStateWithLifecycle()
    val players by viewModel.players.collectAsStateWithLifecycle()
    val customDares by viewModel.customDares.collectAsStateWithLifecycle()
    val gameState by viewModel.gameState.collectAsStateWithLifecycle()
    val gameStats by viewModel.gameStats.collectAsStateWithLifecycle()
    val errorMessage by viewModel.errorMessage.collectAsStateWithLifecycle()

    var showHowToPlay by remember { mutableStateOf(false) }

    // System BackHandler
    BackHandler(enabled = currentScreen != AppScreen.HOME && currentScreen != AppScreen.SPLASH) {
        when (currentScreen) {
            AppScreen.PLAYER_REVEAL, AppScreen.DARE_PLAY -> {
                // Return to home or pause rather than destructive back
                viewModel.navigateTo(AppScreen.HOME)
            }
            AppScreen.GAME_COMPLETE -> {
                viewModel.navigateTo(AppScreen.HOME)
            }
            else -> {
                if (!viewModel.navigateBack()) {
                    viewModel.navigateTo(AppScreen.HOME)
                }
            }
        }
    }

    if (showHowToPlay) {
        HowToPlayDialog(onDismiss = { showHowToPlay = false })
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(NightBordeaux)
    ) {
        when (currentScreen) {
            AppScreen.SPLASH -> {
                SplashScreen(
                    onSplashFinished = {
                        viewModel.navigateTo(AppScreen.HOME)
                    }
                )
            }

            AppScreen.HOME -> {
                HomeScreen(
                    onStartGame = { viewModel.navigateTo(AppScreen.WHOS_PLAYING) },
                    onHowToPlay = { showHowToPlay = true },
                    onCustomPack = { viewModel.navigateTo(AppScreen.CUSTOM_PACK) }
                )
            }

            AppScreen.WHOS_PLAYING -> {
                WhosPlayingScreen(
                    players = players,
                    errorMessage = errorMessage,
                    onBackClick = { viewModel.navigateBack() },
                    onAddPlayer = { viewModel.addPlayer(it) },
                    onRemovePlayer = { viewModel.removePlayer(it) },
                    onClearError = { viewModel.clearError() },
                    onNextClick = { viewModel.navigateTo(AppScreen.SET_TONE) }
                )
            }

            AppScreen.SET_TONE -> {
                SetToneScreen(
                    gameConfig = gameConfig,
                    onBackClick = { viewModel.navigateBack() },
                    onPackTypeChange = { viewModel.setPackType(it) },
                    onDifficultyToggle = { viewModel.toggleDifficulty(it) },
                    onSkipLimitChange = { viewModel.setSkipLimit(it) },
                    onRoundsChange = { viewModel.setRounds(it) },
                    onToggleNoRepeatPlayers = { viewModel.toggleNoRepeatPlayers() },
                    onToggleNoRepeatDares = { viewModel.toggleNoRepeatDares() },
                    onToggleAllowPasses = { viewModel.toggleAllowPasses() },
                    onNextClick = { viewModel.navigateTo(AppScreen.GAME_READY) },
                    onManageCustomPack = { viewModel.navigateTo(AppScreen.CUSTOM_PACK) }
                )
            }

            AppScreen.GAME_READY -> {
                GameReadyScreen(
                    players = players,
                    gameConfig = gameConfig,
                    onBackClick = { viewModel.navigateBack() },
                    onStartGame = { viewModel.startGame() }
                )
            }

            AppScreen.PLAYER_REVEAL -> {
                PlayerRevealScreen(
                    gameState = gameState,
                    allPlayers = players,
                    onDropDare = { viewModel.dropDare() },
                    onMenuRules = { showHowToPlay = true },
                    onMenuRestart = { viewModel.startGame() },
                    onMenuEndGame = { viewModel.finishGame() }
                )
            }

            AppScreen.DARE_PLAY -> {
                DarePlayScreen(
                    gameState = gameState,
                    gameConfig = gameConfig,
                    onComplete = { viewModel.completeDare() },
                    onSkip = { viewModel.skipDare() },
                    onPass = { viewModel.passDare() },
                    onNextTurn = { viewModel.advanceToNextTurn() },
                    onClearCelebration = { viewModel.clearCelebration() },
                    onMenuRules = { showHowToPlay = true },
                    onMenuRestart = { viewModel.startGame() },
                    onMenuEndGame = { viewModel.finishGame() }
                )
            }

            AppScreen.GAME_COMPLETE -> {
                GameCompleteScreen(
                    stats = gameStats,
                    players = players,
                    onPlayAgain = { viewModel.playAgain() },
                    onNewGame = { viewModel.newGame() },
                    onHome = { viewModel.goHome() }
                )
            }

            AppScreen.CUSTOM_PACK -> {
                CustomPackScreen(
                    customDares = customDares,
                    onAddDare = { text, diff -> viewModel.addCustomDare(text, diff) },
                    onDeleteDare = { viewModel.deleteCustomDare(it) },
                    onDone = { viewModel.navigateBack() }
                )
            }

            AppScreen.HOW_TO_PLAY -> {
                HowToPlayDialog(onDismiss = { viewModel.navigateBack() })
            }
        }
    }
}
