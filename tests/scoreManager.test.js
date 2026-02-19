const {
    updatePlayerScore,
    getTotalScore,
    getCurrentRound,
    nextRound,
    getLeader,
    getAllScores,
    getPlayerRounds,
    resetScores,
    getPlayerCount
} = require('../js/scoreManager');

describe('Score Manager', () => {
    beforeEach(() => {
        resetScores();
    });

    describe('updatePlayerScore', () => {
        test('should add round score to player total and round history', () => {
            updatePlayerScore('player1', 100);
            expect(getTotalScore('player1')).toBe(100);
            expect(getPlayerRounds('player1')).toEqual([100]);
        });

        test('should accumulate multiple round scores', () => {
            updatePlayerScore('player1', 100);
            updatePlayerScore('player1', 50);
            updatePlayerScore('player1', 75);
            
            expect(getTotalScore('player1')).toBe(225);
            expect(getPlayerRounds('player1')).toEqual([100, 50, 75]);
        });

        test('should handle multiple players', () => {
            updatePlayerScore('player1', 100);
            updatePlayerScore('player2', 150);
            
            expect(getTotalScore('player1')).toBe(100);
            expect(getTotalScore('player2')).toBe(150);
        });

        test('should throw error for invalid player ID', () => {
            expect(() => updatePlayerScore('', 100)).toThrow('Player ID must be a non-empty string');
            expect(() => updatePlayerScore(null, 100)).toThrow('Player ID must be a non-empty string');
            expect(() => updatePlayerScore(123, 100)).toThrow('Player ID must be a non-empty string');
        });

        test('should throw error for invalid round score', () => {
            expect(() => updatePlayerScore('player1', 'invalid')).toThrow('Round score must be a valid number');
            expect(() => updatePlayerScore('player1', NaN)).toThrow('Round score must be a valid number');
            expect(() => updatePlayerScore('player1', null)).toThrow('Round score must be a valid number');
        });
    });

    describe('getTotalScore', () => {
        test('should return current total for existing player', () => {
            updatePlayerScore('player1', 100);
            updatePlayerScore('player1', 50);
            expect(getTotalScore('player1')).toBe(150);
        });

        test('should return 0 for non-existing player', () => {
            expect(getTotalScore('nonexistent')).toBe(0);
        });

        test('should throw error for invalid player ID', () => {
            expect(() => getTotalScore('')).toThrow('Player ID must be a non-empty string');
            expect(() => getTotalScore(null)).toThrow('Player ID must be a non-empty string');
        });
    });

    describe('getCurrentRound', () => {
        test('should return current round number starting at 1', () => {
            expect(getCurrentRound()).toBe(1);
        });

        test('should increment with nextRound', () => {
            nextRound();
            expect(getCurrentRound()).toBe(2);
            nextRound();
            expect(getCurrentRound()).toBe(3);
        });

        test('should not exceed round 10', () => {
            for (let i = 1; i < 10; i++) {
                nextRound();
            }
            expect(getCurrentRound()).toBe(10);
            expect(() => nextRound()).toThrow('Cannot advance beyond round 10');
        });
    });

    describe('getLeader', () => {
        test('should return player with highest total score', () => {
            updatePlayerScore('player1', 100);
            updatePlayerScore('player2', 150);
            updatePlayerScore('player3', 75);
            
            expect(getLeader()).toBe('player2');
        });

        test('should return first player when tied', () => {
            updatePlayerScore('player1', 100);
            updatePlayerScore('player2', 100);
            
            expect(getLeader()).toBe('player1');
        });

        test('should return null when no players exist', () => {
            expect(getLeader()).toBeNull();
        });

        test('should update leader as scores change', () => {
            updatePlayerScore('player1', 100);
            expect(getLeader()).toBe('player1');
            
            updatePlayerScore('player2', 150);
            expect(getLeader()).toBe('player2');
            
            updatePlayerScore('player1', 100); // total 200
            expect(getLeader()).toBe('player1');
        });
    });

    describe('getPlayerRounds', () => {
        test('should return round-by-round scores', () => {
            updatePlayerScore('player1', 100);
            updatePlayerScore('player1', 50);
            updatePlayerScore('player1', 75);
            
            expect(getPlayerRounds('player1')).toEqual([100, 50, 75]);
        });

        test('should return empty array for non-existing player', () => {
            expect(getPlayerRounds('nonexistent')).toEqual([]);
        });

        test('should return copy of rounds array', () => {
            updatePlayerScore('player1', 100);
            const rounds = getPlayerRounds('player1');
            rounds.push(999);
            
            expect(getPlayerRounds('player1')).toEqual([100]);
        });
    });

    describe('getAllScores', () => {
        test('should return all player score data', () => {
            updatePlayerScore('player1', 100);
            updatePlayerScore('player2', 150);
            
            const allScores = getAllScores();
            expect(allScores).toEqual({
                player1: { total: 100, rounds: [100] },
                player2: { total: 150, rounds: [150] }
            });
        });

        test('should return copy of scores object', () => {
            updatePlayerScore('player1', 100);
            const allScores = getAllScores();
            allScores.player1.total = 999;
            
            expect(getTotalScore('player1')).toBe(100);
        });
    });

    describe('resetScores', () => {
        test('should reset all scores and round data', () => {
            updatePlayerScore('player1', 100);
            updatePlayerScore('player2', 150);
            nextRound();
            
            resetScores();
            
            expect(getTotalScore('player1')).toBe(0);
            expect(getTotalScore('player2')).toBe(0);
            expect(getCurrentRound()).toBe(1);
            expect(getPlayerCount()).toBe(0);
        });
    });

    describe('getPlayerCount', () => {
        test('should return number of players with score data', () => {
            expect(getPlayerCount()).toBe(0);
            
            updatePlayerScore('player1', 100);
            expect(getPlayerCount()).toBe(1);
            
            updatePlayerScore('player2', 150);
            expect(getPlayerCount()).toBe(2);
        });
    });
});