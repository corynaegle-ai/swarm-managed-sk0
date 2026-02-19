/**
 * Tests for scoreDisplay.js
 */

// Mock DOM elements
const mockScoreboardContainer = {
    innerHTML: '',
    id: 'scoreboard'
};

const mockProgressContainer = {
    innerHTML: '',
    id: 'round-progress'
};

// Mock document methods
global.document = {
    getElementById: jest.fn((id) => {
        if (id === 'scoreboard') return mockScoreboardContainer;
        if (id === 'round-progress') return mockProgressContainer;
        return null;
    }),
    querySelectorAll: jest.fn(() => []),
    readyState: 'complete'
};

// Mock scoreManager functions
jest.mock('./scoreManager.js', () => ({
    getCurrentScores: jest.fn(() => ({
        'Player 1': 150,
        'Player 2': 120,
        'Player 3': 180
    })),
    getRoundData: jest.fn(() => ({
        currentRound: 3,
        totalRounds: 10,
        roundScores: {
            1: { 'Player 1': 50, 'Player 2': 40, 'Player 3': 60 },
            2: { 'Player 1': 45, 'Player 2': 35, 'Player 3': 55 }
        }
    })),
    getLeader: jest.fn(() => 'Player 3')
}));

const { renderScoreBoard, renderRoundProgress, updateLeaderHighlight } = require('../js/scoreDisplay.js');

describe('Score Display Functions', () => {
    beforeEach(() => {
        mockScoreboardContainer.innerHTML = '';
        mockProgressContainer.innerHTML = '';
    });

    test('renderScoreBoard displays scores correctly', () => {
        renderScoreBoard();
        expect(mockScoreboardContainer.innerHTML).toContain('Player 1');
        expect(mockScoreboardContainer.innerHTML).toContain('150');
        expect(mockScoreboardContainer.innerHTML).toContain('leader');
    });

    test('renderRoundProgress shows round information', () => {
        renderRoundProgress();
        expect(mockProgressContainer.innerHTML).toContain('Round 3 of 10');
        expect(mockProgressContainer.innerHTML).toContain('progress-bar');
    });

    test('updateLeaderHighlight handles missing elements gracefully', () => {
        expect(() => updateLeaderHighlight()).not.toThrow();
    });
});