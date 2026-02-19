import { useCallback } from 'react';

const useGameReset = (gameState, setGameState) => {
  const resetGame = useCallback(() => {
    try {
      // Clear all game state data
      const initialGameState = {
        players: [],
        scores: {},
        rounds: [],
        currentRound: 0,
        gamePhase: 'setup', // Return to player setup phase
        gameSettings: {
          maxRounds: 10,
          scoreLimit: null,
          gameMode: 'standard'
        },
        gameHistory: [],
        lastUpdated: new Date().toISOString()
      };

      setGameState(initialGameState);

      // Clear any persisted game data
      if (typeof Storage !== 'undefined') {
        localStorage.removeItem('scorekeeperGameState');
        localStorage.removeItem('scorekeeperPlayers');
        localStorage.removeItem('scorekeeperScores');
      }

      // Dispatch custom event for other components to react to reset
      window.dispatchEvent(new CustomEvent('gameReset', {
        detail: { timestamp: new Date().toISOString() }
      }));

      return true;
    } catch (error) {
      console.error('Error resetting game:', error);
      return false;
    }
  }, [setGameState]);

  const canReset = useCallback(() => {
    return gameState && (gameState.players?.length > 0 || gameState.rounds?.length > 0);
  }, [gameState]);

  return {
    resetGame,
    canReset
  };
};

export default useGameReset;