// Game state management
class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.players = [];
    this.scores = {};
    this.rounds = [];
    this.currentPhase = 'setup';
    this.currentRound = 0;
    this.gameStarted = false;
    this.gameEnded = false;
  }

  // Initialize game state
  init() {
    this.reset();
  }

  // Reset game to initial state
  resetGame() {
    this.reset();
    // Trigger UI update if needed
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('gameReset'));
    }
    return this;
  }

  // Add player
  addPlayer(playerName) {
    if (!this.players.includes(playerName)) {
      this.players.push(playerName);
      this.scores[playerName] = 0;
    }
    return this;
  }

  // Remove player
  removePlayer(playerName) {
    const index = this.players.indexOf(playerName);
    if (index > -1) {
      this.players.splice(index, 1);
      delete this.scores[playerName];
    }
    return this;
  }

  // Start game
  startGame() {
    if (this.players.length > 0) {
      this.currentPhase = 'playing';
      this.gameStarted = true;
      this.currentRound = 1;
    }
    return this;
  }

  // End game
  endGame() {
    this.currentPhase = 'ended';
    this.gameEnded = true;
    return this;
  }

  // Update score
  updateScore(playerName, score) {
    if (this.players.includes(playerName)) {
      this.scores[playerName] = score;
    }
    return this;
  }

  // Get current game state
  getState() {
    return {
      players: [...this.players],
      scores: { ...this.scores },
      rounds: [...this.rounds],
      currentPhase: this.currentPhase,
      currentRound: this.currentRound,
      gameStarted: this.gameStarted,
      gameEnded: this.gameEnded
    };
  }

  // Check if game is in active phase
  isActiveGamePhase() {
    return this.currentPhase === 'playing' || this.currentPhase === 'round' || this.currentPhase === 'scoring';
  }
}

// Create global instance
const gameState = new GameState();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GameState, gameState };
}

// Make available globally
if (typeof window !== 'undefined') {
  window.gameState = gameState;
  window.GameState = GameState;
}