/**
 * Score Display Module - Renders score displays in the DOM
 * Uses vanilla JavaScript for browser compatibility
 */

// Main scoreboard rendering function
function renderScoreBoard() {
  const container = document.getElementById('scoreboard-container');
  if (!container) return;

  // Get players safely
  const players = (window.playerSetup && window.playerSetup.getPlayers()) || [];
  if (players.length === 0) {
    container.innerHTML = '<div class="score-empty">No players configured</div>';
    return;
  }

  // Build scoreboard HTML
  let html = '<div class="scoreboard">';
  html += '<h3 class="scoreboard-title">Current Scores</h3>';
  html += '<div class="score-table">';

  // Get scores and sort by total
  const playerScores = players.map(player => ({
    id: player.id,
    name: player.name,
    total: typeof getTotalScore === 'function' ? getTotalScore(player.id) : 0,
    rounds: typeof getPlayerRounds === 'function' ? getPlayerRounds(player.id) : []
  })).sort((a, b) => b.total - a.total);

  // Get current leader
  const leaderId = typeof getLeader === 'function' ? getLeader() : null;

  // Render each player's score
  playerScores.forEach((player, index) => {
    const isLeader = player.id === leaderId;
    const position = index + 1;
    
    html += `<div class="score-row ${isLeader ? 'leader' : ''}" data-player-id="${player.id}">`;
    html += `<div class="score-position">${position}</div>`;
    html += `<div class="score-name">${player.name}</div>`;
    html += `<div class="score-total">${player.total}</div>`;
    html += `<div class="score-expand" onclick="togglePlayerDetails('${player.id}')">`;
    html += `<span class="expand-icon">▼</span>`;
    html += `</div>`;
    html += `</div>`;
    
    // Round-by-round breakdown (initially hidden)
    html += `<div class="score-details" id="details-${player.id}" style="display: none;">`;
    html += '<div class="round-scores">';
    
    for (let round = 1; round <= 10; round++) {
      const roundScore = player.rounds[round - 1] || 0;
      html += `<div class="round-score">`;
      html += `<span class="round-label">R${round}</span>`;
      html += `<span class="round-value">${roundScore}</span>`;
      html += `</div>`;
    }
    
    html += '</div></div>';
  });

  html += '</div></div>';
  container.innerHTML = html;
}

// Round progress rendering function
function renderRoundProgress() {
  const container = document.getElementById('round-progress-container');
  if (!container) return;

  const currentRound = typeof getCurrentRound === 'function' ? getCurrentRound() : 1;
  const totalRounds = 10;

  let html = '<div class="round-progress">';
  html += `<h3 class="round-title">Round ${currentRound} of ${totalRounds}</h3>`;
  html += '<div class="progress-bar">';
  html += '<div class="progress-track">';
  
  // Create progress indicator
  const progressPercent = (currentRound / totalRounds) * 100;
  html += `<div class="progress-fill" style="width: ${progressPercent}%"></div>`;
  html += '</div>';
  
  // Round indicators
  html += '<div class="round-indicators">';
  for (let i = 1; i <= totalRounds; i++) {
    const status = i < currentRound ? 'completed' : i === currentRound ? 'current' : 'upcoming';
    html += `<div class="round-dot ${status}" title="Round ${i}">${i}</div>`;
  }
  html += '</div>';
  html += '</div></div>';
  
  container.innerHTML = html;
}

// Leader highlighting function
function updateLeaderHighlight() {
  const leaderId = typeof getLeader === 'function' ? getLeader() : null;
  if (!leaderId) return;

  // Remove existing leader highlights
  const allRows = document.querySelectorAll('.score-row');
  allRows.forEach(row => {
    row.classList.remove('leader', 'leader-pulse');
  });

  // Add leader highlight to current leader
  const leaderRow = document.querySelector(`[data-player-id="${leaderId}"]`);
  if (leaderRow) {
    leaderRow.classList.add('leader', 'leader-pulse');
    
    // Pulse effect for new leader (remove after animation)
    setTimeout(() => {
      leaderRow.classList.remove('leader-pulse');
    }, 2000);
  }
}

// Toggle player details visibility
function togglePlayerDetails(playerId) {
  const details = document.getElementById(`details-${playerId}`);
  const icon = document.querySelector(`[data-player-id="${playerId}"] .expand-icon`);
  
  if (!details || !icon) return;
  
  if (details.style.display === 'none') {
    details.style.display = 'block';
    icon.textContent = '▲';
  } else {
    details.style.display = 'none';
    icon.textContent = '▼';
  }
}

// Export functions for module compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderScoreBoard, renderRoundProgress, updateLeaderHighlight };
}