Here’s a polished `README.md` you can directly put in your DareDrop GitHub repository.

````markdown
# 🎯 DareDrop

> Drop the dare. Own the moment.

DareDrop is a multiplayer party game designed to turn ordinary hangouts into unpredictable and entertaining challenges.

Players add their names, configure the game, and take turns receiving randomly selected dares across three difficulty levels: **Mild, Spicy, and Extreme**.

The game combines randomized gameplay, customizable rules, playful animations, and a mobile-first interface to create a fast and engaging party-game experience.

---

## 🎮 About the Game

DareDrop follows a simple gameplay loop:

```text
Add Players
     ↓
Set the Tone
     ↓
Start Game
     ↓
Random Player Selection
     ↓
Drop the Dare
     ↓
Complete / Skip / Pass
     ↓
Next Player
     ↓
Repeat
     ↓
Game Complete
````

The goal is simple:

> **Who's next? What's their dare? Will they actually do it?**

---

## ✨ Features

* 👥 **Multiplayer gameplay**

  * Add multiple players to a single game session.
  * Supports dynamic player lists.

* 🎯 **Random player selection**

  * Players are selected dynamically for each turn.
  * Optional no-repeat player rule.

* 🎲 **Random dare generation**

  * Dares are selected based on the configured difficulty.
  * Optional no-repeat dare rule.

* 🌶️ **Three difficulty levels**

  * 🟢 Mild — Safe, fun and friendly
  * 🟠 Spicy — Things get a little awkward
  * 🔴 Extreme — Not for the faint-hearted

* ⚙️ **Customizable game settings**

  * Difficulty selection
  * Number of rounds
  * Skip limit
  * Gameplay rules
  * Dare pack selection

* ⏭️ **Skip system**

  * Players can skip dares according to the configured skip limit.

* 🔄 **Pass system**

  * Optional pass functionality allows players to receive another dare without advancing the round.

* 🃏 **Custom dare packs**

  * Create and use your own dares.

* 🎉 **Interactive animations**

  * Player selection animations
  * Dare-drop animations
  * Completion celebrations
  * Game transitions

* 📊 **Game statistics**

  * Rounds played
  * Dares completed
  * Dares skipped
  * Dares passed

* 🔁 **Replay support**

  * Play again using the same players and settings.
  * Start a completely new game.

* 📱 **Mobile-first design**

  * Designed primarily for mobile devices.
  * Responsive interface for different screen sizes.

---

## 🕹️ How to Play

### 1. Add Players

Enter the names of everyone participating.

At least **2 players** are required.

### 2. Set the Tone

Configure:

* Dare Pack
* Difficulty
* Skip Limit
* Number of Rounds
* Game Rules

### 3. Start the Game

DareDrop randomly selects the first player.

### 4. Drop the Dare

The selected player receives a randomly generated dare.

### 5. Take the Challenge

The player can:

* ✅ Complete the dare
* ⏭️ Skip the dare if skips are available
* 🔄 Pass and receive another dare if passes are enabled

### 6. Continue Playing

The game moves to the next player and continues until the configured number of rounds is completed.

### 7. Game Complete

At the end, DareDrop displays a summary of the game and provides options to:

* Play Again
* Start a New Game
* Return Home

---

## 🌶️ Dare Levels

### 🟢 Mild

Safe, funny and friendly challenges.

Examples:

* Do your best animal impression.
* Perform your funniest dance.
* Talk like a robot until your next turn.
* Do an imaginary fashion runway walk.

### 🟠 Spicy

More awkward, embarrassing and socially challenging.

Examples:

* Reveal the most embarrassing song in your playlist.
* Show your screen time for today.
* Tell the group about your most embarrassing school or college moment.
* Let another player ask you an awkward question.

### 🔴 Extreme

Bold, chaotic and high-energy challenges.

Examples:

* Recreate your most embarrassing moment dramatically.
* Give a dramatic confession about something harmless.
* Let the group assign you a character and stay in character.
* Give an overly dramatic apology to an inanimate object.

---

## ⚙️ Game Rules

### No Repeat Players

When enabled, DareDrop prevents the same player from being selected again until all players have had a turn.

### No Repeat Dares

When enabled, a dare that has already been used will not appear again during the current game.

### Allow Passes

When enabled, players can reject a dare and receive another one without consuming a skip.

---

## 🧩 Game Architecture

The game maintains state for:

```text
Players
Current Player
Current Round
Total Rounds
Selected Dare Pack
Enabled Difficulties
Skip Limit
Player Skip Counts
No Repeat Players
No Repeat Dares
Allow Passes
Used Players
Used Dares
Completed Dares
Skipped Dares
Passed Dares
```

Dares are stored as structured data containing information such as:

```javascript
{
  id: "mild_001",
  text: "Do your best animal impression for 20 seconds.",
  difficulty: "mild",
  pack: "default",
  tags: ["funny", "performance"]
}
```

This allows the dare system to be expanded with additional packs and categories in the future.

---

## 🗂️ Main Game Flow

```text
Splash
  │
  ▼
Home
  │
  ▼
Set the Tone
  │
  ▼
Who's Playing?
  │
  ▼
Game Ready
  │
  ▼
Player Reveal
  │
  ▼
Dare Reveal
  │
  ├── Complete ──► Next Turn
  │
  ├── Skip ──────► Next Turn
  │
  └── Pass ──────► New Dare
                         │
                         ▼
                    Next Turn
                         │
                         ▼
                   More Rounds?
                    /        \
                  Yes         No
                   │           │
                   ▼           ▼
             Player Reveal  Game Complete
```

---

## 🛡️ Safety

DareDrop is designed as a fun social game.

The default dare system avoids challenges involving:

* Dangerous activities
* Self-harm
* Illegal activities
* Harassment
* Non-consensual sexual content
* Dangerous substances
* Vandalism
* Revealing passwords or private information

For dares involving phones, messages, contacts, photos or social media, the player must remain in control of any real-world action.

---

## 🚀 Future Improvements

Potential future features include:

* 🌐 Online multiplayer
* 🏆 Leaderboards
* 👤 Player profiles
* 🎨 More visual themes
* 🃏 Community-created dare packs
* 🔥 Seasonal dare packs
* 🎵 Sound effects and background music
* 📳 Haptic feedback
* 📈 Detailed game statistics
* 🔐 User accounts and cloud-saved custom packs
* 🤖 AI-generated custom dare packs
* 🎭 Category-based dare packs
* 🌍 Localization and multiple languages

---

## 📱 Screens

The core application includes:

1. Splash Screen
2. Home Screen
3. Set the Tone
4. Who's Playing?
5. Game Ready
6. Player Reveal
7. Dare Reveal
8. Dare Completed
9. Dare Skipped
10. Round Progress
11. Game Complete
12. Custom Dare Pack
13. How to Play
14. Game Menu / Pause

---

## 🛠️ Tech Stack

> Update this section according to the technologies used in the final implementation.

* Frontend: `Your Framework`
* Language: `Your Language`
* Styling: `Your Styling Solution`
* State Management: `Your State Management`
* Build Tool: `Your Build Tool`

---

## 📦 Getting Started

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/daredrop.git
```

### Navigate to the project

```bash
cd daredrop
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The application should then be available at the local development URL provided by your framework.

---

## 🤝 Contributing

Contributions, ideas and improvements are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test the application.
5. Submit a pull request.

---

## 📄 License

This project is currently intended for educational and personal project purposes.

Add an appropriate open-source license if you decide to distribute the project publicly.

---

## 👤 Author

**Gobika B**

Built as a university software project exploring interactive UI design, game logic, randomized content systems and responsive application development.

---

## ⭐ DareDrop

**Drop the dare.
Own the moment.**

```
```
