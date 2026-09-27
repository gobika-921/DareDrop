package com.example.model

enum class AppScreen {
    SPLASH,
    HOME,
    SET_TONE,
    WHOS_PLAYING,
    GAME_READY,
    PLAYER_REVEAL,
    DARE_PLAY,
    GAME_COMPLETE,
    CUSTOM_PACK,
    HOW_TO_PLAY
}

data class Player(
    val id: String,
    val name: String,
    val completedCount: Int = 0,
    val skippedCount: Int = 0,
    val passedCount: Int = 0
)

data class GameStats(
    val roundsPlayed: Int = 0,
    val daresCompleted: Int = 0,
    val daresSkipped: Int = 0,
    val daresPassed: Int = 0,
    val mostDaringPlayerName: String? = null
)

data class TurnCelebration(
    val type: CelebrationType,
    val message: String
)

enum class CelebrationType {
    COMPLETED,
    SKIPPED,
    PASSED
}

data class ActiveGameState(
    val currentRound: Int = 1,
    val totalRounds: Int = 10,
    val isInfiniteRounds: Boolean = false,
    val currentPlayer: Player? = null,
    val currentDare: Dare? = null,
    val remainingSkips: Map<String, Int> = emptyMap(), // playerId -> skips left
    val usedDareIds: Set<String> = emptySet(),
    val cycleQueue: List<String> = emptyList(), // For noRepeatPlayers cycle
    val isDareRevealed: Boolean = false,
    val celebration: TurnCelebration? = null,
    val isGameOver: Boolean = false
)
