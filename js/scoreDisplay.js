/**
 * Score Display Module
 * Renders score displays in the DOM
 * Uses global scope - no imports/exports for browser compatibility
 */

/**
 * Renders the main scoreboard with player scores
 * @param {string} containerId - ID of the DOM container element
 */
function renderScoreBoard(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Get players from global playerSetup
  const players = (window.playerSetup && window.playerSetup.getPlayers()) || [];
  
  if (players.length === 0) {
    container.innerHTML = `
      <div class="scoreboard">
        <h2 class="scoreboard-title">Scoreboard</h2>
        <p class="no-players">No players added yet</p>
      </div>
    `;
    return;
  }

  // Get leader from global scoreManager
  const leaderId = typeof getLeader === 'function' ? getLeader() : null;

  // Build player rows with scores
  const playerRows = players.map(player => {
    const totalScore = typeof getTotalScore === 'function' ? getTotalScore(player.id) : 0;
    const isLeader = player.id === leaderId;
    const leaderClass = isLeader ? 'leader-row' : '';
    const leaderBadge = isLeader ? '<span class="leader-badge">👑</span>' : '';

    return `
      <tr class="${leaderClass}" data-player-id="${player.id}">
        <td class="player-name">${player.name}${leaderBadge}</td>
        <td class="total-score">${totalScore}</td>
        <td>
          <button class="toggle-details" onclick="toggleRoundDetails('${player.id}')">
            View Rounds
          </button>
        </td>
      </tr>
      <tr class="round-details" id="details-${player.id}" style="display: none;">
        <td colspan="3">
          <div class="round-details-content">
            ${renderPlayerRoundDetails(player.id)}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="scoreboard">
      <h2 class="scoreboard-title">Scoreboard</h2>
      <div class="score-table-container">
        <table class="score-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Total Score</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${playerRows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Renders round-by-round score details for a player
 * @param {string} playerId - Player ID
 * @returns {string} HTML string for round details
 */
function renderPlayerRoundDetails(playerId) {
  const rounds = typeof getPlayerRounds === 'function' ? getPlayerRounds(playerId) : [];
  const totalScore = typeof getTotalScore === 'function' ? getTotalScore(playerId) : 0;

  if (rounds.length === 0) {
    return '<p style="text-align: center; color: #666;">No rounds played yet</p>';
  }

  const roundItems = rounds.map((score, index) => `
    <div class="round-item">
      <span class="round-number">Round ${index + 1}</span>
      <span class="round-score">${score}</span>
    </div>
  `).join('');

  return `
    <div class="rounds-grid">
      ${roundItems}
    </div>
    <div class="total-summary">
      Total: ${totalScore}
    </div>
  `;
}

/**
 * Toggles visibility of round details for a player
 * @param {string} playerId - Player ID
 */
function toggleRoundDetails(playerId) {
  const detailsRow = document.getElementById(`details-${playerId}`);
  if (detailsRow) {
    const isVisible = detailsRow.style.display !== 'none';
    detailsRow.style.display = isVisible ? 'none' : 'table-row';
  }
}

/**
 * Renders the round progress indicator
 * @param {string} containerId - ID of the DOM container element
 */
function renderRoundProgress(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentRound = typeof getCurrentRound === 'function' ? getCurrentRound() : 1;
  const totalRounds = 10;
  const progressPercent = (currentRound / totalRounds) * 100;

  // Generate round indicators
  const indicators = [];
  for (let i = 1; i <= totalRounds; i++) {
    let className = 'round-indicator';
    if (i < currentRound) {
      className += ' completed';
    } else if (i === currentRound) {
      className += ' current';
    } else {
      className += ' upcoming';
    }
    indicators.push(`<div class="${className}">${i}</div>`);
  }

  container.innerHTML = `
    <div class="round-progress">
      <div class="round-info">
        <h3>Round ${currentRound} of ${totalRounds}</h3>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
        <p class="progress-text">${currentRound} / ${totalRounds} rounds completed</p>
      </div>
      <div class="round-indicators">
        ${indicators.join('')}
      </div>
    </div>
  `;
}

/**
 * Updates the leader highlighting in the scoreboard
 * Should be called after scores change
 */
function updateLeaderHighlight() {
  const leaderId = typeof getLeader === 'function' ? getLeader() : null;
  
  // Remove all existing leader classes
  const allRows = document.querySelectorAll('.score-table tbody tr[data-player-id]');
  allRows.forEach(row => {
    row.classList.remove('leader-row');
    // Remove existing leader badge
    const badge = row.querySelector('.leader-badge');
    if (badge) {
      badge.remove();
    }
  });

  // Add leader class and badge to current leader
  if (leaderId) {
    const leaderRow = document.querySelector(`tr[data-player-id="${leaderId}"]`);
    if (leaderRow) {
      leaderRow.classList.add('leader-row');
      const nameCell = leaderRow.querySelector('.player-name');
      if (nameCell && !nameCell.querySelector('.leader-badge')) {
        nameCell.innerHTML += '<span class="leader-badge">👑</span>';
      }
    }
  }
}

// Make functions available globally for browser
window.renderScoreBoard = renderScoreBoard;
window.renderRoundProgress = renderRoundProgress;
window.updateLeaderHighlight = updateLeaderHighlight;
window.toggleRoundDetails = toggleRoundDetails;

// Export for Node.js testing environment (if applicable)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderScoreBoard, renderRoundProgress, updateLeaderHighlight };
}// Score Display Module
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