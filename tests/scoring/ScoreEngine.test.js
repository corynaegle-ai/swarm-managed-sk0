import { ScoreEngine } from '../../src/scoring/ScoreEngine.js';
import { ScoreCalculation } from '../../src/scoring/ScoreCalculation.js';

describe('ScoreEngine', () => {
  describe('calculateScore', () => {
    // AC-001: Bid 3 take 3 = 60 points (20*3)
    test('bid 3 take 3 should return 60 points', () => {
      const result = ScoreEngine.calculateScore(3, 3, 5);
      expect(result.baseScore).toBe(60);
      expect(result.totalRoundScore).toBe(60);
      expect(result.bonusPointsEligible).toBe(true);
      expect(result.bidMet).toBe(true);
    });

    // AC-002: Bid 2 take 4 = -20 points (-10*2 off)
    test('bid 2 take 4 should return -20 points', () => {
      const result = ScoreEngine.calculateScore(2, 4, 5);
      expect(result.baseScore).toBe(-20);
      expect(result.totalRoundScore).toBe(-20);
      expect(result.bonusPointsEligible).toBe(false);
      expect(result.bidMet).toBe(false);
    });

    // AC-003: Bid 0 take 0 in round 7 = 70 points (10*7)
    test('bid 0 take 0 in round 7 should return 70 points', () => {
      const result = ScoreEngine.calculateScore(0, 0, 7);
      expect(result.baseScore).toBe(70);
      expect(result.totalRoundScore).toBe(70);
      expect(result.bonusPointsEligible).toBe(true);
      expect(result.bidMet).toBe(true);
    });

    // AC-004: Bid 0 take 2 in round 9 = -90 points (-10*9)
    test('bid 0 take 2 in round 9 should return -90 points', () => {
      const result = ScoreEngine.calculateScore(0, 2, 9);
      expect(result.baseScore).toBe(-90);
      expect(result.totalRoundScore).toBe(-90);
      expect(result.bonusPointsEligible).toBe(false);
      expect(result.bidMet).toBe(false);
    });

    // AC-005: Bonus points only added when bidMet is true
    test('bonus points should only be added when bid is met', () => {
      const exactBid = ScoreEngine.calculateScore(2, 2, 5);
      exactBid.addBonusPoints(10);
      expect(exactBid.totalRoundScore).toBe(50); // 40 base + 10 bonus

      const missedBid = ScoreEngine.calculateScore(2, 3, 5);
      missedBid.addBonusPoints(10);
      expect(missedBid.totalRoundScore).toBe(-10); // No bonus added
    });

    // Additional edge cases
    test('should handle bid 1 scenarios correctly', () => {
      const exactBid1 = ScoreEngine.calculateScore(1, 1, 3);
      expect(exactBid1.baseScore).toBe(20);
      expect(exactBid1.bonusPointsEligible).toBe(true);

      const missedBid1 = ScoreEngine.calculateScore(1, 0, 3);
      expect(missedBid1.baseScore).toBe(-10);
      expect(missedBid1.bonusPointsEligible).toBe(false);
    });

    test('should handle error cases', () => {
      expect(() => ScoreEngine.calculateScore('invalid', 2, 3)).toThrow();
      expect(() => ScoreEngine.calculateScore(-1, 2, 3)).toThrow();
      expect(() => ScoreEngine.calculateScore(2, -1, 3)).toThrow();
      expect(() => ScoreEngine.calculateScore(2, 2, 0)).toThrow();
    });
  });
});