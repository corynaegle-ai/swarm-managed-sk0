import {
  updatePlayerScore,
  updateAllPlayersScores,
  getCurrentLeader,
  calculateRunningTotals,
  initializePlayer,
  validateScoreIntegrity
} from '../scoreManager';

describe('scoreManager', () => {
  describe('updatePlayerScore', () => {
    test('updates player total score and round scores', () => {
      const player = { id: '1', name: 'Test', totalScore: 50, roundScores: [25, 25] };
      const result = updatePlayerScore(player, 30);
      
      expect(result.totalScore).toBe(80);
      expect(result.roundScores).toEqual([25, 25, 30]);
    });

    test('handles player with no previous scores', () => {
      const player = { id: '1', name: 'Test' };
      const result = updatePlayerScore(player, 30);
      
      expect(result.totalScore).toBe(30);
      expect(result.roundScores).toEqual([30]);
    });
  });

  describe('getCurrentLeader', () => {
    test('returns player with highest score', () => {
      const players = [
        { id: '1', totalScore: 100 },
        { id: '2', totalScore: 150 },
        { id: '3', totalScore: 75 }
      ];
      
      const leader = getCurrentLeader(players);
      expect(leader.id).toBe('2');
    });

    test('handles empty players array', () => {
      expect(getCurrentLeader([])).toBeNull();
    });
  });

  describe('calculateRunningTotals', () => {
    test('calculates running totals correctly', () => {
      const players = [{
        id: '1',
        roundScores: [25, 30, 20]
      }];
      
      const result = calculateRunningTotals(players);
      expect(result[0].runningTotals).toEqual([25, 55, 75]);
      expect(result[0].totalScore).toBe(75);
    });
  });

  describe('validateScoreIntegrity', () => {
    test('returns true for valid scores', () => {
      const players = [{
        totalScore: 75,
        roundScores: [25, 30, 20]
      }];
      
      expect(validateScoreIntegrity(players)).toBe(true);
    });

    test('returns false for invalid scores', () => {
      const players = [{
        totalScore: 100,
        roundScores: [25, 30, 20]
      }];
      
      expect(validateScoreIntegrity(players)).toBe(false);
    });
  });
});