const Game = require('../models/Game');

class GameService {
  constructor() {
    this.activeGames = new Map();
  }

  // Create new game
  createGame(gameId) {
    const game = new Game();
    this.activeGames.set(gameId, game);
    return game;
  }

  // Get game by ID
  getGame(gameId) {
    return this.activeGames.get(gameId);
  }

  // Progress game through round transitions
  progressGame(gameId) {
    const game = this.getGame(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    game.processGameFlow();
    return game.getGameStatus();
  }

  // Add bid to current round
  addBid(gameId, playerId, bid) {
    const game = this.getGame(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const currentRound = game.getCurrentRound();
    currentRound.addBid(playerId, bid);
    
    // Process automatic transitions
    game.processGameFlow();
    
    return game.getGameStatus();
  }

  // Complete hand in current round
  completeHand(gameId) {
    const game = this.getGame(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    game.completeHandInCurrentRound();
    
    // Process automatic transitions
    game.processGameFlow();
    
    return game.getGameStatus();
  }

  // Get detailed round information
  getRoundDetails(gameId) {
    const game = this.getGame(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const currentRound = game.getCurrentRound();
    return {
      roundNumber: currentRound.number,
      status: currentRound.getStatus(),
      handsRequired: currentRound.getRequiredHands(),
      handsCompleted: currentRound.handsCompleted,
      isRoundComplete: currentRound.isCompleted(),
      isGameComplete: game.isComplete()
    };
  }
}

module.exports = new GameService();