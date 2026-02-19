// Test file for score display functionality
// Note: These are basic structural tests - actual implementation may vary based on scoreManager

import { renderScoreBoard, renderRoundProgress, updateLeaderHighlight } from '../js/scoreDisplay.js';

// Mock DOM elements
beforeEach(() => {
    document.body.innerHTML = `
        <div id="scoreboard-container"></div>
        <div id="round-progress-container"></div>
    `;
});

// Mock scoreManager functions
jest.mock('../js/scoreManager.js', () => ({
    getPlayers: jest.fn(() => ['Player 1', 'Player 2']),
    getPlayerTotalScore: jest.fn((player) => player === 'Player 1' ? 100 : 80),
    getRoundScores: jest.fn(() => [10, 15, 20]),
    getCurrentRound: jest.fn(() => 3),
    getLeader: jest.fn(() => 'Player 1')
}));

describe('Score Display Functions', () => {
    test('renderScoreBoard creates scoreboard table', () => {
        renderScoreBoard();
        
        const container = document.getElementById('scoreboard-container');
        const table = container.querySelector('.scoreboard-table');
        
        expect(table).toBeTruthy();
        expect(container.innerHTML).toContain('Player 1');
        expect(container.innerHTML).toContain('Player 2');
    });
    
    test('renderRoundProgress shows round information', () => {
        renderRoundProgress();
        
        const container = document.getElementById('round-progress-container');
        
        expect(container.innerHTML).toContain('Round 3 of 10');
        expect(container.querySelector('.progress-bar')).toBeTruthy();
    });
    
    test('updateLeaderHighlight adds leader class', () => {
        renderScoreBoard();
        updateLeaderHighlight();
        
        const leaderRow = document.querySelector('.player-row.leader');
        expect(leaderRow).toBeTruthy();
    });
});