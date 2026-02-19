const Round = require('./Round');

class Game {
  constructor() {
    this.currentRoundNumber = 1;
    this.rounds = [];
    this.players = [];
    this.isGameComplete = false;
    
    // Initialize first round
    this.createNewRound();
  }

  // Create a new round
  createNewRound() {
    if (this.currentRoundNumber > 10) {
      this.isGameComplete = true;
      return null;
    }

    const round = new Round(this.currentRoundNumber);
    round.players = [...this.players];
    this.rounds.push(round);
    return round;
  }

  // Get current round
  getCurrentRound() {
    return this.rounds[this.rounds.length - 1];
  }

  // Progress to next round
  advanceToNextRound() {
    const currentRound = this.getCurrentRound();
    
    if (!currentRound || !currentRound.isCompleted()) {
      throw new Error('Cannot advance: current round is not completed');
    }

    if (this.currentRoundNumber >= 10) {
      this.isGameComplete = true;
      return null;
    }

    // Prevent going backwards
    if (this.currentRoundNumber < 1 || this.currentRoundNumber > 10) {
      throw new Error('Invalid round progression');
    }

    this.currentRoundNumber++;
    return this.createNewRound();
  }

  // Start playing phase for current round
  startCurrentRoundPlaying() {
    const currentRound = this.getCurrentRound();
    if (!currentRound) {
      throw new Error('No current round available');
    }
    currentRound.startPlaying();
  }

  // Complete a hand in current round
  completeHandInCurrentRound() {
    const currentRound = this.getCurrentRound();
    if (!currentRound) {
      throw new Error('No current round available');
    }
    currentRound.completeHand();
  }

  // Check if game is complete
  isComplete() {
    return this.isGameComplete || this.currentRoundNumber > 10;
  }

  // Get game status
  getGameStatus() {
    return {
      currentRound: this.currentRoundNumber,
      isComplete: this.isComplete(),
      currentRoundStatus: this.getCurrentRound()?.getStatus(),
      totalRounds: this.rounds.length
    };
  }

  // Add players to game
  addPlayer(player) {
    this.players.push(player);
    // Update current round with new player
    const currentRound = this.getCurrentRound();
    if (currentRound) {
      currentRound.players = [...this.players];
    }
  }

  // Process automatic game flow
  processGameFlow() {
    const currentRound = this.getCurrentRound();
    if (!currentRound) return;

    // Auto-progress from bidding to playing when all bids are in
    if (currentRound.getStatus() === 'bidding' && currentRound.allBidsComplete()) {
      this.startCurrentRoundPlaying();
    }

    // Auto-advance to next round when current is completed
    if (currentRound.isCompleted() && !this.isComplete()) {
      this.advanceToNextRound();
    }
  }
}

module.exports = Game;