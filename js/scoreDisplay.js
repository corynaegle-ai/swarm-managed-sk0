/**
 * Score Display Module
 * Handles rendering of score displays in the DOM
 */

// Import functions from scoreManager - create stub if it doesn't exist
try {
  var { getPlayers, getPlayerTotalScore, getRoundScores, getCurrentRound, getLeader } = await import('./scoreManager.js');
} catch (error) {
  console.warn('scoreManager.js not found, using stub functions');
  // Stub functions for testing in isolation
  var getPlayers = () => ['Player 1', 'Player 2', 'Player 3'];
  var getPlayerTotalScore = (player) => Math.floor(Math.random() * 100);
  var getRoundScores = (player) => Array.from({length: 10}, () => Math.floor(Math.random() * 20));
  var getCurrentRound = () => 3;
  var getLeader = () => 'Player 1';
}

/**
 * Renders the main scoreboard displaying current total scores for all players
 * Targets DOM container with id 'scoreboard'
 */
export function renderScoreBoard() {
  const container = document.getElementById('scoreboard');
  if (!container) {
    console.error('Scoreboard container not found');
    return;
  }

  try {
    const players = getPlayers();
    const leader = getLeader();
    
    let html = '<div class="score-table-container">';
    html += '<h2>Scoreboard</h2>';
    html += '<table class="score-table">';
    html += '<thead><tr><th>Player</th><th>Total Score</th></tr></thead>';
    html += '<tbody>';
    
    players.forEach(player => {
      const totalScore = getPlayerTotalScore(player);
      const isLeader = player === leader;
      html += `<tr class="${isLeader ? 'leader' : ''}">`;
      html += `<td class="player-name">${player}</td>`;
      html += `<td class="player-score">${totalScore}</td>`;
      html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
    
  } catch (error) {
    console.error('Error rendering scoreboard:', error);
    container.innerHTML = '<div class="error">Error loading scoreboard</div>';
  }
}

/**
 * Renders round progress indicator and round-by-round score breakdown
 * Targets DOM container with id 'round-progress'
 */
export function renderRoundProgress() {
  const container = document.getElementById('round-progress');
  if (!container) {
    console.error('Round progress container not found');
    return;
  }

  try {
    const currentRound = getCurrentRound();
    const players = getPlayers();
    
    let html = '<div class="round-progress-container">';
    html += `<h3>Round ${currentRound} of 10</h3>`;
    html += '<div class="progress-bar">';
    html += '<div class="progress-fill" style="width: ' + (currentRound * 10) + '%"></div>';
    html += '</div>';
    
    html += '<div class="round-breakdown">';
    html += '<h4>Round-by-Round Scores</h4>';
    
    players.forEach(player => {
      const roundScores = getRoundScores(player);
      html += '<div class="player-rounds">';
      html += `<button class="toggle-rounds" onclick="togglePlayerRounds('${player}')">`;
      html += `${player} <span class="toggle-icon">▼</span></button>`;
      html += `<div class="rounds-detail" id="rounds-${player.replace(/\s+/g, '-')}" style="display: none;">`;
      html += '<div class="rounds-grid">';
      
      roundScores.forEach((score, index) => {
        const roundNum = index + 1;
        const isCurrentRound = roundNum === currentRound;
        const isFutureRound = roundNum > currentRound;
        html += `<div class="round-score ${isCurrentRound ? 'current' : ''} ${isFutureRound ? 'future' : ''}">`;
        html += `<span class="round-number">R${roundNum}</span>`;
        html += `<span class="score-value">${isFutureRound ? '-' : score}</span>`;
        html += '</div>';
      });
      
      html += '</div></div></div>';
    });
    
    html += '</div></div>';
    container.innerHTML = html;
    
  } catch (error) {
    console.error('Error rendering round progress:', error);
    container.innerHTML = '<div class="error">Error loading round progress</div>';
  }
}

/**
 * Updates the visual highlighting of the current leader
 * Should be called after score updates
 */
export function updateLeaderHighlight() {
  try {
    const leader = getLeader();
    
    // Remove existing leader highlights
    document.querySelectorAll('.leader').forEach(element => {
      element.classList.remove('leader');
    });
    
    // Add leader class to current leader's row
    const scoreRows = document.querySelectorAll('.score-table tbody tr');
    scoreRows.forEach(row => {
      const playerName = row.querySelector('.player-name');
      if (playerName && playerName.textContent.trim() === leader) {
        row.classList.add('leader');
      }
    });
    
  } catch (error) {
    console.error('Error updating leader highlight:', error);
  }
}

/**
 * Toggle visibility of player round details
 * @param {string} player - Player name
 */
window.togglePlayerRounds = function(player) {
  const detailsId = 'rounds-' + player.replace(/\s+/g, '-');
  const details = document.getElementById(detailsId);
  const button = document.querySelector(`[onclick="togglePlayerRounds('${player}')"]`);
  const icon = button.querySelector('.toggle-icon');
  
  if (details.style.display === 'none') {
    details.style.display = 'block';
    icon.textContent = '▲';
  } else {
    details.style.display = 'none';
    icon.textContent = '▼';
  }
};

// Initialize displays when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderScoreBoard();
    renderRoundProgress();
  });
} else {
  renderScoreBoard();
  renderRoundProgress();
}