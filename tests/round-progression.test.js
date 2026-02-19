const Game = require('../src/models/Game');
const Round = require('../src/models/Round');
const GameService = require('../src/services/GameService');

describe('Round Progression System', () => {
  let game;
  
  beforeEach(() => {
    game = new Game();
    game.addPlayer({ id: 'player1' });
    game.addPlayer({ id: 'player2' });
  });

  describe('AC-001: Automatic status transitions', () => {
    test('should progress from bidding to playing to completed', () => {
      const round = game.getCurrentRound();
      
      // Start in bidding
      expect(round.getStatus()).toBe('bidding');
      
      // Add all bids
      round.addBid('player1', 1);
      round.addBid('player2', 0);
      
      // Process game flow should transition to playing
      game.processGameFlow();
      expect(round.getStatus()).toBe('playing');
      
      // Complete the required hand (Round 1 = 1 hand)
      game.completeHandInCurrentRound();
      expect(round.getStatus()).toBe('completed');
    });
  });

  describe('AC-002: Advances to next round after completion', () => {
    test('should advance to next round after current round completed', () => {
      expect(game.currentRoundNumber).toBe(1);
      
      // Complete round 1
      const round1 = game.getCurrentRound();
      round1.addBid('player1', 1);
      round1.addBid('player2', 0);
      game.processGameFlow(); // bidding -> playing
      game.completeHandInCurrentRound(); // complete 1 hand
      
      // Should auto-advance to round 2
      game.processGameFlow();
      expect(game.currentRoundNumber).toBe(2);
      
      const round2 = game.getCurrentRound();
      expect(round2.number).toBe(2);
      expect(round2.getStatus()).toBe('bidding');
    });
  });

  describe('AC-003: Correct hand counts per round', () => {
    test('should have correct hands in round based on round number', () => {
      for (let i = 1; i <= 10; i++) {
        const round = new Round(i);
        expect(round.getRequiredHands()).toBe(i);
        expect(round.handsInRound).toBe(i);
      }
    });
    
    test('should require correct number of hands to complete each round', () => {
      // Test round 3 (should require 3 hands)
      game.currentRoundNumber = 3;
      const round3 = game.createNewRound();
      
      round3.addBid('player1', 2);
      round3.addBid('player2', 1);
      round3.startPlaying();
      
      // Complete 2 hands - should not be completed yet
      round3.completeHand();
      round3.completeHand();
      expect(round3.isCompleted()).toBe(false);
      
      // Complete 3rd hand - should be completed
      round3.completeHand();
      expect(round3.isCompleted()).toBe(true);
    });
  });

  describe('AC-004: Game ends after Round 10', () => {
    test('should end game after round 10 completion', () => {
      game.currentRoundNumber = 10;
      const round10 = game.createNewRound();
      
      // Complete round 10
      round10.addBid('player1', 5);
      round10.addBid('player2', 5);
      round10.startPlaying();
      
      // Complete all 10 hands
      for (let i = 0; i < 10; i++) {
        round10.completeHand();
      }
      
      expect(round10.isCompleted()).toBe(true);
      
      // Try to advance - should complete game
      game.processGameFlow();
      expect(game.isComplete()).toBe(true);
    });
    
    test('should not create round 11', () => {
      game.currentRoundNumber = 11;
      const round11 = game.createNewRound();
      expect(round11).toBe(null);
      expect(game.isComplete()).toBe(true);
    });
  });

  describe('AC-005: Cannot go backwards in progression', () => {
    test('should throw error for invalid round progression', () => {
      game.currentRoundNumber = 0;
      expect(() => game.advanceToNextRound()).toThrow('Invalid round progression');
      
      game.currentRoundNumber = 11;
      expect(() => game.advanceToNextRound()).toThrow('Invalid round progression');
    });
    
    test('should not allow status regression', () => {
      const round = game.getCurrentRound();
      round.status = 'playing';
      
      expect(() => round.startPlaying()).toThrow('Cannot start playing from playing status');
    });
    
    test('should not advance without completion', () => {
      const round = game.getCurrentRound();
      round.status = 'playing'; // Not completed
      
      expect(() => game.advanceToNextRound()).toThrow('Cannot advance: current round is not completed');
    });
  });

  describe('Integration with GameService', () => {
    test('should handle complete game flow through service', () => {
      const gameId = 'test-game';
      const testGame = GameService.createGame(gameId);
      testGame.addPlayer({ id: 'p1' });
      testGame.addPlayer({ id: 'p2' });
      
      // Complete rounds 1-3 to test progression
      for (let round = 1; round <= 3; round++) {
        // Add bids
        GameService.addBid(gameId, 'p1', 1);
        GameService.addBid(gameId, 'p2', 1);
        
        // Complete required hands for this round
        for (let hand = 0; hand < round; hand++) {
          GameService.completeHand(gameId);
        }
        
        const details = GameService.getRoundDetails(gameId);
        if (round < 3) {
          expect(details.roundNumber).toBe(round + 1);
        } else {
          expect(details.roundNumber).toBe(3);
        }
      }
    });
  });
});