// Score Display Tests

// Mock DOM environment
const mockDOM = {
  elements: {},
  getElementById: function(id) {
    return this.elements[id] || null;
  },
  querySelector: function(selector) {
    return this.elements[selector] || null;
  },
  querySelectorAll: function(selector) {
    return [];
  },
  addEventListener: function(event, callback) {
    // Mock event listener
  }
};

// Mock global objects for testing
global.document = mockDOM;
global.window = {};

// Import the module
const scoreDisplay = require('../js/scoreDisplay.js');

describe('Score Display Functions', function() {
  beforeEach(function() {
    // Reset mock DOM
    mockDOM.elements = {
      'scoreboard': { innerHTML: '' },
      'round-progress': { innerHTML: '' },
      'breakdown-content': { style: { display: 'none' } }
    };
  });

  describe('renderScoreBoard', function() {
    it('should render scoreboard with player scores', function() {
      const container = { innerHTML: '' };
      mockDOM.elements['scoreboard'] = container;
      
      scoreDisplay.renderScoreBoard();
      
      expect(container.innerHTML).toContain('Current Scores');
      expect(container.innerHTML).toContain('Player');
      expect(container.innerHTML).toContain('Total Score');
    });

    it('should handle missing container gracefully', function() {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockDOM.elements['scoreboard'] = null;
      
      scoreDisplay.renderScoreBoard();
      
      expect(consoleSpy).toHaveBeenCalledWith('Scoreboard container not found');
      consoleSpy.mockRestore();
    });
  });

  describe('renderRoundProgress', function() {
    it('should render round progress with current round info', function() {
      const container = { innerHTML: '' };
      mockDOM.elements['round-progress'] = container;
      
      scoreDisplay.renderRoundProgress();
      
      expect(container.innerHTML).toContain('Round 1 of 10');
      expect(container.innerHTML).toContain('progress-fill');
      expect(container.innerHTML).toContain('Show Round-by-Round Scores');
    });

    it('should handle missing container gracefully', function() {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockDOM.elements['round-progress'] = null;
      
      scoreDisplay.renderRoundProgress();
      
      expect(consoleSpy).toHaveBeenCalledWith('Round progress container not found');
      consoleSpy.mockRestore();
    });
  });

  describe('updateLeaderHighlight', function() {
    it('should remove existing leader classes and add to current leader', function() {
      const mockElements = [
        { classList: { remove: jest.fn() } },
        { classList: { remove: jest.fn() } }
      ];
      
      const mockLeaderElement = { classList: { add: jest.fn() } };
      
      mockDOM.querySelectorAll = jest.fn().mockReturnValue(mockElements);
      mockDOM.querySelector = jest.fn().mockReturnValue(mockLeaderElement);
      
      scoreDisplay.updateLeaderHighlight();
      
      // Verify old leaders had class removed
      mockElements.forEach(el => {
        expect(el.classList.remove).toHaveBeenCalledWith('leader');
      });
      
      // Verify new leader has class added
      expect(mockLeaderElement.classList.add).toHaveBeenCalledWith('leader');
    });
  });

  describe('Game State Functions', function() {
    it('should get players list', function() {
      const players = scoreDisplay.getPlayers();
      expect(players).toBeInstanceOf(Array);
      expect(players.length).toBeGreaterThan(0);
      expect(players[0]).toHaveProperty('name');
      expect(players[0]).toHaveProperty('id');
    });

    it('should get player total score', function() {
      const players = scoreDisplay.getPlayers();
      const score = scoreDisplay.getPlayerTotalScore(players[0].id);
      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should get current round', function() {
      const round = scoreDisplay.getCurrentRound();
      expect(typeof round).toBe('number');
      expect(round).toBeGreaterThanOrEqual(1);
      expect(round).toBeLessThanOrEqual(10);
    });

    it('should get current leader', function() {
      const leader = scoreDisplay.getLeader();
      expect(leader).toHaveProperty('name');
      expect(leader).toHaveProperty('id');
    });

    it('should set and retrieve round scores', function() {
      const players = scoreDisplay.getPlayers();
      const playerId = players[0].id;
      const testScore = 75;
      
      scoreDisplay.setPlayerRoundScore(playerId, 1, testScore);
      const roundScores = scoreDisplay.getRoundScores(1);
      
      expect(roundScores[playerId]).toBe(testScore);
    });

    it('should advance to next round', function() {
      const initialRound = scoreDisplay.getCurrentRound();
      scoreDisplay.nextRound();
      const newRound = scoreDisplay.getCurrentRound();
      
      expect(newRound).toBe(initialRound + 1);
    });
  });

  describe('Integration Tests', function() {
    it('should update all displays when scores change', function() {
      const scoreboardContainer = { innerHTML: '' };
      const progressContainer = { innerHTML: '' };
      
      mockDOM.elements['scoreboard'] = scoreboardContainer;
      mockDOM.elements['round-progress'] = progressContainer;
      mockDOM.querySelectorAll = jest.fn().mockReturnValue([]);
      mockDOM.querySelector = jest.fn().mockReturnValue(null);
      
      // Add some scores and render
      const players = scoreDisplay.getPlayers();
      scoreDisplay.setPlayerRoundScore(players[0].id, 1, 50);
      scoreDisplay.setPlayerRoundScore(players[1].id, 1, 75);
      
      scoreDisplay.renderScoreBoard();
      scoreDisplay.renderRoundProgress();
      scoreDisplay.updateLeaderHighlight();
      
      expect(scoreboardContainer.innerHTML).toContain('50');
      expect(scoreboardContainer.innerHTML).toContain('75');
      expect(progressContainer.innerHTML).toContain('Round 1 of 10');
    });
  });
});

// Test helper to verify DOM structure
function verifyDOMStructure(html, expectedElements) {
  expectedElements.forEach(element => {
    expect(html).toContain(element);
  });
}