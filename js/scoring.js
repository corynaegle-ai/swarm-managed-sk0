/**
 * Skull King Score Calculation Engine
 * Implements scoring rules for the Skull King card game
 */

/**
 * Score calculation result object
 * @typedef {Object} ScoreCalculation
 * @property {number} baseScore - Base score calculated from bid accuracy
 * @property {number} bonusPoints - Bonus points (reserved for future enhancement)
 * @property {boolean} bidMet - Whether the player met their exact bid
 * @property {number} totalRoundScore - Total score for the round
 */

/**
 * Calculates the score for a player's bid and tricks taken
 * 
 * Scoring Rules:
 * - For bids 1+: exact bid = +20 per trick, off by N = -10*N points
 * - For bid 0: exact = +10*roundNumber, off = -10*roundNumber
 * 
 * @param {number} bid - The number of tricks the player bid
 * @param {number} tricksTaken - The actual number of tricks taken
 * @param {number} roundNumber - The current round number (1-10)
 * @returns {ScoreCalculation} Score calculation object
 */
function calculateScore(bid, tricksTaken, roundNumber) {
    // Input validation
    if (typeof bid !== 'number' || typeof tricksTaken !== 'number' || typeof roundNumber !== 'number') {
        throw new Error('All parameters must be numbers');
    }
    
    if (bid < 0 || tricksTaken < 0 || roundNumber < 1) {
        throw new Error('Bid, tricks taken, and round number must be non-negative (round number >= 1)');
    }
    
    let baseScore = 0;
    let bidMet = false;
    
    if (bid === tricksTaken) {
        bidMet = true;
        if (bid === 0) {
            // Zero bid: exact = +10 * roundNumber
            baseScore = 10 * roundNumber;
        } else {
            // Non-zero bid: exact = +20 per trick
            baseScore = 20 * bid;
        }
    } else {
        bidMet = false;
        const difference = Math.abs(bid - tricksTaken);
        
        if (bid === 0) {
            // Zero bid missed: -10 * roundNumber
            baseScore = -10 * roundNumber;
        } else {
            // Non-zero bid missed: -10 * difference
            baseScore = -10 * difference;
        }
    }
    
    // Bonus points functionality stubbed out for future enhancement
    const bonusPoints = 0;
    const totalRoundScore = baseScore + bonusPoints;
    
    return {
        baseScore,
        bonusPoints,
        bidMet,
        totalRoundScore
    };
}

// Module exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateScore };
} else if (typeof window !== 'undefined') {
    window.SkullKingScoring = { calculateScore };
}