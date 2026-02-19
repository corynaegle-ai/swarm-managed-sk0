/**
 * Tests for scoreDisplay.js
 */

import { renderScoreBoard, renderRoundProgress, updateLeaderHighlight, refreshScoreDisplays } from '../js/scoreDisplay.js';

// Mock scoreManager functions
jest.mock('../js/scoreManager.js', () => ({
    getCurrentScores: jest.fn(),
    getLeaderboard: jest.fn(),
    getCurrentRound: jest.fn(),
    getRoundScores: jest.fn(),
    getTotalRounds: jest.fn()
}));

import { getCurrentScores, getLeaderboard, getCurrentRound, getRoundScores, getTotalRounds } from '../js/scoreManager.js';

describe('Score Display Functions', () => {
    let mockContainer, mockProgressContainer;
    
    beforeEach(() => {
        // Setup DOM containers
        document.body.innerHTML = `
            <div id="scoreboard-container"></div>
            <div id="round-progress-container"></div>
        `;
        
        mockContainer = document.getElementById('scoreboard-container');
        mockProgressContainer = document.getElementById('round-progress-container');
        
        // Reset mocks
        jest.clearAllMocks();
        
        // Default mock implementations
        getCurrentScores.mockReturnValue({
            'Player1': 100,
            'Player2': 85,
            'Player3': 120
        });
        
        getLeaderboard.mockReturnValue([
            { name: 'Player3', score: 120 },
            { name: 'Player1', score: 100 },
            { name: 'Player2', score: 85 }
        ]);
        
        getCurrentRound.mockReturnValue(3);
        getTotalRounds.mockReturnValue(10);
        
        getRoundScores.mockReturnValue({
            'Player1': { 1: 50, 2: 50 },
            'Player2': { 1: 40, 2: 45 },
            'Player3': { 1: 60, 2: 60 }
        });
    });
    
    describe('renderScoreBoard', () => {
        test('should render scoreboard with player scores', () => {
            renderScoreBoard();
            
            expect(mockContainer.innerHTML).toContain('Current Scores');
            expect(mockContainer.innerHTML).toContain('Player1');
            expect(mockContainer.innerHTML).toContain('Player2');
            expect(mockContainer.innerHTML).toContain('Player3');
            expect(mockContainer.innerHTML).toContain('100');
            expect(mockContainer.innerHTML).toContain('85');
            expect(mockContainer.innerHTML).toContain('120');
        });
        
        test('should highlight leader', () => {
            renderScoreBoard();
            
            const leaderRow = mockContainer.querySelector('[data-player="Player3"]');
            expect(leaderRow).toHaveClass('leader');
        });
        
        test('should handle missing container gracefully', () => {
            document.getElementById('scoreboard-container').remove();
            
            expect(() => renderScoreBoard()).not.toThrow();
        });
        
        test('should display no scores message when no data', () => {
            getCurrentScores.mockReturnValue({});
            getLeaderboard.mockReturnValue([]);
            
            renderScoreBoard();
            
            expect(mockContainer.innerHTML).toContain('No scores available');
        });
    });
    
    describe('renderRoundProgress', () => {
        test('should render round progress indicator', () => {
            renderRoundProgress();
            
            expect(mockProgressContainer.innerHTML).toContain('Round 3 of 10');
            expect(mockProgressContainer.innerHTML).toContain('progress-bar');
            expect(mockProgressContainer.innerHTML).toContain('progress-fill');
        });
        
        test('should calculate correct progress percentage', () => {
            renderRoundProgress();
            
            const progressFill = mockProgressContainer.querySelector('.progress-fill');
            expect(progressFill.style.width).toBe('20%'); // (3-1)/10 * 100 = 20%
        });
        
        test('should include round breakdown', () => {
            renderRoundProgress();
            
            expect(mockProgressContainer.innerHTML).toContain('Show Round Details');
            expect(mockProgressContainer.innerHTML).toContain('rounds-table');
        });
        
        test('should handle missing container gracefully', () => {
            document.getElementById('round-progress-container').remove();
            
            expect(() => renderRoundProgress()).not.toThrow();
        });
    });
    
    describe('updateLeaderHighlight', () => {
        test('should add leader class to current leader', () => {
            // First render scoreboard
            renderScoreBoard();
            
            // Then update highlight
            updateLeaderHighlight();
            
            const leaderRow = mockContainer.querySelector('[data-player="Player3"]');
            expect(leaderRow).toHaveClass('leader');
        });
        
        test('should remove leader class from previous leader', () => {
            renderScoreBoard();
            
            // Change leader
            getLeaderboard.mockReturnValue([
                { name: 'Player1', score: 150 },
                { name: 'Player3', score: 120 },
                { name: 'Player2', score: 85 }
            ]);
            
            updateLeaderHighlight();
            
            const oldLeader = mockContainer.querySelector('[data-player="Player3"]');
            const newLeader = mockContainer.querySelector('[data-player="Player1"]');
            
            expect(oldLeader).not.toHaveClass('leader');
            expect(newLeader).toHaveClass('leader');
        });
        
        test('should handle empty leaderboard', () => {
            getLeaderboard.mockReturnValue([]);
            
            expect(() => updateLeaderHighlight()).not.toThrow();
        });
    });
    
    describe('refreshScoreDisplays', () => {
        test('should call all render functions', () => {
            const renderScoreBoardSpy = jest.spyOn(require('../js/scoreDisplay.js'), 'renderScoreBoard');
            const renderRoundProgressSpy = jest.spyOn(require('../js/scoreDisplay.js'), 'renderRoundProgress');
            const updateLeaderHighlightSpy = jest.spyOn(require('../js/scoreDisplay.js'), 'updateLeaderHighlight');
            
            refreshScoreDisplays();
            
            expect(renderScoreBoardSpy).toHaveBeenCalled();
            expect(renderRoundProgressSpy).toHaveBeenCalled();
            expect(updateLeaderHighlightSpy).toHaveBeenCalled();
        });
    });
    
    describe('Interactive Features', () => {
        test('should toggle round breakdown when button clicked', () => {
            renderRoundProgress();
            
            const button = mockProgressContainer.querySelector('.toggle-breakdown');
            const content = document.getElementById('breakdown-content');
            
            expect(content.style.display).toBe('none');
            
            // Simulate click
            window.toggleRoundBreakdown();
            
            expect(content.style.display).toBe('block');
            expect(button.textContent).toBe('Hide Round Details');
        });
        
        test('should make score rows clickable for player details', () => {
            renderScoreBoard();
            
            const playerRow = mockContainer.querySelector('[data-player="Player1"]');
            expect(playerRow).toBeTruthy();
            
            // Simulate click
            playerRow.click();
            
            const details = mockContainer.querySelector('.player-details');
            expect(details).toBeTruthy();
            expect(details.innerHTML).toContain('Player1 - Round by Round');
        });
    });
    
    describe('Error Handling', () => {
        test('should handle scoreManager errors gracefully', () => {
            getCurrentScores.mockImplementation(() => {
                throw new Error('Score manager error');
            });
            
            expect(() => renderScoreBoard()).not.toThrow();
        });
        
        test('should handle DOM manipulation errors', () => {
            // Remove container after initial setup
            mockContainer.remove();
            
            expect(() => renderScoreBoard()).not.toThrow();
            expect(() => renderRoundProgress()).not.toThrow();
            expect(() => updateLeaderHighlight()).not.toThrow();
        });
    });
    
    describe('Responsive Behavior', () => {
        test('should handle dynamic grid columns for rounds table', () => {
            // Test with different numbers of players
            getCurrentScores.mockReturnValue({
                'Player1': 100,
                'Player2': 85
            });
            
            getLeaderboard.mockReturnValue([
                { name: 'Player1', score: 100 },
                { name: 'Player2', score: 85 }
            ]);
            
            renderRoundProgress();
            
            const roundsTable = mockProgressContainer.querySelector('.rounds-table');
            expect(roundsTable).toBeTruthy();
        });
    });
});