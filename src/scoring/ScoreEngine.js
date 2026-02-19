import { ScoreCalculation } from './ScoreCalculation.js';

/**
 * Skull King scoring engine implementation
 */
export class ScoreEngine {
  /**
   * Calculate score for a round based on bid and actual tricks taken
   * 
   * Scoring Rules:
   * - Bid 1+: exact = +20 per trick, off = -10 per trick difference
   * - Bid 0: exact = +10 * handsInRound, off = -10 * handsInRound
   * - Bonus points only count if bid is met exactly
   * 
   * @param {number} bid - Number of tricks bid
   * @param {number} tricksTaken - Number of tricks actually taken
   * @param {number} handsInRound - Current round number (for bid 0 calculations)
   * @returns {ScoreCalculation} Score calculation result
   */
  static calculateScore(bid, tricksTaken, handsInRound) {
    if (typeof bid !== 'number' || typeof tricksTaken !== 'number' || typeof handsInRound !== 'number') {
      throw new Error('All parameters must be numbers');
    }

    if (bid < 0 || tricksTaken < 0 || handsInRound < 1) {
      throw new Error('Invalid parameter values');
    }

    const bidMet = (bid === tricksTaken);
    let baseScore;

    if (bid === 0) {
      // Bid 0 scoring rules
      if (bidMet) {
        baseScore = 10 * handsInRound;
      } else {
        baseScore = -10 * handsInRound;
      }
    } else {
      // Bid 1+ scoring rules
      if (bidMet) {
        baseScore = 20 * bid;
      } else {
        const difference = Math.abs(bid - tricksTaken);
        baseScore = -10 * difference;
      }
    }

    return new ScoreCalculation(baseScore, bidMet, baseScore);
  }
}