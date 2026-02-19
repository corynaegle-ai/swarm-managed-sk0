/**
 * Test Suite for Score Display Module
 */

import { renderScoreBoard, renderRoundProgress, updateLeaderHighlight } from '../js/scoreDisplay.js';

// Mock scoreManager functions
jest.mock('../js/scoreManager.js', () => ({
    getScores: jest.fn(),
    getCurrentRound: jest.fn(),
    getLeader: jest.fn()
}));

import { getScores, getCurrentRound, getLeader } from '../js/scoreManager.js';

describe('Score Display Module', () => {
    beforeEach(() => {
        // Set up DOM
        document.body.innerHTML = `
            <div id="scoreboard-container"></div>
            <div id="round-progress-container"></div>
        `;
        
        // Reset mocks
        jest.clearAllMocks();
    });
    
    describe('renderScoreBoard', () => {
        test('should render scoreboard with player scores', () => {
            getScores.mockReturnValue({
                'Alice': [10, 15, 8],
                'Bob': [12, 10, 15]
            });
            getLeader.mockReturnValue('Bob');
            
            renderScoreBoard();
            
            const container = document.getElementById('scoreboard-container');
            expect(container.querySelector('.scoreboard-table')).toBeTruthy();
            expect(container.textContent).toContain('Alice');
            expect(container.textContent).toContain('Bob');
            expect(container.textContent).toContain('33'); // Alice total
            expect(container.textContent).toContain('37'); // Bob total
        });
        
        test('should highlight leader', () => {
            getScores.mockReturnValue({
                'Alice': [10, 15],
                'Bob': [12, 10]
            });
            getLeader.mockReturnValue('Alice');
            
            renderScoreBoard();
            
            const leaderRow = document.querySelector('.leader');
            expect(leaderRow).toBeTruthy();
            expect(leaderRow.textContent).toContain('Alice');
        });
    });
    
    describe('renderRoundProgress', () => {
        test('should display current round', () => {
            getCurrentRound.mockReturnValue(3);
            getScores.mockReturnValue({ 'Alice': [10, 15, 8] });
            
            renderRoundProgress();
            
            const container = document.getElementById('round-progress-container');
            expect(container.textContent).toContain('Round 3 of 10');
        });
        
        test('should create expandable breakdown', () => {
            getCurrentRound.mockReturnValue(2);
            getScores.mockReturnValue({
                'Alice': [10, 15],
                'Bob': [12, 10]
            });
            
            renderRoundProgress();
            
            const toggleButton = document.querySelector('.breakdown-toggle');
            const breakdownContent = document.querySelector('.breakdown-content');
            
            expect(toggleButton).toBeTruthy();
            expect(breakdownContent).toBeTruthy();
            expect(breakdownContent.style.display).toBe('none');
        });
    });
    
    describe('updateLeaderHighlight', () => {
        test('should remove previous highlights and add new one', () => {
            // Set up initial state
            document.body.innerHTML = `
                <div id="scoreboard-container">
                    <table class="scoreboard-table">
                        <tr class="leader"><td>Alice</td><td>25</td></tr>
                        <tr><td>Bob</td><td>30</td></tr>
                    </table>
                </div>
            `;
            
            getLeader.mockReturnValue('Bob');
            
            updateLeaderHighlight();
            
            const rows = document.querySelectorAll('.scoreboard-table tr');
            expect(rows[0].classList.contains('leader')).toBe(false);
            expect(rows[1].classList.contains('leader')).toBe(true);
        });
    });
});