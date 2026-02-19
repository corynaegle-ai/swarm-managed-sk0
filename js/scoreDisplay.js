/**
 * Score Display Module
 * Handles rendering of score displays in the DOM
 * Uses vanilla JavaScript - no imports/exports needed
 */

/**
 * Renders the main scoreboard with current total scores for all players
 */
function renderScoreBoard() {
  const container = document.getElementById('scoreboard-container');
  if (!container) return;

  const players = (window.playerSetup && window.playerSetup.getPlayers()) || [];
  if (players.length === 0) {
    container.innerHTML = '<p class="no-players">No players added yet</p>';
    return;
  }

  const leader = getLeader();
  
  let html = '<div class="scoreboard">';
  html += '<h2 class="scoreboard-title">Scoreboard</h2>';
  html += '<div class="score-table">';
  html += '<div class="score-header">';
  html += '<div class="player-name">Player</div>';
  html += '<div class="total-score">Total Score</div>';
  html += '<div class="expand-btn">Details</div>';
  html += '</div>';

  players.forEach(player => {
    const totalScore = getTotalScore(player.id);
    const isLeader = player.id === leader;
    const playerRounds = getPlayerRounds(player.id);
    
    html += `<div class="score-row ${isLeader ? 'leader' : ''}" data-player-id="${player.id}">`;
    html += `<div class="player-name">${player.name}</div>`;
    html += `<div class="total-score">${totalScore}</div>`;
    html += '<div class="expand-btn"><button class="expand-toggle">+</button></div>';
    html += '</div>';
    
    html += `<div class="round-details" id="details-${player.id}" style="display: none;">`;
    html += '<div class="round-breakdown">';
    
    for (let round = 1; round <= 10; round++) {
      const roundScore = playerRounds[round - 1] || 0;
      html += `<div class="round-item">`;
      html += `<span class="round-label">Round ${round}:</span>`;
      html += `<span class="round-score">${roundScore}</span>`;
      html += '</div>';
    }
    
    html += '</div>';
    html += '</div>';
  });

  html += '</div>';
  html += '</div>';
  
  container.innerHTML = html;
  
  // Add event listeners for expand/collapse functionality
  const expandButtons = container.querySelectorAll('.expand-toggle');
  expandButtons.forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('.score-row');
      const playerId = row.dataset.playerId;
      const details = document.getElementById(`details-${playerId}`);
      
      if (details.style.display === 'none') {
        details.style.display = 'block';
        this.textContent = '-';
      } else {
        details.style.display = 'none';
        this.textContent = '+';
      }
    });
  });
}

/**
 * Renders the round progress indicator showing current round
 */
function renderRoundProgress() {
  const container = document.getElementById('round-progress-container');
  if (!container) return;

  const currentRound = getCurrentRound();
  
  let html = '<div class="round-progress">';
  html += '<h3 class="round-title">Game Progress</h3>';
  html += `<div class="current-round">Round ${currentRound} of 10</div>`;
  
  html += '<div class="progress-bar">';
  html += '<div class="progress-track">';
  
  for (let round = 1; round <= 10; round++) {
    const isActive = round === currentRound;
    const isCompleted = round < currentRound;
    const statusClass = isCompleted ? 'completed' : (isActive ? 'active' : 'upcoming');
    
    html += `<div class="progress-dot ${statusClass}" title="Round ${round}">${round}</div>`;
  }
  
  html += '</div>';
  html += '</div>';
  html += '</div>';
  
  container.innerHTML = html;
}

/**
 * Updates the visual highlighting of the current leader
 */
function updateLeaderHighlight() {
  const leader = getLeader();
  if (!leader) return;
  
  // Remove existing leader highlights
  const existingLeaders = document.querySelectorAll('.score-row.leader');
  existingLeaders.forEach(row => row.classList.remove('leader'));
  
  // Add leader highlight to current leader
  const leaderRow = document.querySelector(`[data-player-id="${leader}"]`);
  if (leaderRow) {
    leaderRow.classList.add('leader');
  }
  
  // Update leader indicator if it exists
  const leaderIndicator = document.getElementById('leader-indicator');
  if (leaderIndicator) {
    const players = (window.playerSetup && window.playerSetup.getPlayers()) || [];
    const leaderPlayer = players.find(p => p.id === leader);
    if (leaderPlayer) {
      leaderIndicator.innerHTML = `<div class="leader-badge">🏆 Leader: ${leaderPlayer.name}</div>`;
    }
  }
}

// Export functions for Node.js environment (testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderScoreBoard, renderRoundProgress, updateLeaderHighlight };
}