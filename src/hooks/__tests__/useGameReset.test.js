import { renderHook, act } from '@testing-library/react';
import useGameReset from '../useGameReset';

// Mock localStorage
const mockLocalStorage = {
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock window.dispatchEvent
const mockDispatchEvent = jest.fn();
Object.defineProperty(window, 'dispatchEvent', { value: mockDispatchEvent });

describe('useGameReset', () => {
  const mockSetGameState = jest.fn();
  
  const sampleGameState = {
    players: [{ id: 1, name: 'Player 1' }],
    scores: { 1: [10, 20] },
    rounds: [{ round: 1, scores: { 1: 10 } }],
    currentRound: 1,
    gamePhase: 'playing'
  };

  beforeEach(() => {
    mockSetGameState.mockClear();
    mockLocalStorage.removeItem.mockClear();
    mockDispatchEvent.mockClear();
  });

  it('provides resetGame and canReset functions', () => {
    const { result } = renderHook(() => useGameReset(sampleGameState, mockSetGameState));
    
    expect(typeof result.current.resetGame).toBe('function');
    expect(typeof result.current.canReset).toBe('function');
  });

  it('resets game state to initial values', () => {
    const { result } = renderHook(() => useGameReset(sampleGameState, mockSetGameState));
    
    act(() => {
      const success = result.current.resetGame();
      expect(success).toBe(true);
    });
    
    expect(mockSetGameState).toHaveBeenCalledWith({
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

  it('clears localStorage data on reset', () => {
    const { result } = renderHook(() => useGameReset(sampleGameState, mockSetGameState));
    
    act(() => {
      result.current.resetGame();
    });
    
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('scorekeeperGameState');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('scorekeeperPlayers');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('scorekeeperScores');
  });

  it('dispatches gameReset event on reset', () => {
    const { result } = renderHook(() => useGameReset(sampleGameState, mockSetGameState));
    
    act(() => {
      result.current.resetGame();
    });
    
    expect(mockDispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'gameReset',
        detail: expect.objectContaining({
          timestamp: expect.any(String)
        })
      })
    );
  });

  it('canReset returns true when game has players or rounds', () => {
    const { result } = renderHook(() => useGameReset(sampleGameState, mockSetGameState));
    
    expect(result.current.canReset()).toBe(true);
  });

  it('canReset returns false when game has no players or rounds', () => {
    const emptyGameState = {
      players: [],
      rounds: []
    };
    
    const { result } = renderHook(() => useGameReset(emptyGameState, mockSetGameState));
    
    expect(result.current.canReset()).toBe(false);
  });

  it('handles errors gracefully during reset', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSetGameState.mockImplementation(() => {
      throw new Error('Test error');
    });
    
    const { result } = renderHook(() => useGameReset(sampleGameState, mockSetGameState));
    
    act(() => {
      const success = result.current.resetGame();
      expect(success).toBe(false);
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Error resetting game:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});