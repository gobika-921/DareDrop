package com.example.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.util.UUID

class DareDropViewModel : ViewModel() {

    private val _currentScreen = MutableStateFlow(AppScreen.SPLASH)
    val currentScreen: StateFlow<AppScreen> = _currentScreen.asStateFlow()

    private val navigationBackStack = mutableListOf<AppScreen>()

    private val _gameConfig = MutableStateFlow(GameConfig())
    val gameConfig: StateFlow<GameConfig> = _gameConfig.asStateFlow()

    private val _players = MutableStateFlow<List<Player>>(emptyList())
    val players: StateFlow<List<Player>> = _players.asStateFlow()

    private val _customDares = MutableStateFlow<List<Dare>>(
        listOf(
            Dare(
                id = "custom_001",
                text = "Do your best impression of another player until they guess who it is.",
                difficulty = Difficulty.MILD,
                pack = "custom"
            ),
            Dare(
                id = "custom_002",
                text = "Show the group the last text you sent without giving any context.",
                difficulty = Difficulty.SPICY,
                pack = "custom"
            ),
            Dare(
                id = "custom_003",
                text = "Sing everything you say with opera vibrato for the next 2 minutes.",
                difficulty = Difficulty.EXTREME,
                pack = "custom"
            )
        )
    )
    val customDares: StateFlow<List<Dare>> = _customDares.asStateFlow()

    private val _gameState = MutableStateFlow(ActiveGameState())
    val gameState: StateFlow<ActiveGameState> = _gameState.asStateFlow()

    private val _gameStats = MutableStateFlow(GameStats())
    val gameStats: StateFlow<GameStats> = _gameStats.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    // Navigation
    fun navigateTo(screen: AppScreen) {
        navigationBackStack.add(_currentScreen.value)
        _currentScreen.value = screen
    }

    fun navigateBack(): Boolean {
        if (navigationBackStack.isNotEmpty()) {
            val prev = navigationBackStack.removeAt(navigationBackStack.size - 1)
            _currentScreen.value = prev
            return true
        }
        return false
    }

    fun clearError() {
        _errorMessage.value = null
    }

    fun clearCelebration() {
        _gameState.update { it.copy(celebration = null) }
    }

    // Config adjustments
    fun setPackType(packType: DarePackType) {
        _gameConfig.update { it.copy(packType = packType) }
    }

    fun toggleDifficulty(difficulty: Difficulty) {
        _gameConfig.update { current ->
            val set = current.enabledDifficulties.toMutableSet()
            if (set.contains(difficulty)) {
                if (set.size > 1) {
                    set.remove(difficulty)
                } else {
                    _errorMessage.value = "Pick at least one difficulty."
                }
            } else {
                set.add(difficulty)
            }
            current.copy(enabledDifficulties = set)
        }
    }

    fun setSkipLimit(option: SkipLimitOption) {
        _gameConfig.update { it.copy(skipLimitOption = option) }
    }

    fun setRounds(option: RoundsOption) {
        _gameConfig.update { it.copy(roundsOption = option) }
    }

    fun toggleNoRepeatPlayers() {
        _gameConfig.update { current ->
            current.copy(rules = current.rules.copy(noRepeatPlayers = !current.rules.noRepeatPlayers))
        }
    }

    fun toggleNoRepeatDares() {
        _gameConfig.update { current ->
            current.copy(rules = current.rules.copy(noRepeatDares = !current.rules.noRepeatDares))
        }
    }

    fun toggleAllowPasses() {
        _gameConfig.update { current ->
            current.copy(rules = current.rules.copy(allowPasses = !current.rules.allowPasses))
        }
    }

    // Player management
    fun addPlayer(name: String): Boolean {
        val trimmed = name.trim()
        if (trimmed.isEmpty()) {
            _errorMessage.value = "Give your player a name first."
            return false
        }
        if (trimmed.length > 20) {
            _errorMessage.value = "Player name is too long."
            return false
        }
        if (_players.value.any { it.name.equals(trimmed, ignoreCase = true) }) {
            _errorMessage.value = "That name is already playing."
            return false
        }

        val newPlayer = Player(id = UUID.randomUUID().toString(), name = trimmed)
        _players.update { it + newPlayer }
        _errorMessage.value = null
        return true
    }

    fun removePlayer(id: String) {
        _players.update { current -> current.filterNot { it.id == id } }
    }

    // Custom dares
    fun addCustomDare(text: String, difficulty: Difficulty): Boolean {
        val trimmed = text.trim()
        if (trimmed.isEmpty()) return false
        val newDare = Dare(
            id = "custom_${System.currentTimeMillis()}",
            text = trimmed,
            difficulty = difficulty,
            pack = "custom",
            tags = listOf("custom")
        )
        _customDares.update { it + newDare }
        return true
    }

    fun deleteCustomDare(id: String) {
        _customDares.update { current -> current.filterNot { it.id == id } }
    }

    // ==================== GAMEPLAY LOGIC ====================

    fun startGame() {
        val currentPlayers = _players.value
        if (currentPlayers.size < 2) {
            _errorMessage.value = "Add at least 2 players to get started."
            return
        }

        val config = _gameConfig.value
        val initialSkips = mutableMapOf<String, Int>()
        val skipLimitVal = config.skipLimitOption.toLimitValue()
        currentPlayers.forEach { player ->
            initialSkips[player.id] = skipLimitVal
        }

        val randomizedPlayers = currentPlayers.shuffled().map { it.id }
        val firstPlayerId = randomizedPlayers.first()
        val firstPlayer = currentPlayers.first { it.id == firstPlayerId }

        val totalRounds = config.roundsOption.toTotalRounds()
        val isInfinite = config.roundsOption is RoundsOption.Infinite

        _gameState.value = ActiveGameState(
            currentRound = 1,
            totalRounds = totalRounds,
            isInfiniteRounds = isInfinite,
            currentPlayer = firstPlayer,
            currentDare = null,
            remainingSkips = initialSkips,
            usedDareIds = emptySet(),
            cycleQueue = randomizedPlayers.drop(1),
            isDareRevealed = false,
            celebration = null,
            isGameOver = false
        )

        _gameStats.value = GameStats(
            roundsPlayed = 0,
            daresCompleted = 0,
            daresSkipped = 0,
            daresPassed = 0,
            mostDaringPlayerName = null
        )

        navigationBackStack.clear()
        _currentScreen.value = AppScreen.PLAYER_REVEAL
    }

    fun dropDare() {
        val current = _gameState.value
        val config = _gameConfig.value

        val pool = if (config.packType == DarePackType.CUSTOM) {
            _customDares.value.filter { config.enabledDifficulties.contains(it.difficulty) }
        } else {
            DefaultDareRepository.defaultDares.filter { config.enabledDifficulties.contains(it.difficulty) }
        }

        val availableDares = if (config.rules.noRepeatDares) {
            pool.filterNot { current.usedDareIds.contains(it.id) }
        } else {
            pool
        }

        val selectedDare = if (availableDares.isNotEmpty()) {
            availableDares.random()
        } else if (pool.isNotEmpty()) {
            // gracefully recycle if pool exhausted
            pool.random()
        } else {
            Dare(
                id = "fallback",
                text = "Do 5 jumping jacks and invent your own secret dare!",
                difficulty = Difficulty.MILD
            )
        }

        _gameState.update {
            it.copy(
                currentDare = selectedDare,
                isDareRevealed = true,
                celebration = null
            )
        }
        _currentScreen.value = AppScreen.DARE_PLAY
    }

    fun completeDare() {
        val current = _gameState.value
        val activePlayer = current.currentPlayer ?: return
        val currentDare = current.currentDare

        // Update player stats
        _players.update { list ->
            list.map {
                if (it.id == activePlayer.id) it.copy(completedCount = it.completedCount + 1) else it
            }
        }

        _gameStats.update {
            it.copy(
                roundsPlayed = it.roundsPlayed + 1,
                daresCompleted = it.daresCompleted + 1
            )
        }

        val newUsed = if (currentDare != null && _gameConfig.value.rules.noRepeatDares) {
            current.usedDareIds + currentDare.id
        } else {
            current.usedDareIds
        }

        _gameState.update {
            it.copy(
                usedDareIds = newUsed,
                celebration = TurnCelebration(CelebrationType.COMPLETED, "Dare Completed! 🎉")
            )
        }
    }

    fun skipDare() {
        val current = _gameState.value
        val activePlayer = current.currentPlayer ?: return
        val skipsLeft = current.remainingSkips[activePlayer.id] ?: 0

        if (skipsLeft <= 0) {
            _errorMessage.value = "No skips left for ${activePlayer.name}!"
            return
        }

        val newSkips = current.remainingSkips.toMutableMap()
        if (skipsLeft != Int.MAX_VALUE) {
            newSkips[activePlayer.id] = skipsLeft - 1
        }

        _players.update { list ->
            list.map {
                if (it.id == activePlayer.id) it.copy(skippedCount = it.skippedCount + 1) else it
            }
        }

        _gameStats.update {
            it.copy(
                roundsPlayed = it.roundsPlayed + 1,
                daresSkipped = it.daresSkipped + 1
            )
        }

        val currentDare = current.currentDare
        val newUsed = if (currentDare != null && _gameConfig.value.rules.noRepeatDares) {
            current.usedDareIds + currentDare.id
        } else {
            current.usedDareIds
        }

        _gameState.update {
            it.copy(
                remainingSkips = newSkips,
                usedDareIds = newUsed,
                celebration = TurnCelebration(CelebrationType.SKIPPED, "Dare Skipped! 💨")
            )
        }
    }

    fun passDare() {
        val current = _gameState.value
        if (!_gameConfig.value.rules.allowPasses) return

        val activePlayer = current.currentPlayer ?: return

        _players.update { list ->
            list.map {
                if (it.id == activePlayer.id) it.copy(passedCount = it.passedCount + 1) else it
            }
        }

        _gameStats.update { it.copy(daresPassed = it.daresPassed + 1) }

        val currentDare = current.currentDare
        val newUsed = if (currentDare != null && _gameConfig.value.rules.noRepeatDares) {
            current.usedDareIds + currentDare.id
        } else {
            current.usedDareIds
        }

        // Generate a new dare for the same player without advancing round
        val config = _gameConfig.value
        val pool = if (config.packType == DarePackType.CUSTOM) {
            _customDares.value.filter { config.enabledDifficulties.contains(it.difficulty) }
        } else {
            DefaultDareRepository.defaultDares.filter { config.enabledDifficulties.contains(it.difficulty) }
        }

        val available = if (config.rules.noRepeatDares) {
            pool.filterNot { newUsed.contains(it.id) }
        } else {
            pool
        }

        val newDare = if (available.isNotEmpty()) available.random() else pool.randomOrNull()

        _gameState.update {
            it.copy(
                currentDare = newDare,
                usedDareIds = newUsed,
                celebration = TurnCelebration(CelebrationType.PASSED, "Passed! New dare incoming...")
            )
        }
    }

    fun advanceToNextTurn() {
        val current = _gameState.value
        val config = _gameConfig.value

        // Check if game is completed
        if (!current.isInfiniteRounds && current.currentRound >= current.totalRounds) {
            finishGame()
            return
        }

        // Determine next player
        val playerList = _players.value
        var queue = current.cycleQueue
        val nextPlayerId: String

        if (config.rules.noRepeatPlayers) {
            if (queue.isEmpty()) {
                val reshuffled = playerList.shuffled().map { it.id }
                nextPlayerId = reshuffled.first()
                queue = reshuffled.drop(1)
            } else {
                nextPlayerId = queue.first()
                queue = queue.drop(1)
            }
        } else {
            // Random player selection (avoid strictly picking the same player if >1 players)
            val others = playerList.filter { it.id != current.currentPlayer?.id }
            val chosen = if (others.isNotEmpty()) others.random() else playerList.random()
            nextPlayerId = chosen.id
        }

        val nextPlayer = playerList.firstOrNull { it.id == nextPlayerId } ?: playerList.first()

        _gameState.update {
            it.copy(
                currentRound = it.currentRound + 1,
                currentPlayer = nextPlayer,
                currentDare = null,
                cycleQueue = queue,
                isDareRevealed = false,
                celebration = null
            )
        }

        _currentScreen.value = AppScreen.PLAYER_REVEAL
    }

    fun finishGame() {
        val playerList = _players.value
        val mostDaring = playerList.maxByOrNull { it.completedCount }?.takeIf { it.completedCount > 0 }?.name
            ?: playerList.firstOrNull()?.name ?: "Everyone"

        _gameStats.update {
            it.copy(mostDaringPlayerName = mostDaring)
        }

        _gameState.update { it.copy(isGameOver = true) }
        _currentScreen.value = AppScreen.GAME_COMPLETE
    }

    fun playAgain() {
        // Reset player game counters
        _players.update { list ->
            list.map { it.copy(completedCount = 0, skippedCount = 0, passedCount = 0) }
        }
        startGame()
    }

    fun newGame() {
        _players.update { list ->
            list.map { it.copy(completedCount = 0, skippedCount = 0, passedCount = 0) }
        }
        _currentScreen.value = AppScreen.WHOS_PLAYING
    }

    fun goHome() {
        _currentScreen.value = AppScreen.HOME
    }
}
