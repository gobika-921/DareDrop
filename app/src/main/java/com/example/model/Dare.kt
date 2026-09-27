package com.example.model

enum class Difficulty(val displayName: String, val tagline: String) {
    MILD("Mild", "Safe, fun and friendly"),
    SPICY("Spicy", "Things get a little awkward"),
    EXTREME("Extreme", "Not for the faint-hearted")
}

data class Dare(
    val id: String,
    val text: String,
    val difficulty: Difficulty,
    val pack: String = "default",
    val tags: List<String> = emptyList()
)

object DefaultDareRepository {
    val defaultDares: List<Dare> = listOf(
        // ==================== MILD (20 dares) ====================
        Dare(
            id = "mild_001",
            text = "Do your best animal impression for 20 seconds.",
            difficulty = Difficulty.MILD,
            tags = listOf("funny", "performance")
        ),
        Dare(
            id = "mild_002",
            text = "Speak in an accent chosen by the group until your next turn.",
            difficulty = Difficulty.MILD,
            tags = listOf("accent", "social")
        ),
        Dare(
            id = "mild_003",
            text = "Sing the chorus of a song dramatically.",
            difficulty = Difficulty.MILD,
            tags = listOf("singing", "performance")
        ),
        Dare(
            id = "mild_004",
            text = "Do your funniest dance move for 15 seconds.",
            difficulty = Difficulty.MILD,
            tags = listOf("dance", "physical")
        ),
        Dare(
            id = "mild_005",
            text = "Try to make everyone laugh without touching anyone.",
            difficulty = Difficulty.MILD,
            tags = listOf("humor", "challenge")
        ),
        Dare(
            id = "mild_006",
            text = "Pretend you're a famous celebrity accepting an award.",
            difficulty = Difficulty.MILD,
            tags = listOf("acting", "funny")
        ),
        Dare(
            id = "mild_007",
            text = "Let the group give you a ridiculous nickname for the next round.",
            difficulty = Difficulty.MILD,
            tags = listOf("nickname", "group")
        ),
        Dare(
            id = "mild_008",
            text = "Balance an object on your head for 15 seconds.",
            difficulty = Difficulty.MILD,
            tags = listOf("balance", "physical")
        ),
        Dare(
            id = "mild_009",
            text = "Talk like a robot until your next turn.",
            difficulty = Difficulty.MILD,
            tags = listOf("voice", "quirky")
        ),
        Dare(
            id = "mild_010",
            text = "Recreate your favorite movie scene with no words.",
            difficulty = Difficulty.MILD,
            tags = listOf("charades", "acting")
        ),
        Dare(
            id = "mild_011",
            text = "Do 10 jumping jacks while counting backwards.",
            difficulty = Difficulty.MILD,
            tags = listOf("exercise", "fun")
        ),
        Dare(
            id = "mild_012",
            text = "Make the funniest face you can and hold it for 10 seconds.",
            difficulty = Difficulty.MILD,
            tags = listOf("faces", "silly")
        ),
        Dare(
            id = "mild_013",
            text = "Explain how to make tea like you're giving a TED Talk.",
            difficulty = Difficulty.MILD,
            tags = listOf("speech", "humor")
        ),
        Dare(
            id = "mild_014",
            text = "Act like a baby asking for candy for 20 seconds.",
            difficulty = Difficulty.MILD,
            tags = listOf("acting", "silly")
        ),
        Dare(
            id = "mild_015",
            text = "Let another player choose a word you must use in every sentence until your next turn.",
            difficulty = Difficulty.MILD,
            tags = listOf("wordplay", "challenge")
        ),
        Dare(
            id = "mild_016",
            text = "Try to lick your elbow.",
            difficulty = Difficulty.MILD,
            tags = listOf("classic", "physical")
        ),
        Dare(
            id = "mild_017",
            text = "Do an imaginary fashion runway walk.",
            difficulty = Difficulty.MILD,
            tags = listOf("modeling", "funny")
        ),
        Dare(
            id = "mild_018",
            text = "Speak only in questions for the next round.",
            difficulty = Difficulty.MILD,
            tags = listOf("talking", "brain")
        ),
        Dare(
            id = "mild_019",
            text = "Pretend the floor is lava for 30 seconds.",
            difficulty = Difficulty.MILD,
            tags = listOf("energy", "game")
        ),
        Dare(
            id = "mild_020",
            text = "Give everyone in the group a dramatic superhero name.",
            difficulty = Difficulty.MILD,
            tags = listOf("creative", "group")
        ),

        // ==================== SPICY (20 dares) ====================
        Dare(
            id = "spicy_001",
            text = "Let the group choose a contact and send them a funny emoji.",
            difficulty = Difficulty.SPICY,
            tags = listOf("phone", "messaging")
        ),
        Dare(
            id = "spicy_002",
            text = "Show the last photo you took.",
            difficulty = Difficulty.SPICY,
            tags = listOf("camera", "reveal")
        ),
        Dare(
            id = "spicy_003",
            text = "Read your most recently used emoji out loud and explain why.",
            difficulty = Difficulty.SPICY,
            tags = listOf("phone", "confession")
        ),
        Dare(
            id = "spicy_004",
            text = "Let another player post a harmless caption on your social media draft—don't publish it unless you approve.",
            difficulty = Difficulty.SPICY,
            tags = listOf("social", "caption")
        ),
        Dare(
            id = "spicy_005",
            text = "Call someone and speak in a dramatic movie voice for 20 seconds.",
            difficulty = Difficulty.SPICY,
            tags = listOf("call", "drama")
        ),
        Dare(
            id = "spicy_006",
            text = "Reveal the most embarrassing song currently in your playlist.",
            difficulty = Difficulty.SPICY,
            tags = listOf("music", "taste")
        ),
        Dare(
            id = "spicy_007",
            text = "Let the person on your left ask you one awkward question.",
            difficulty = Difficulty.SPICY,
            tags = listOf("qa", "awkward")
        ),
        Dare(
            id = "spicy_008",
            text = "Show your screen time for today.",
            difficulty = Difficulty.SPICY,
            tags = listOf("phone", "screen")
        ),
        Dare(
            id = "spicy_009",
            text = "Recreate your most-used selfie pose.",
            difficulty = Difficulty.SPICY,
            tags = listOf("photo", "pose")
        ),
        Dare(
            id = "spicy_010",
            text = "Tell the group about your most embarrassing school or college moment.",
            difficulty = Difficulty.SPICY,
            tags = listOf("story", "cringe")
        ),
        Dare(
            id = "spicy_011",
            text = "Let the group choose a temporary nickname for you.",
            difficulty = Difficulty.SPICY,
            tags = listOf("nickname", "group")
        ),
        Dare(
            id = "spicy_012",
            text = "Send a voice note saying \"I have something important to tell you...\" then wait 10 seconds before revealing it was a joke.",
            difficulty = Difficulty.SPICY,
            tags = listOf("audio", "prank")
        ),
        Dare(
            id = "spicy_013",
            text = "Act out how you behave when you have a crush.",
            difficulty = Difficulty.SPICY,
            tags = listOf("romance", "acting")
        ),
        Dare(
            id = "spicy_014",
            text = "Let another player scroll through your music playlist for 10 seconds.",
            difficulty = Difficulty.SPICY,
            tags = listOf("music", "phone")
        ),
        Dare(
            id = "spicy_015",
            text = "Read the last three things you searched online, excluding anything private.",
            difficulty = Difficulty.SPICY,
            tags = listOf("search", "history")
        ),
        Dare(
            id = "spicy_016",
            text = "Swap phones with another player and let them choose your wallpaper for five minutes.",
            difficulty = Difficulty.SPICY,
            tags = listOf("wallpaper", "phone")
        ),
        Dare(
            id = "spicy_017",
            text = "Show the weirdest meme saved on your phone.",
            difficulty = Difficulty.SPICY,
            tags = listOf("meme", "humor")
        ),
        Dare(
            id = "spicy_018",
            text = "Call yourself by a dramatic nickname every time you speak for the next three rounds.",
            difficulty = Difficulty.SPICY,
            tags = listOf("roleplay", "speech")
        ),
        Dare(
            id = "spicy_019",
            text = "Let the group imitate you, then rate whose impression was most accurate.",
            difficulty = Difficulty.SPICY,
            tags = listOf("impression", "group")
        ),
        Dare(
            id = "spicy_020",
            text = "Tell the group the most awkward compliment you've ever received.",
            difficulty = Difficulty.SPICY,
            tags = listOf("conversation", "cringe")
        ),

        // ==================== EXTREME (20 dares) ====================
        Dare(
            id = "extreme_001",
            text = "Let the group ask you three questions—you must answer honestly or take a skip.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("interrogation", "honesty")
        ),
        Dare(
            id = "extreme_002",
            text = "Give your phone to the player on your right and let them choose a harmless message for you to send to a friend.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("phone", "messaging")
        ),
        Dare(
            id = "extreme_003",
            text = "Call a friend and dramatically sing \"Happy Birthday\" regardless of whether it's their birthday.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("phone", "singing")
        ),
        Dare(
            id = "extreme_004",
            text = "Let the group choose a ridiculous profile picture for you for 10 minutes.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("profile", "social")
        ),
        Dare(
            id = "extreme_005",
            text = "Recreate your most embarrassing moment as dramatically as possible.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("drama", "performance")
        ),
        Dare(
            id = "extreme_006",
            text = "Let another player write a harmless status for you; you decide whether to post it.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("social", "status")
        ),
        Dare(
            id = "extreme_007",
            text = "Call someone and convince them you've just won an imaginary award.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("call", "acting")
        ),
        Dare(
            id = "extreme_008",
            text = "Let the group choose someone you must compliment sincerely.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("wholesome", "group")
        ),
        Dare(
            id = "extreme_009",
            text = "Reveal the most awkward autocorrect mistake you've experienced.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("confession", "autocorrect")
        ),
        Dare(
            id = "extreme_010",
            text = "Speak only in song lyrics until your next turn.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("music", "talking")
        ),
        Dare(
            id = "extreme_011",
            text = "Let another player send one harmless emoji to a contact you choose.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("contact", "emoji")
        ),
        Dare(
            id = "extreme_012",
            text = "Act out your reaction to receiving a text from your biggest crush—real or imaginary.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("acting", "crush")
        ),
        Dare(
            id = "extreme_013",
            text = "Let the group create a fictional conspiracy theory about you, then defend yourself against it.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("creative", "debate")
        ),
        Dare(
            id = "extreme_014",
            text = "Do a dramatic confession about something harmless you've never told the group.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("secret", "drama")
        ),
        Dare(
            id = "extreme_015",
            text = "Let another player give you a ridiculous challenge that must be safe and agreed upon by everyone.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("wildcard", "custom")
        ),
        Dare(
            id = "extreme_016",
            text = "Attempt to sell a random object in the room like it's worth one million dollars.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("sales", "improv")
        ),
        Dare(
            id = "extreme_017",
            text = "Let everyone vote on your most embarrassing personality trait—you must give a defense speech.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("speech", "defense")
        ),
        Dare(
            id = "extreme_018",
            text = "Recreate your most cringe social-media post or phase.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("cringe", "acting")
        ),
        Dare(
            id = "extreme_019",
            text = "Give an overly dramatic apology speech to an inanimate object.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("drama", "humor")
        ),
        Dare(
            id = "extreme_020",
            text = "Let the group assign you a character, and stay in character until your next turn.",
            difficulty = Difficulty.EXTREME,
            tags = listOf("roleplay", "challenge")
        )
    )
}
