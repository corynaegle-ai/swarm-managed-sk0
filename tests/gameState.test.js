// Tests for GameState functionality
describe('GameState', () => {
  let gameState;

  beforeEach(() => {
    // Reset gameState before each test
    if (typeof GameState !== 'undefined') {
      gameState = new GameState();
    } else {
      // For browser environment
      gameState = window.gameState;
      gameState.reset();
    }
  });

  describe('resetGame()', () => {
    test('should clear all game data', () => {
      // Setup some game data
      gameState.addPlayer('Player 1');
      gameState.addPlayer('Player 2');
      gameState.updateScore('Player 1', 10);
      gameState.startGame();
      gameState.currentRound = 3;
      gameState.rounds.push('Round 1');

      // Reset the game
      gameState.resetGame();

      // Verify everything is cleared
      expect(gameState.players).toEqual([]);
      expect(gameState.scores).toEqual({});
      expect(gameState.rounds).toEqual([]);
      expect(gameState.currentPhase).toBe('setup');
      expect(gameState.currentRound).toBe(0);
      expect(gameState.gameStarted).toBe(false);
      expect(gameState.gameEnded).toBe(false);
    });

    test('should return to initial state', () => {
      const initialState = gameState.getState();
      
      // Modify state
      gameState.addPlayer('Test Player');
      gameState.startGame();
      
      // Reset
      gameState.resetGame();
      const resetState = gameState.getState();
      
      expect(resetState).toEqual(initialState);
    });

    test('should trigger gameReset event', (done) => {
      if (typeof window !== 'undefined') {
        window.addEventListener('gameReset', () => {
          done();
        });
        
        gameState.resetGame();
      } else {
        // Skip in non-browser environment
        done();
      }
    });
  });

  describe('isActiveGamePhase()', () => {
    test('should return false during setup phase', () => {
      gameState.currentPhase = 'setup';
      expect(gameState.isActiveGamePhase()).toBe(false);
    });

    test('should return true during playing phase', () => {
      gameState.currentPhase = 'playing';
      expect(gameState.isActiveGamePhase()).toBe(true);
    });

    test('should return true during round phase', () => {
      gameState.currentPhase = 'round';
      expect(gameState.isActiveGamePhase()).toBe(true);
    });

    test('should return true during scoring phase', () => {
      gameState.currentPhase = 'scoring';
      expect(gameState.isActiveGamePhase()).toBe(true);
    });

    test('should return false during ended phase', () => {
      gameState.currentPhase = 'ended';
      expect(gameState.isActiveGamePhase()).toBe(false);
    });
  });
});