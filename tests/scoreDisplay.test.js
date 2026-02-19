/**
 * Test Suite for Score Display Module
 */

// Mock DOM elements
const mockDOM = () => {
    const scoreboard = document.createElement('div');
    scoreboard.id = 'scoreboard';
    document.body.appendChild(scoreboard);
    
    const roundProgress = document.createElement('div');
    roundProgress.id = 'round-progress';
    document.body.appendChild(roundProgress);
    
    return { scoreboard, roundProgress };
};

// Mock score manager functions
const mockScoreManager = {
    getTotalScores: () => ({
        'Player 1': 2450,
        'Player 2': 1980,
        'Player 3': 2100,
        'Player 4': 1750
    }),
    getCurrentRound: () => 3,
    getRoundScores: () => ({
        1: { 'Player 1': 450, 'Player 2': 380, 'Player 3': 420, 'Player 4': 350 },
        2: { 'Player 1': 520, 'Player 2': 480, 'Player 3': 410, 'Player 4': 390 },
        3: { 'Player 1': 380, 'Player 2': 440, 'Player 3': 460, 'Player 4': 320 }
    }),
    getLeader: () => 'Player 1'
};

// Set up global functions
Object.assign(global, mockScoreManager);

describe('Score Display Module', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        mockDOM();
    });
    
    describe('renderScoreBoard', () => {
        test('should render scoreboard with all players', () => {
            const { renderScoreBoard } = require('../js/scoreDisplay.js');
            
            renderScoreBoard();
            
            const scoreboard = document.getElementById('scoreboard');
            const table = scoreboard.querySelector('.scoreboard-table');
            const rows = table.querySelectorAll('tbody tr');
            
            expect(table).toBeTruthy();
            expect(rows).toHaveLength(4);
        });
        
        test('should highlight leader with .leader class', () => {
            const { renderScoreBoard } = require('../js/scoreDisplay.js');
            
            renderScoreBoard();
            
            const leaderRow = document.querySelector('.leader');
            expect(leaderRow).toBeTruthy();
        });
        
        test('should sort players by score descending', () => {
            const { renderScoreBoard } = require('../js/scoreDisplay.js');
            
            renderScoreBoard();
            
            const rows = document.querySelectorAll('.scoreboard-table tbody tr');
            const firstPlayerScore = parseInt(
                rows[0].querySelector('td:last-child').textContent.replace(/,/g, '')
            );
            const lastPlayerScore = parseInt(
                rows[rows.length - 1].querySelector('td:last-child').textContent.replace(/,/g, '')
            );
            
            expect(firstPlayerScore).toBeGreaterThan(lastPlayerScore);
        });
    });
    
    describe('renderRoundProgress', () => {
        test('should display current round information', () => {
            const { renderRoundProgress } = require('../js/scoreDisplay.js');
            
            renderRoundProgress();
            
            const roundHeader = document.querySelector('.round-header h3');
            expect(roundHeader.textContent).toContain('Round 3 of 10');
        });
        
        test('should create progress bar with correct width', () => {
            const { renderRoundProgress } = require('../js/scoreDisplay.js');
            
            renderRoundProgress();
            
            const progressFill = document.querySelector('.progress-fill');
            expect(progressFill.style.width).toBe('30%'); // 3/10 * 100%
        });
        
        test('should create collapsible round breakdown', () => {
            const { renderRoundProgress } = require('../js/scoreDisplay.js');
            
            renderRoundProgress();
            
            const toggle = document.querySelector('.breakdown-toggle');
            const content = document.querySelector('.breakdown-content');
            
            expect(toggle).toBeTruthy();
            expect(content).toBeTruthy();
            expect(content.style.display).toBe('none');
        });
        
        test('should toggle breakdown visibility when clicked', () => {
            const { renderRoundProgress } = require('../js/scoreDisplay.js');
            
            renderRoundProgress();
            
            const toggle = document.querySelector('.breakdown-toggle');
            const content = document.querySelector('.breakdown-content');
            
            toggle.click();
            expect(content.style.display).toBe('block');
            
            toggle.click();
            expect(content.style.display).toBe('none');
        });
    });
    
    describe('updateLeaderHighlight', () => {
        test('should remove existing leader highlights', () => {
            const { renderScoreBoard, updateLeaderHighlight } = require('../js/scoreDisplay.js');
            
            renderScoreBoard();
            
            // Manually add leader class to test removal
            const rows = document.querySelectorAll('.scoreboard-table tbody tr');
            rows.forEach(row => row.classList.add('leader'));
            
            updateLeaderHighlight();
            
            const leaderRows = document.querySelectorAll('.leader');
            expect(leaderRows).toHaveLength(1); // Only one leader should remain
        });
        
        test('should highlight current leader', () => {
            const { renderScoreBoard, updateLeaderHighlight } = require('../js/scoreDisplay.js');
            
            renderScoreBoard();
            updateLeaderHighlight();
            
            const leaderRow = document.querySelector('.leader');
            const playerName = leaderRow.querySelector('td:first-child').textContent;
            
            expect(leaderRow).toBeTruthy();
            expect(playerName).toBe('Player 1'); // Highest score
        });
        
        test('should handle ties by highlighting all leaders', () => {
            // Mock tied scores
            global.getTotalScores = () => ({
                'Player 1': 2000,
                'Player 2': 2000,
                'Player 3': 1500,
                'Player 4': 1500
            });
            
            const { renderScoreBoard, updateLeaderHighlight } = require('../js/scoreDisplay.js');
            
            renderScoreBoard();
            updateLeaderHighlight();
            
            const leaderRows = document.querySelectorAll('.leader');
            expect(leaderRows).toHaveLength(2); // Two tied leaders
        });
    });
    
    describe('Error Handling', () => {
        test('should handle missing DOM containers gracefully', () => {
            document.body.innerHTML = ''; // Remove containers
            
            const { renderScoreBoard, renderRoundProgress } = require('../js/scoreDisplay.js');
            
            expect(() => renderScoreBoard()).not.toThrow();
            expect(() => renderRoundProgress()).not.toThrow();
        });
        
        test('should handle missing score manager functions', () => {
            // Remove mock functions
            delete global.getTotalScores;
            delete global.getCurrentRound;
            
            const { renderScoreBoard, renderRoundProgress } = require('../js/scoreDisplay.js');
            
            expect(() => renderScoreBoard()).not.toThrow();
            expect(() => renderRoundProgress()).not.toThrow();
        });
    });
});

describe('CSS Classes and Styling', () => {
    test('should apply correct CSS classes to elements', () => {
        mockDOM();
        const { renderScoreBoard, renderRoundProgress } = require('../js/scoreDisplay.js');
        
        renderScoreBoard();
        renderRoundProgress();
        
        expect(document.querySelector('.scoreboard-table')).toBeTruthy();
        expect(document.querySelector('.progress-bar')).toBeTruthy();
        expect(document.querySelector('.progress-fill')).toBeTruthy();
        expect(document.querySelector('.breakdown-toggle')).toBeTruthy();
        expect(document.querySelector('.breakdown-content')).toBeTruthy();
    });
});