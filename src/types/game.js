/**
 * Game-related type definitions and validation
 */

/**
 * Represents a bid made by a player in a specific round
 */
export class RoundBid {
  constructor(gameId, roundNumber, playerId, bid) {
    this.gameId = gameId;
    this.roundNumber = roundNumber;
    this.playerId = playerId;
    this.bid = bid;
    this.createdAt = new Date();
    
    this.validate();
  }

  validate() {
    if (!this.gameId) throw new Error('gameId is required');
    if (!this.roundNumber || this.roundNumber < 1) throw new Error('Invalid round number');
    if (!this.playerId) throw new Error('playerId is required');
    if (this.bid < 0) throw new Error('Bid cannot be negative');
    if (!Number.isInteger(this.bid)) throw new Error('Bid must be an integer');
  }

  /**
   * Validates bid against hands available in round
   * @param {number} handsInRound - Maximum hands available
   * @returns {boolean} - True if valid
   */
  isValidForRound(handsInRound) {
    return this.bid <= handsInRound;
  }

  toJSON() {
    return {
      gameId: this.gameId,
      roundNumber: this.roundNumber,
      playerId: this.playerId,
      bid: this.bid,
      createdAt: this.createdAt
    };
  }
}

/**
 * Utility functions for bid validation
 */
export const BidValidator = {
  /**
   * Validates a single bid value
   * @param {number} bid - The bid to validate
   * @param {number} handsInRound - Maximum hands in round
   * @returns {Object} - Validation result
   */
  validateBid(bid, handsInRound) {
    if (!Number.isInteger(bid)) {
      return { valid: false, error: 'Bid must be a whole number' };
    }
    if (bid < 0) {
      return { valid: false, error: 'Bid cannot be negative' };
    }
    if (bid > handsInRound) {
      return { valid: false, error: `Bid cannot exceed ${handsInRound} hands` };
    }
    return { valid: true };
  },

  /**
   * Validates all bids for a round
   * @param {Array} bids - Array of RoundBid objects
   * @param {number} handsInRound - Maximum hands in round
   * @returns {Object} - Validation result
   */
  validateRoundBids(bids, handsInRound) {
    const errors = [];
    
    bids.forEach(bid => {
      const validation = this.validateBid(bid.bid, handsInRound);
      if (!validation.valid) {
        errors.push(`Player ${bid.playerId}: ${validation.error}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      totalBids: bids.reduce((sum, bid) => sum + bid.bid, 0)
    };
  }
};