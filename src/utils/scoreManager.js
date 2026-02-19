/**
 * Score management utilities for game progression and player tracking
 */

/**
 * Updates a player's total score after round completion
 * @param {Object} player - Player object
 * @param {number} roundScore - Score for the completed round
 * @returns {Object} Updated player object
 */
export const updatePlayerScore = (player, roundScore) => {
  const updatedPlayer = {
    ...player,
    roundScores: [...(player.roundScores || []), roundScore],
    totalScore: (player.totalScore || 0) + roundScore
  };
  
  return updatedPlayer;
};

/**
 * Updates all players' scores after round completion
 * @param {Array} players - Array of player objects
 * @param {Object} roundScores - Object mapping player IDs to their round scores
 * @returns {Array} Updated players array
 */
export const updateAllPlayersScores = (players, roundScores) => {
  return players.map(player => {
    const playerScore = roundScores[player.id] || 0;
    return updatePlayerScore(player, playerScore);
  });
};

/**
 * Gets the current game leader
 * @param {Array} players - Array of player objects
 * @returns {Object} Leading player object
 */
export const getCurrentLeader = (players) => {
  if (!players || players.length === 0) return null;
  
  return players.reduce((leader, current) => {
    return (current.totalScore || 0) > (leader.totalScore || 0) ? current : leader;
  });
};

/**
 * Calculates running totals for display
 * @param {Array} players - Array of player objects
 * @returns {Array} Players with calculated running totals
 */
export const calculateRunningTotals = (players) => {
  return players.map(player => {
    const runningTotals = [];
    let runningTotal = 0;
    
    (player.roundScores || []).forEach(score => {
      runningTotal += score;
      runningTotals.push(runningTotal);
    });
    
    return {
      ...player,
      runningTotals,
      totalScore: runningTotal
    };
  });
};

/**
 * Initializes a new player with score tracking
 * @param {string} id - Player ID
 * @param {string} name - Player name
 * @returns {Object} Initialized player object
 */
export const initializePlayer = (id, name) => {
  return {
    id,
    name,
    totalScore: 0,
    roundScores: [],
    runningTotals: []
  };
};

/**
 * Validates score data integrity
 * @param {Array} players - Array of player objects
 * @returns {boolean} True if all scores are valid
 */
export const validateScoreIntegrity = (players) => {
  return players.every(player => {
    const roundTotal = (player.roundScores || []).reduce((sum, score) => sum + score, 0);
    return roundTotal === (player.totalScore || 0);
  });
};