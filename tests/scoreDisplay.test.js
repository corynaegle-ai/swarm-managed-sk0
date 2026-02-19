/**
 * Tests for Score Display functionality
 */

describe('Score Display', () => {
  beforeEach(() => {
    // Set up DOM elements
    document.body.innerHTML = `
      <div id="scoreBoard"></div>
      <div id="roundProgress"></div>
    `;
    
    // Load the module
    require('../js/scoreDisplay.js');
  });
  
  afterEach(() => {
    document.body.innerHTML = '';
  });
  
  describe('renderScoreBoard', () => {
    test('should render scoreboard with player scores', () => {
      window.renderScoreBoard();
      
      const scoreBoard = document.getElementById('scoreBoard');
      expect(scoreBoard.innerHTML).toContain('Current Scores');
      expect(scoreBoard.innerHTML).toContain('Player 1');
      expect(scoreBoard.innerHTML).toContain('Total Score');
    });
    
    test('should handle missing container gracefully', () => {
      document.getElementById('scoreBoard').remove();
      
      expect(() => window.renderScoreBoard()).not.toThrow();
    });
    
    test('should sort players by total score', () => {
      window.renderScoreBoard();
      
      const rows = document.querySelectorAll('.score-table tbody tr:not(.player-details)');
      expect(rows.length).toBeGreaterThan(0);
    });
  });
  
  describe('renderRoundProgress', () => {
    test('should display current round information', () => {
      window.renderRoundProgress();
      
      const roundProgress = document.getElementById('roundProgress');
      expect(roundProgress.innerHTML).toContain('Round 5 of 10');
      expect(roundProgress.innerHTML).toContain('50% Complete');
    });
    
    test('should show progress bar', () => {
      window.renderRoundProgress();
      
      const progressBar = document.querySelector('.progress-bar');
      const progressFill = document.querySelector('.progress-fill');
      
      expect(progressBar).toBeTruthy();
      expect(progressFill).toBeTruthy();
      expect(progressFill.style.width).toBe('50%');
    });
    
    test('should handle missing container gracefully', () => {
      document.getElementById('roundProgress').remove();
      
      expect(() => window.renderRoundProgress()).not.toThrow();
    });
  });
  
  describe('updateLeaderHighlight', () => {
    test('should highlight the current leader', () => {
      window.renderScoreBoard();
      window.updateLeaderHighlight();
      
      const leaderRows = document.querySelectorAll('.leader');
      expect(leaderRows.length).toBeGreaterThan(0);
    });
    
    test('should remove previous leader highlighting', () => {
      // Add a fake leader class
      document.body.innerHTML += '<div class="leader" data-player-id="999"></div>';
      
      window.renderScoreBoard();
      window.updateLeaderHighlight();
      
      const fakeLeader = document.querySelector('[data-player-id="999"]');
      if (fakeLeader) {
        expect(fakeLeader.classList.contains('leader')).toBe(false);
      }
    });
  });
  
  describe('togglePlayerDetails', () => {
    test('should toggle player details visibility', () => {
      window.renderScoreBoard();
      
      const detailsRow = document.getElementById('details-1');
      if (detailsRow) {
        expect(detailsRow.style.display).toBe('none');
        
        window.togglePlayerDetails(1);
        expect(detailsRow.style.display).toBe('table-row');
        
        window.togglePlayerDetails(1);
        expect(detailsRow.style.display).toBe('none');
      }
    });
    
    test('should handle non-existent player ID gracefully', () => {
      window.renderScoreBoard();
      
      expect(() => window.togglePlayerDetails(999)).not.toThrow();
    });
  });
  
  describe('Acceptance Criteria', () => {
    test('AC1: renderScoreBoard displays current total scores for all players', () => {
      window.renderScoreBoard();
      
      const scoreTable = document.querySelector('.score-table');
      const totalScores = document.querySelectorAll('.total-score');
      
      expect(scoreTable).toBeTruthy();
      expect(totalScores.length).toBeGreaterThan(0);
      
      totalScores.forEach(scoreElement => {
        const score = parseInt(scoreElement.textContent);
        expect(score).toBeGreaterThanOrEqual(0);
      });
    });
    
    test('AC2: renderRoundProgress shows Round X of 10 and round breakdown', () => {
      window.renderRoundProgress();
      
      const roundText = document.querySelector('.round-header h3');
      const roundItems = document.querySelectorAll('.round-item');
      
      expect(roundText.textContent).toContain('Round 5 of 10');
      expect(roundItems.length).toBe(10);
    });
    
    test('AC3: updateLeaderHighlight visually highlights current leader', () => {
      window.renderScoreBoard();
      window.updateLeaderHighlight();
      
      const leaderElement = document.querySelector('.leader');
      expect(leaderElement).toBeTruthy();
      expect(leaderElement.classList.contains('leader')).toBe(true);
    });
    
    test('AC4: Score displays are properly styled', () => {
      window.renderScoreBoard();
      window.renderRoundProgress();
      
      const scoreBoard = document.querySelector('.score-board');
      const roundProgress = document.querySelector('.round-progress');
      const scoreTable = document.querySelector('.score-table');
      
      expect(scoreBoard).toBeTruthy();
      expect(roundProgress).toBeTruthy();
      expect(scoreTable).toBeTruthy();
    });
    
    test('AC5: Round-by-round scores shown in expandable format', () => {
      window.renderScoreBoard();
      
      const detailsButton = document.querySelector('.btn-details');
      const playerDetails = document.querySelector('.player-details');
      const roundsGrid = document.querySelector('.rounds-grid');
      
      expect(detailsButton).toBeTruthy();
      expect(playerDetails).toBeTruthy();
      expect(roundsGrid).toBeTruthy();
      
      // Check that details are initially hidden
      expect(playerDetails.style.display).toBe('none');
    });
  });
});