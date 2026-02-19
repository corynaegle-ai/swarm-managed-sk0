/**
 * Test suite for Skull King scoring engine
 */

const { calculateScore } = require('../js/scoring.js');

describe('Skull King Scoring Engine', () => {
    describe('Non-zero bids', () => {
        test('exact bid met - calculateScore(3, 3, 5)', () => {
            const result = calculateScore(3, 3, 5);
            expect(result).toEqual({
                baseScore: 60,
                bonusPoints: 0,
                bidMet: true,
                totalRoundScore: 60
            });
        });
        
        test('bid missed by 2 - calculateScore(2, 4, 5)', () => {
            const result = calculateScore(2, 4, 5);
            expect(result).toEqual({
                baseScore: -20,
                bonusPoints: 0,
                bidMet: false,
                totalRoundScore: -20
            });
        });
        
        test('bid missed by 1 under - calculateScore(5, 4, 3)', () => {
            const result = calculateScore(5, 4, 3);
            expect(result).toEqual({
                baseScore: -10,
                bonusPoints: 0,
                bidMet: false,
                totalRoundScore: -10
            });
        });
    });
    
    describe('Zero bids', () => {
        test('zero bid met - calculateScore(0, 0, 7)', () => {
            const result = calculateScore(0, 0, 7);
            expect(result).toEqual({
                baseScore: 70,
                bonusPoints: 0,
                bidMet: true,
                totalRoundScore: 70
            });
        });
        
        test('zero bid missed - calculateScore(0, 2, 9)', () => {
            const result = calculateScore(0, 2, 9);
            expect(result).toEqual({
                baseScore: -90,
                bonusPoints: 0,
                bidMet: false,
                totalRoundScore: -90
            });
        });
    });
    
    describe('Error handling', () => {
        test('invalid parameter types', () => {
            expect(() => calculateScore('3', 3, 5)).toThrow('All parameters must be numbers');
            expect(() => calculateScore(3, '3', 5)).toThrow('All parameters must be numbers');
            expect(() => calculateScore(3, 3, '5')).toThrow('All parameters must be numbers');
        });
        
        test('negative values', () => {
            expect(() => calculateScore(-1, 3, 5)).toThrow('Bid, tricks taken, and round number must be non-negative (round number >= 1)');
            expect(() => calculateScore(3, -1, 5)).toThrow('Bid, tricks taken, and round number must be non-negative (round number >= 1)');
            expect(() => calculateScore(3, 3, 0)).toThrow('Bid, tricks taken, and round number must be non-negative (round number >= 1)');
        });
    });
});