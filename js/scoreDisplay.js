// Score Display Module
// Handles rendering of score displays, round progress, and leader highlighting

/**
 * Renders the main scoreboard showing all players and their total scores
 */
function renderScoreBoard() {
  const container = document.getElementById('scoreboard-container');
  if (!container) return;

  // Get players from global scope
  const players = (window.playerSetup && window.playerSetup.getPlayers()) || [];
  
  if (players.length === 0) {
    container.innerHTML = '<p class="no-players">No players found</p>';
    return;
  }

  // Create scoreboard structure
  let html = '<div class="scoreboard">';
  html += '<h2 class="scoreboard-title">Scoreboard</h2>';
  html += '<div class="score-table-container">';
  html += '<table class="score-table">';
  html += '<thead><tr><th>Player</th><th>Total Score</th><th>Details</th></tr></thead>';
  html += '<tbody>';

  // Sort players by total score (descending)
  const playersWithScores = players.map(player => ({
    ...player,
    totalScore: getTotalScore(player.id) || 0
  })).sort((a, b) => b.totalScore - a.totalScore);

  playersWithScores.forEach((player, index) => {
    const isLeader = getLeader() === player.id;
    const rowClass = isLeader ? 'leader-row' : '';
    
    html += `<tr class="${rowClass}" data-player-id="${player.id}">`;
    html += `<td class="player-name">${player.name || 'Player ' + player.id}`;
    if (isLeader) {
      html += '<span class="leader-badge">👑</span>';
    }
    html += '</td>';
    html += `<td class="total-score">${player.totalScore}</td>`;
    html += `<td><button class="toggle-details" onclick="togglePlayerDetails('${player.id}')">View Rounds</button></td>`;
    html += '</tr>';
    
    // Add expandable round details
    html += `<tr class="round-details" id="details-${player.id}" style="display: none;">`;
    html += '<td colspan="3">';
    html += renderPlayerRoundDetails(player.id);
    html += '</td>';
    html += '</tr>';
  });

  html += '</tbody></table></div></div>';
  container.innerHTML = html;
}

/**
 * Renders round progress indicator showing current round and overall progress
 */
function renderRoundProgress() {
  const container = document.getElementById('round-progress-container');
  if (!container) return;

  const currentRound = getCurrentRound() || 1;
  const totalRounds = 10;
  const progressPercent = (currentRound / totalRounds) * 100;

  let html = '<div class="round-progress">';
  html += '<div class="round-info">';
  html += `<h3>Round ${currentRound} of ${totalRounds}</h3>`;
  html += '</div>';
  
  // Progress bar
  html += '<div class="progress-bar-container">';
  html += '<div class="progress-bar">';
  html += `<div class="progress-fill" style="width: ${progressPercent}%"></div>`;
  html += '</div>';
  html += `<span class="progress-text">${progressPercent.toFixed(0)}% Complete</span>`;
  html += '</div>';
  
  // Round indicators
  html += '<div class="round-indicators">';
  for (let i = 1; i <= totalRounds; i++) {
    const roundClass = i <= currentRound ? 'completed' : i === currentRound ? 'current' : 'upcoming';
    html += `<div class="round-indicator ${roundClass}" title="Round ${i}">${i}</div>`;
  }
  html += '</div>';
  
  html += '</div>';
  container.innerHTML = html;
}

/**
 * Updates the visual highlighting of the current leader
 */
function updateLeaderHighlight() {
  // Remove existing leader highlights
  const existingLeaders = document.querySelectorAll('.leader-row');
  existingLeaders.forEach(row => {
    row.classList.remove('leader-row');
    const badge = row.querySelector('.leader-badge');
    if (badge) badge.remove();
  });

  // Add leader highlight to current leader
  const leaderId = getLeader();
  if (leaderId) {
    const leaderRow = document.querySelector(`[data-player-id="${leaderId}"]`);
    if (leaderRow) {
      leaderRow.classList.add('leader-row');
      const playerNameCell = leaderRow.querySelector('.player-name');
      if (playerNameCell && !playerNameCell.querySelector('.leader-badge')) {
        playerNameCell.innerHTML += '<span class="leader-badge">👑</span>';
      }
    }
  }
}

/**
 * Helper function to render detailed round-by-round scores for a player
 * @param {string} playerId - The player's ID
 * @returns {string} HTML string for round details
 */
function renderPlayerRoundDetails(playerId) {
  const rounds = getPlayerRounds(playerId) || [];
  
  if (rounds.length === 0) {
    return '<div class="round-details-content"><p>No rounds played yet</p></div>';
  }

  let html = '<div class="round-details-content">';
  html += '<div class="rounds-grid">';
  
  rounds.forEach((score, index) => {
    const roundNumber = index + 1;
    html += `<div class="round-item">`;
    html += `<span class="round-number">R${roundNumber}</span>`;
    html += `<span class="round-score">${score || 0}</span>`;
    html += `</div>`;
  });
  
  html += '</div>';
  html += `<div class="total-summary">Total: ${getTotalScore(playerId) || 0}</div>`;
  html += '</div>';
  
  return html;
}

/**
 * Toggles the visibility of player round details
 * @param {string} playerId - The player's ID
 */
function togglePlayerDetails(playerId) {
  const detailsRow = document.getElementById(`details-${playerId}`);
  if (detailsRow) {
    const isVisible = detailsRow.style.display !== 'none';
    detailsRow.style.display = isVisible ? 'none' : 'table-row';
    
    // Update button text
    const button = document.querySelector(`[data-player-id="${playerId}"] .toggle-details`);
    if (button) {
      button.textContent = isVisible ? 'View Rounds' : 'Hide Rounds';
    }
  }
}

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderScoreBoard, renderRoundProgress, updateLeaderHighlight };
}