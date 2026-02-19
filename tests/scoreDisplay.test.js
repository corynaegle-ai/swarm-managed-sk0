/**
 * Tests for scoreDisplay.js
 */

import { renderScoreBoard, renderRoundProgress, updateLeaderHighlight } from '../js/scoreDisplay.js';

// Mock scoreManager functions
jest.mock('../js/scoreManager.js', () => ({
    getScores: jest.fn(() => ({
        'Player 1': { total: 150 },
        'Player 2': { total: 200 },
        'Player 3': { total: 120 }
    })),
    getCurrentRound: jest.fn(() => 3),
    getTotalRounds: jest.fn(() => 10),
    getRoundHistory: jest.fn(() => [
        { 'Player 1': 50, 'Player 2': 60, 'Player 3': 40 },
        { 'Player 1': 55, 'Player 2': 70, 'Player 3': 45 },
        { 'Player 1': 45, 'Player 2': 70, 'Player 3': 35 }
    ])
}));

describe('Score Display Functions', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="scoreboard"></div>
            <div id="round-progress"></div>
        `;
    });

    describe('renderScoreBoard', () => {
        test('displays scores for all players', () => {
            renderScoreBoard();
            const scoreboard = document.getElementById('scoreboard');
            expect(scoreboard.innerHTML).toContain('Player 1');
            expect(scoreboard.innerHTML).toContain('Player 2');
            expect(scoreboard.innerHTML).toContain('Player 3');
            expect(scoreboard.innerHTML).toContain('150');
            expect(scoreboard.innerHTML).toContain('200');
            expect(scoreboard.innerHTML).toContain('120');
        });

        test('sorts players by score descending', () => {
            renderScoreBoard();
            const rows = document.querySelectorAll('.score-table tbody tr');
            const firstPlayerName = rows[0].querySelector('.player-name').textContent;
            expect(firstPlayerName).toBe('Player 2'); // Highest score
        });

        test('handles missing container gracefully', () => {
            document.body.innerHTML = '';
            expect(() => renderScoreBoard()).not.toThrow();
        });
    });

    describe('renderRoundProgress', () => {
        test('shows current round and total', () => {
            renderRoundProgress();
            const progress = document.getElementById('round-progress');
            expect(progress.innerHTML).toContain('Round 3 of 10');
        });

        test('displays progress bar', () => {
            renderRoundProgress();
            const progressFill = document.querySelector('.progress-fill');
            expect(progressFill).toBeTruthy();
            expect(progressFill.style.width).toBe('30%');
        });

        test('includes round breakdown toggle', () => {
            renderRoundProgress();
            const toggle = document.querySelector('.toggle-breakdown');
            expect(toggle).toBeTruthy();
            expect(toggle.textContent).toContain('Show Round Details');
        });
    });

    describe('updateLeaderHighlight', () => {
        test('highlights current leader', () => {
            renderScoreBoard();
            updateLeaderHighlight();
            const leaderRow = document.querySelector('.leader');
            expect(leaderRow).toBeTruthy();
            const leaderName = leaderRow.querySelector('.player-name').textContent;
            expect(leaderName).toBe('Player 2');
        });

        test('removes previous leader highlighting', () => {
            renderScoreBoard();
            // Manually add leader class to wrong player
            const rows = document.querySelectorAll('.score-table tbody tr');
            rows[2].classList.add('leader');
            
            updateLeaderHighlight();
            
            const leaders = document.querySelectorAll('.leader');
            expect(leaders.length).toBe(1);
            expect(leaders[0].querySelector('.player-name').textContent).toBe('Player 2');
        });
    });
});