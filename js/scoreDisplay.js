/**
 * Score Display Module
 * Handles rendering of score displays in the DOM
 */

const scoreManager = require('./scoreManager.js');

/**
 * Renders the main scoreboard showing total scores for all players
 */
function renderScoreBoard() {
  try {
    const container = document.getElementById('scoreboard-container');
    if (!container) {
      console.warn('Scoreboard container not found');
      return;
    }

    // Get players list with fallback
    const players = (window.playerSetup && window.playerSetup.getPlayers()) || [];
    if (players.length === 0) {
      container.innerHTML = '<div class="no-players">No players added yet</div>';
      return;
    }

    // Build scoreboard HTML
    let html = '<div class="scoreboard">';
    html += '<h3>Current Scores</h3>';
    html += '<table class="score-table">';
    html += '<thead><tr><th>Player</th><th>Total Score</th></tr></thead>';
    html += '<tbody>';

    players.forEach(player => {
      const totalScore = scoreManager.getTotalScore(player.id) || 0;
      const isLeader = scoreManager.getLeader() === player.id;
      const leaderClass = isLeader ? ' leader' : '';
      
      html += `<tr class="player-row${leaderClass}" data-player-id="${player.id}">`;
      html += `<td class="player-name">${player.name}</td>`;
      html += `<td class="player-score">${totalScore}</td>`;
      html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
    
  } catch (error) {
    console.error('Error rendering scoreboard:', error);
  }
}

/**
 * Renders round progress indicator and round breakdown
 */
function renderRoundProgress() {
  try {
    const container = document.getElementById('round-progress-container');
    if (!container) {
      console.warn('Round progress container not found');
      return;
    }

    const currentRound = scoreManager.getCurrentRound() || 1;
    const players = (window.playerSetup && window.playerSetup.getPlayers()) || [];

    let html = '<div class="round-progress">';
    html += `<h3>Round ${currentRound} of 10</h3>`;
    
    // Progress bar
    const progressPercent = (currentRound / 10) * 100;
    html += '<div class="progress-bar">';
    html += `<div class="progress-fill" style="width: ${progressPercent}%"></div>`;
    html += '</div>';

    // Round breakdown (expandable)
    if (players.length > 0) {
      html += '<div class="round-breakdown">';
      html += '<button class="toggle-breakdown" onclick="toggleRoundBreakdown()">Show Round Details</button>';
      html += '<div class="breakdown-content" style="display: none;">';
      html += '<table class="round-table">';
      html += '<thead><tr><th>Player</th>';
      
      // Add round headers
      for (let i = 1; i <= Math.max(currentRound - 1, 1); i++) {
        html += `<th>R${i}</th>`;
      }
      html += '</tr></thead><tbody>';

      // Add player rows
      players.forEach(player => {
        const rounds = scoreManager.getPlayerRounds(player.id) || [];
        html += `<tr><td>${player.name}</td>`;
        
        for (let i = 0; i < Math.max(currentRound - 1, 1); i++) {
          const roundScore = rounds[i] || '-';
          html += `<td>${roundScore}</td>`;
        }
        html += '</tr>';
      });

      html += '</tbody></table></div></div>';
    }

    html += '</div>';
    container.innerHTML = html;
    
  } catch (error) {
    console.error('Error rendering round progress:', error);
  }
}

/**
 * Updates the visual highlighting of the current leader
 */
function updateLeaderHighlight() {
  try {
    // Remove existing leader highlights
    const existingLeaders = document.querySelectorAll('.player-row.leader');
    existingLeaders.forEach(row => {
      row.classList.remove('leader');
    });

    // Add highlight to current leader
    const leaderId = scoreManager.getLeader();
    if (leaderId) {
      const leaderRow = document.querySelector(`[data-player-id="${leaderId}"]`);
      if (leaderRow) {
        leaderRow.classList.add('leader');
      }
    }
    
  } catch (error) {
    console.error('Error updating leader highlight:', error);
  }
}

/**
 * Toggles the visibility of the round breakdown table
 */
function toggleRoundBreakdown() {
  try {
    const content = document.querySelector('.breakdown-content');
    const button = document.querySelector('.toggle-breakdown');
    
    if (content && button) {
      const isVisible = content.style.display !== 'none';
      content.style.display = isVisible ? 'none' : 'block';
      button.textContent = isVisible ? 'Show Round Details' : 'Hide Round Details';
    }
  } catch (error) {
    console.error('Error toggling round breakdown:', error);
  }
}

// Make functions available globally for HTML onclick handlers
if (typeof window !== 'undefined') {
  window.toggleRoundBreakdown = toggleRoundBreakdown;
}

// Export functions
module.exports = {
  renderScoreBoard,
  renderRoundProgress,
  updateLeaderHighlight
};