/**
 * Score Manager Module
 * Handles all score-related data and operations for the game
 */

// Data structure to store all player scores
// Format: {playerId: {total: number, rounds: number[]}}
const scores = {};

// Track current round number (1-10)
let currentRound = 1;

/**
 * Updates a player's score by adding the round score to their total and round history
 * @param {string} playerId - The unique identifier for the player
 * @param {number} roundScore - The score to add for this round
 * @throws {Error} If playerId is invalid or roundScore is not a number
 */
function updatePlayerScore(playerId, roundScore) {
    if (!playerId || typeof playerId !== 'string') {
        throw new Error('Player ID must be a non-empty string');
    }
    
    if (typeof roundScore !== 'number' || isNaN(roundScore)) {
        throw new Error('Round score must be a valid number');
    }
    
    // Initialize player data if it doesn't exist
    if (!scores[playerId]) {
        scores[playerId] = {
            total: 0,
            rounds: []
        };
    }
    
    // Add round score to total and round history
    scores[playerId].total += roundScore;
    scores[playerId].rounds.push(roundScore);
}

/**
 * Gets the current total score for a player
 * @param {string} playerId - The unique identifier for the player
 * @returns {number} The player's total score, or 0 if player doesn't exist
 * @throws {Error} If playerId is invalid
 */
function getTotalScore(playerId) {
    if (!playerId || typeof playerId !== 'string') {
        throw new Error('Player ID must be a non-empty string');
    }
    
    return scores[playerId] ? scores[playerId].total : 0;
}

/**
 * Gets the current round number
 * @returns {number} Current round number (1-10)
 */
function getCurrentRound() {
    return currentRound;
}

/**
 * Advances to the next round
 * @throws {Error} If already at maximum round (10)
 */
function nextRound() {
    if (currentRound >= 10) {
        throw new Error('Cannot advance beyond round 10');
    }
    currentRound++;
}

/**
 * Gets the player with the highest total score
 * @returns {string|null} Player ID of the leader, or null if no players exist
 */
function getLeader() {
    const playerIds = Object.keys(scores);
    
    if (playerIds.length === 0) {
        return null;
    }
    
    let leader = playerIds[0];
    let highestScore = scores[leader].total;
    
    for (let i = 1; i < playerIds.length; i++) {
        const playerId = playerIds[i];
        const playerScore = scores[playerId].total;
        
        if (playerScore > highestScore) {
            leader = playerId;
            highestScore = playerScore;
        }
    }
    
    return leader;
}

/**
 * Gets all player scores data
 * @returns {Object} Copy of the scores object
 */
function getAllScores() {
    return JSON.parse(JSON.stringify(scores));
}

/**
 * Gets a player's round-by-round score history
 * @param {string} playerId - The unique identifier for the player
 * @returns {number[]} Array of round scores, or empty array if player doesn't exist
 * @throws {Error} If playerId is invalid
 */
function getPlayerRounds(playerId) {
    if (!playerId || typeof playerId !== 'string') {
        throw new Error('Player ID must be a non-empty string');
    }
    
    return scores[playerId] ? [...scores[playerId].rounds] : [];
}

/**
 * Resets all scores and round data
 */
function resetScores() {
    Object.keys(scores).forEach(playerId => {
        delete scores[playerId];
    });
    currentRound = 1;
}

/**
 * Gets the number of registered players
 * @returns {number} Number of players with score data
 */
function getPlayerCount() {
    return Object.keys(scores).length;
}

// Export all functions
module.exports = {
    updatePlayerScore,
    getTotalScore,
    getCurrentRound,
    nextRound,
    getLeader,
    getAllScores,
    getPlayerRounds,
    resetScores,
    getPlayerCount
};