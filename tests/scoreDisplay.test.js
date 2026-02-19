/**
 * Tests for Score Display Module
 */

const scoreDisplay = require('../js/scoreDisplay.js');

// Mock DOM elements
global.document = {
  getElementById: jest.fn(),
  querySelector: jest.fn(),
  querySelectorAll: jest.fn()
};

// Mock scoreManager
jest.mock('../js/scoreManager.js', () => ({
  getTotalScore: jest.fn(),
  getPlayerRounds: jest.fn(),
  getCurrentRound: jest.fn(),
  getLeader: jest.fn()
}));

const scoreManager = require('../js/scoreManager.js');

describe('Score Display Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.window = {
      playerSetup: {
        getPlayers: jest.fn()
      }
    };
  });

  describe('renderScoreBoard', () => {
    test('should render scoreboard with player scores', () => {
      const mockContainer = { innerHTML: '' };
      document.getElementById.mockReturnValue(mockContainer);
      
      global.window.playerSetup.getPlayers.mockReturnValue([
        { id: '1', name: 'Player 1' },
        { id: '2', name: 'Player 2' }
      ]);
      
      scoreManager.getTotalScore.mockImplementation((id) => {
        return id === '1' ? 100 : 50;
      });
      
      scoreManager.getLeader.mockReturnValue('1');

      scoreDisplay.renderScoreBoard();

      expect(mockContainer.innerHTML).toContain('Player 1');
      expect(mockContainer.innerHTML).toContain('Player 2');
      expect(mockContainer.innerHTML).toContain('100');
      expect(mockContainer.innerHTML).toContain('50');
      expect(mockContainer.innerHTML).toContain('leader');
    });

    test('should handle missing container gracefully', () => {
      document.getElementById.mockReturnValue(null);
      expect(() => scoreDisplay.renderScoreBoard()).not.toThrow();
    });

    test('should handle no players', () => {
      const mockContainer = { innerHTML: '' };
      document.getElementById.mockReturnValue(mockContainer);
      global.window.playerSetup.getPlayers.mockReturnValue([]);

      scoreDisplay.renderScoreBoard();

      expect(mockContainer.innerHTML).toContain('No players added yet');
    });
  });

  describe('renderRoundProgress', () => {
    test('should render round progress with current round', () => {
      const mockContainer = { innerHTML: '' };
      document.getElementById.mockReturnValue(mockContainer);
      scoreManager.getCurrentRound.mockReturnValue(3);
      global.window.playerSetup.getPlayers.mockReturnValue([]);

      scoreDisplay.renderRoundProgress();

      expect(mockContainer.innerHTML).toContain('Round 3 of 10');
      expect(mockContainer.innerHTML).toContain('30%');
    });

    test('should handle missing container gracefully', () => {
      document.getElementById.mockReturnValue(null);
      expect(() => scoreDisplay.renderRoundProgress()).not.toThrow();
    });
  });

  describe('updateLeaderHighlight', () => {
    test('should update leader highlighting', () => {
      const mockLeaderRows = [
        { classList: { remove: jest.fn() } }
      ];
      const mockNewLeader = { classList: { add: jest.fn() } };
      
      document.querySelectorAll.mockReturnValue(mockLeaderRows);
      document.querySelector.mockReturnValue(mockNewLeader);
      scoreManager.getLeader.mockReturnValue('player1');

      scoreDisplay.updateLeaderHighlight();

      expect(mockLeaderRows[0].classList.remove).toHaveBeenCalledWith('leader');
      expect(mockNewLeader.classList.add).toHaveBeenCalledWith('leader');
    });

    test('should handle no leader gracefully', () => {
      document.querySelectorAll.mockReturnValue([]);
      scoreManager.getLeader.mockReturnValue(null);
      
      expect(() => scoreDisplay.updateLeaderHighlight()).not.toThrow();
    });
  });
});