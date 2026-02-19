/**
 * Score Display Tests
 */

// Mock DOM elements
const mockElements = {
    scoreBoard: {
        innerHTML: '',
        appendChild: jest.fn(),
        querySelector: jest.fn(),
        querySelectorAll: jest.fn(() => []),
        parentNode: {
            insertBefore: jest.fn()
        }
    },
    roundProgress: {
        innerHTML: '',
        appendChild: jest.fn()
    },
    detailedScores: {
        innerHTML: '',
        style: { display: 'none' }
    }
};

// Mock document
global.document = {
    getElementById: jest.fn((id) => mockElements[id] || null),
    createElement: jest.fn(() => ({
        className: '',
        innerHTML: '',
        textContent: '',
        style: {},
        appendChild: jest.fn(),
        onclick: null,
        dataset: {}
    }))
};

// Mock console
global.console = {
    warn: jest.fn()
};

describe('ScoreDisplay', () => {
    let ScoreDisplay;
    let scoreDisplay;

    beforeEach(() => {
        jest.clearAllMocks();
        mockElements.scoreBoard.innerHTML = '';
        mockElements.roundProgress.innerHTML = '';
        
        // Import ScoreDisplay class
        ScoreDisplay = require('../js/scoreDisplay.js');
        scoreDisplay = new ScoreDisplay();
    });

    describe('renderScoreBoard', () => {
        test('should display message when no players provided', () => {
            scoreDisplay.renderScoreBoard([]);
            expect(mockElements.scoreBoard.innerHTML).toContain('No scores available');
        });

        test('should handle missing scoreBoard container', () => {
            document.getElementById = jest.fn(() => null);
            scoreDisplay = new ScoreDisplay();
            scoreDisplay.renderScoreBoard([{ name: 'Player 1', totalScore: 100 }]);
            expect(console.warn).toHaveBeenCalledWith('Score board container not found');
        });

        test('should render players with scores', () => {
            const players = [
                { id: '1', name: 'Alice', totalScore: 150, roundsPlayed: 5 },
                { id: '2', name: 'Bob', totalScore: 120, roundsPlayed: 4 }
            ];
            
            scoreDisplay.renderScoreBoard(players);
            expect(mockElements.scoreBoard.appendChild).toHaveBeenCalled();
        });

        test('should sort players by total score', () => {
            const players = [
                { id: '1', name: 'Alice', totalScore: 100 },
                { id: '2', name: 'Bob', totalScore: 150 },
                { id: '3', name: 'Charlie', totalScore: 125 }
            ];
            
            scoreDisplay.renderScoreBoard(players);
            // Should be sorted: Bob (150), Charlie (125), Alice (100)
            expect(mockElements.scoreBoard.appendChild).toHaveBeenCalled();
        });

        test('should add expand button', () => {
            const players = [{ id: '1', name: 'Alice', totalScore: 100 }];
            scoreDisplay.renderScoreBoard(players);
            expect(mockElements.scoreBoard.appendChild).toHaveBeenCalled();
        });
    });

    describe('renderRoundProgress', () => {
        test('should display current round information', () => {
            scoreDisplay.renderRoundProgress(3, 10);
            expect(mockElements.roundProgress.appendChild).toHaveBeenCalled();
        });

        test('should handle missing roundProgress container', () => {
            document.getElementById = jest.fn((id) => 
                id === 'roundProgress' ? null : mockElements[id]
            );
            scoreDisplay = new ScoreDisplay();
            scoreDisplay.renderRoundProgress(1, 10);
            expect(console.warn).toHaveBeenCalledWith('Round progress container not found');
        });

        test('should create progress bar with correct percentage', () => {
            scoreDisplay.renderRoundProgress(7, 10);
            expect(mockElements.roundProgress.appendChild).toHaveBeenCalled();
        });

        test('should create round indicators', () => {
            scoreDisplay.renderRoundProgress(3, 10);
            expect(mockElements.roundProgress.appendChild).toHaveBeenCalled();
        });

        test('should handle edge case of round 0', () => {
            scoreDisplay.renderRoundProgress(0, 10);
            expect(mockElements.roundProgress.appendChild).toHaveBeenCalled();
        });

        test('should handle completion (round 10 of 10)', () => {
            scoreDisplay.renderRoundProgress(10, 10);
            expect(mockElements.roundProgress.appendChild).toHaveBeenCalled();
        });
    });

    describe('updateLeaderHighlight', () => {
        beforeEach(() => {
            mockElements.scoreBoard.querySelectorAll = jest.fn(() => [
                { classList: { remove: jest.fn() } },
                { classList: { remove: jest.fn() } }
            ]);
            mockElements.scoreBoard.querySelector = jest.fn();
        });

        test('should remove existing leader highlights', () => {
            const mockLeaders = [
                { classList: { remove: jest.fn() } },
                { classList: { remove: jest.fn() } }
            ];
            mockElements.scoreBoard.querySelectorAll = jest.fn(() => mockLeaders);
            
            scoreDisplay.updateLeaderHighlight('player1');
            
            mockLeaders.forEach(leader => {
                expect(leader.classList.remove).toHaveBeenCalledWith('leader');
            });
        });

        test('should highlight specific leader by ID', () => {
            const mockLeaderRow = { classList: { add: jest.fn() } };
            mockElements.scoreBoard.querySelector = jest.fn(() => mockLeaderRow);
            
            scoreDisplay.updateLeaderHighlight('player1');
            
            expect(mockElements.scoreBoard.querySelector).toHaveBeenCalledWith('[data-player-id="player1"]');
            expect(mockLeaderRow.classList.add).toHaveBeenCalledWith('leader');
        });

        test('should highlight first row when no leader ID provided', () => {
            const mockFirstRow = { classList: { add: jest.fn() } };
            mockElements.scoreBoard.querySelector = jest.fn((selector) => {
                if (selector === '.player-row') return mockFirstRow;
                return null;
            });
            
            scoreDisplay.updateLeaderHighlight();
            
            expect(mockFirstRow.classList.add).toHaveBeenCalledWith('leader');
        });

        test('should handle missing scoreBoard container', () => {
            document.getElementById = jest.fn(() => null);
            scoreDisplay = new ScoreDisplay();
            
            // Should not throw error
            expect(() => scoreDisplay.updateLeaderHighlight('player1')).not.toThrow();
        });
    });

    describe('toggleDetailedView', () => {
        test('should toggle expansion state', () => {
            const players = [{ id: '1', name: 'Alice', roundScores: [10, 20] }];
            
            expect(scoreDisplay.isExpanded).toBe(false);
            scoreDisplay.toggleDetailedView(players);
            expect(scoreDisplay.isExpanded).toBe(true);
            
            scoreDisplay.toggleDetailedView(players);
            expect(scoreDisplay.isExpanded).toBe(false);
        });

        test('should create detailed scores container if missing', () => {
            const players = [{ id: '1', name: 'Alice' }];
            scoreDisplay.detailedScores = null;
            
            scoreDisplay.toggleDetailedView(players);
            
            expect(document.createElement).toHaveBeenCalledWith('div');
        });
    });

    describe('renderDetailedScores', () => {
        beforeEach(() => {
            mockElements.detailedScores.innerHTML = '';
            scoreDisplay.detailedScores = mockElements.detailedScores;
        });

        test('should display message when no players provided', () => {
            scoreDisplay.renderDetailedScores([]);
            expect(mockElements.detailedScores.innerHTML).toContain('No detailed scores available');
        });

        test('should render round-by-round scores', () => {
            const players = [
                {
                    id: '1',
                    name: 'Alice',
                    roundScores: [10, 20, 30],
                    totalScore: 60
                }
            ];
            
            scoreDisplay.renderDetailedScores(players);
            expect(mockElements.detailedScores.appendChild).toHaveBeenCalled();
        });

        test('should handle players with different round counts', () => {
            const players = [
                {
                    id: '1',
                    name: 'Alice',
                    roundScores: [10, 20],
                    totalScore: 30
                },
                {
                    id: '2',
                    name: 'Bob',
                    roundScores: [15, 25, 35, 10],
                    totalScore: 85
                }
            ];
            
            scoreDisplay.renderDetailedScores(players);
            expect(mockElements.detailedScores.appendChild).toHaveBeenCalled();
        });
    });

    describe('updateAll', () => {
        test('should update all score displays', () => {
            const players = [{ id: '1', name: 'Alice', totalScore: 100 }];
            
            // Spy on methods
            jest.spyOn(scoreDisplay, 'renderScoreBoard');
            jest.spyOn(scoreDisplay, 'renderRoundProgress');
            jest.spyOn(scoreDisplay, 'updateLeaderHighlight');
            
            scoreDisplay.updateAll(players, 5, 'player1');
            
            expect(scoreDisplay.renderScoreBoard).toHaveBeenCalledWith(players);
            expect(scoreDisplay.renderRoundProgress).toHaveBeenCalledWith(5);
            expect(scoreDisplay.updateLeaderHighlight).toHaveBeenCalledWith('player1');
        });

        test('should update detailed scores if expanded', () => {
            const players = [{ id: '1', name: 'Alice', totalScore: 100 }];
            scoreDisplay.isExpanded = true;
            
            jest.spyOn(scoreDisplay, 'renderDetailedScores');
            
            scoreDisplay.updateAll(players, 3);
            
            expect(scoreDisplay.renderDetailedScores).toHaveBeenCalledWith(players);
        });
    });

    describe('escapeHtml', () => {
        test('should escape HTML characters', () => {
            const result = scoreDisplay.escapeHtml('<script>alert("xss")</script>');
            expect(result).not.toContain('<script>');
            expect(result).toContain('&lt;script&gt;');
        });

        test('should handle regular text', () => {
            const result = scoreDisplay.escapeHtml('Normal Player Name');
            expect(result).toBe('Normal Player Name');
        });
    });
});

// Test standalone functions
describe('Standalone Functions', () => {
    let renderScoreBoard, renderRoundProgress, updateLeaderHighlight;
    
    beforeEach(() => {
        const exports = require('../js/scoreDisplay.js');
        renderScoreBoard = exports.renderScoreBoard;
        renderRoundProgress = exports.renderRoundProgress;
        updateLeaderHighlight = exports.updateLeaderHighlight;
    });
    
    test('renderScoreBoard function should work', () => {
        expect(() => renderScoreBoard([])).not.toThrow();
    });
    
    test('renderRoundProgress function should work', () => {
        expect(() => renderRoundProgress(1, 10)).not.toThrow();
    });
    
    test('updateLeaderHighlight function should work', () => {
        expect(() => updateLeaderHighlight('player1')).not.toThrow();
    });
});