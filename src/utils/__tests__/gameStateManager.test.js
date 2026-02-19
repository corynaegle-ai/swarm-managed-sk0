import {
  createInitialGameState,
  clearGameData,
  validateGameState,
  resetGameState
} from '../gameStateManager';

// Mock localStorage
const mockLocalStorage = {
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock window.dispatchEvent
const mockDispatchEvent = jest.fn();
Object.defineProperty(window, 'dispatchEvent', { value: mockDispatchEvent });

describe('gameStateManager', () => {
  beforeEach(() => {
    mockLocalStorage.removeItem.mockClear();
    mockDispatchEvent.mockClear();
  });

  describe('createInitialGameState', () => {
    it('creates initial game state with correct structure', () => {
      const initialState = createInitialGameState();
      
      expect(initialState).toEqual({
        players: [],
        scores: {},
        rounds: [],
        currentRound: 0,
        gamePhase: 'setup',
        gameSettings: {
          maxRounds: 10,
          scoreLimit: null,
          gameMode: 'standard'
        },
        gameHistory: [],
        lastUpdated: expect.any(String)
      });
    });

    it('creates fresh timestamp each time', () => {
      const state1 = createInitialGameState();
      const state2 = createInitialGameState();
      
      expect(state1.lastUpdated).not.toBe(state2.lastUpdated);
    });
  });

  describe('clearGameData', () => {
    it('removes all game-related localStorage items', () => {
      const result = clearGameData();
      
      expect(result).toBe(true);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('scorekeeperGameState');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('scorekeeperPlayers');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('scorekeeperScores');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('scorekeeperRounds');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('scorekeeperSettings');
    });

    it('handles errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const result = clearGameData();
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Error clearing game data:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('validateGameState', () => {
    it('returns true for valid game state', () => {
      const validState = {
        players: [],
        scores: {},
        rounds: [],
        gamePhase: 'setup'
      };
      
      expect(validateGameState(validState)).toBe(true);
    });

    it('returns false for null or undefined', () => {
      expect(validateGameState(null)).toBe(false);
      expect(validateGameState(undefined)).toBe(false);
    });

    it('returns false for non-object values', () => {
      expect(validateGameState('string')).toBe(false);
      expect(validateGameState(123)).toBe(false);
      expect(validateGameState(true)).toBe(false);
    });

    it('returns false for missing required fields', () => {
      const incompleteState = {
        players: [],
        scores: {}
        // missing rounds and gamePhase
      };
      
      expect(validateGameState(incompleteState)).toBe(false);
    });
  });

  describe('resetGameState', () => {
    const mockSetGameState = jest.fn();

    beforeEach(() => {
      mockSetGameState.mockClear();
    });

    it('resets game state and clears data', () => {
      const result = resetGameState(mockSetGameState);
      
      expect(result).toBe(true);
      expect(mockSetGameState).toHaveBeenCalledWith(expect.objectContaining({
        players: [],
        scores: {},
        rounds: [],
        currentRound: 0,
        gamePhase: 'setup'
      }));
    });

    it('dispatches gameStateReset event', () => {
      resetGameState(mockSetGameState);
      
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'gameStateReset',
          detail: expect.objectContaining({
            timestamp: expect.any(String)
          })
        })
      );
    });

    it('handles errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSetGameState.mockImplementation(() => {
        throw new Error('setState error');
      });
      
      const result = resetGameState(mockSetGameState);
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Error resetting game state:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});