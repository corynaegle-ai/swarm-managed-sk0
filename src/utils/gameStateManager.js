/**
 * Utility functions for managing game state operations
 */

export const createInitialGameState = () => ({
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
  lastUpdated: new Date().toISOString()
});

export const clearGameData = () => {
  try {
    if (typeof Storage !== 'undefined') {
      const keysToRemove = [
        'scorekeeperGameState',
        'scorekeeperPlayers',
        'scorekeeperScores',
        'scorekeeperRounds',
        'scorekeeperSettings'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
    }
    return true;
  } catch (error) {
    console.error('Error clearing game data:', error);
    return false;
  }
};

export const validateGameState = (gameState) => {
  if (!gameState || typeof gameState !== 'object') {
    return false;
  }

  const requiredFields = ['players', 'scores', 'rounds', 'gamePhase'];
  return requiredFields.every(field => gameState.hasOwnProperty(field));
};

export const resetGameState = (setGameState) => {
  try {
    const initialState = createInitialGameState();
    setGameState(initialState);
    clearGameData();
    
    // Dispatch reset event
    window.dispatchEvent(new CustomEvent('gameStateReset', {
      detail: { timestamp: new Date().toISOString() }
    }));
    
    return true;
  } catch (error) {
    console.error('Error resetting game state:', error);
    return false;
  }
};