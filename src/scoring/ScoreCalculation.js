/**
 * Represents the result of a score calculation for a round
 */
export class ScoreCalculation {
  constructor(baseScore, bonusPointsEligible, totalRoundScore) {
    this.baseScore = baseScore;
    this.bonusPointsEligible = bonusPointsEligible;
    this.totalRoundScore = totalRoundScore;
    this.bidMet = bonusPointsEligible; // Alias for clarity
  }

  /**
   * Add bonus points to the total score
   * Only applies if the player is eligible for bonus points (bid was met exactly)
   * @param {number} bonusPoints - Points to add
   */
  addBonusPoints(bonusPoints) {
    if (this.bonusPointsEligible) {
      this.totalRoundScore += bonusPoints;
    }
  }
}