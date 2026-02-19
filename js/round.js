/**
 * Round Class - Manages game round state and progression
 * 
 * Each round has a specific number of hands based on round number:
 * Round 1 = 1 hand, Round 2 = 2 hands, etc.
 * 
 * Status progression: bidding → playing → completed
 */
class Round {
  /**
   * Creates a new Round instance
   * @param {number} number - The round number (determines max hands)
   */
  constructor(number) {
    if (!Number.isInteger(number) || number < 1) {
      throw new Error('Round number must be a positive integer');
    }
    
    this.number = number;
    this.status = 'bidding';
    this.handsInRound = 0;
    this.maxHands = number; // Round number determines max hands
  }

  /**
   * Advances the round status to the next stage
   * Progression: bidding → playing → completed
   * @throws {Error} If trying to advance from completed status
   */
  advanceStatus() {
    switch (this.status) {
      case 'bidding':
        this.status = 'playing';
        break;
      case 'playing':
        this.status = 'completed';
        break;
      case 'completed':
        throw new Error('Cannot advance status from completed');
      default:
        throw new Error(`Invalid status: ${this.status}`);
    }
  }

  /**
   * Increments the number of hands played in this round
   * @throws {Error} If trying to exceed maxHands
   */
  incrementHands() {
    if (this.handsInRound >= this.maxHands) {
      throw new Error(`Cannot exceed maximum hands (${this.maxHands}) for round ${this.number}`);
    }
    this.handsInRound++;
  }

  /**
   * Checks if the round is complete
   * @returns {boolean} True if handsInRound equals maxHands and status is completed
   */
  isComplete() {
    return this.handsInRound === this.maxHands && this.status === 'completed';
  }
}

/**
 * Creates a new Round instance
 * @param {number} number - The round number
 * @returns {Round} New Round instance
 */
function createRound(number) {
  return new Round(number);
}

/**
 * Advances the status of a round
 * @param {Round} round - The round to advance
 */
function advanceRoundStatus(round) {
  if (!(round instanceof Round)) {
    throw new Error('Parameter must be a Round instance');
  }
  round.advanceStatus();
}

/**
 * Increments the hands count in a round
 * @param {Round} round - The round to increment
 */
function incrementHandsInRound(round) {
  if (!(round instanceof Round)) {
    throw new Error('Parameter must be a Round instance');
  }
  round.incrementHands();
}

/**
 * Checks if a round is complete
 * @param {Round} round - The round to check
 * @returns {boolean} True if round is complete
 */
function isRoundComplete(round) {
  if (!(round instanceof Round)) {
    throw new Error('Parameter must be a Round instance');
  }
  return round.isComplete();
}

// Export all functions and class for game management
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = {
    Round,
    createRound,
    advanceRoundStatus,
    incrementHandsInRound,
    isRoundComplete
  };
} else {
  // Browser environment
  window.Round = Round;
  window.createRound = createRound;
  window.advanceRoundStatus = advanceRoundStatus;
  window.incrementHandsInRound = incrementHandsInRound;
  window.isRoundComplete = isRoundComplete;
}