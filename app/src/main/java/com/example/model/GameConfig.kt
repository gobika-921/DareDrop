package com.example.model

enum class DarePackType(val displayName: String) {
    DEFAULT("Default"),
    CUSTOM("Custom")
}

sealed class SkipLimitOption {
    object Zero : SkipLimitOption()
    object One : SkipLimitOption()
    object Two : SkipLimitOption()
    object Three : SkipLimitOption()
    object Infinite : SkipLimitOption()
    data class Custom(val count: Int) : SkipLimitOption()

    fun toDisplayString(): String = when (this) {
        is Zero -> "0"
        is One -> "1"
        is Two -> "2"
        is Three -> "3"
        is Infinite -> "∞"
        is Custom -> "$count"
    }

    fun toLimitValue(): Int = when (this) {
        is Zero -> 0
        is One -> 1
        is Two -> 2
        is Three -> 3
        is Infinite -> Int.MAX_VALUE
        is Custom -> count
    }
}

sealed class RoundsOption {
    object Ten : RoundsOption()
    object Twenty : RoundsOption()
    object Thirty : RoundsOption()
    object Fifty : RoundsOption()
    object Infinite : RoundsOption()
    data class Custom(val count: Int) : RoundsOption()

    fun toDisplayString(): String = when (this) {
        is Ten -> "10"
        is Twenty -> "20"
        is Thirty -> "30"
        is Fifty -> "50"
        is Infinite -> "∞"
        is Custom -> "$count"
    }

    fun toTotalRounds(): Int = when (this) {
        is Ten -> 10
        is Twenty -> 20
        is Thirty -> 30
        is Fifty -> 50
        is Infinite -> Int.MAX_VALUE
        is Custom -> count
    }
}

data class GameRules(
    val noRepeatPlayers: Boolean = true,
    val noRepeatDares: Boolean = true,
    val allowPasses: Boolean = false
)

data class GameConfig(
    val packType: DarePackType = DarePackType.DEFAULT,
    val enabledDifficulties: Set<Difficulty> = setOf(Difficulty.MILD),
    val skipLimitOption: SkipLimitOption = SkipLimitOption.Zero,
    val roundsOption: RoundsOption = RoundsOption.Ten,
    val rules: GameRules = GameRules(
        noRepeatPlayers = true,
        noRepeatDares = true,
        allowPasses = false
    )
) {
    val isValid: Boolean
        get() = enabledDifficulties.isNotEmpty()
}
