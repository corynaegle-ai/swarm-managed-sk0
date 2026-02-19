/**
 * Score Display Module
 * Handles rendering and updating of score displays in the DOM
 */

// Mock data for demonstration - in real implementation this would come from scoreManager
const mockGameData = {
  players: [
    { id: 1, name: 'Player 1', scores: [85, 92, 78, 88, 95, 0, 0, 0, 0, 0] },
    { id: 2, name: 'Player 2', scores: [90, 87, 82, 91, 89, 0, 0, 0, 0, 0] },
    { id: 3, name: 'Player 3', scores: [78, 95, 88, 85, 92, 0, 0, 0, 0, 0] },
    { id: 4, name: 'Player 4', scores: [88, 82, 95, 87, 78, 0, 0, 0, 0, 0] }
  ],
  currentRound: 5,
  totalRounds: 10
};

/**
 * Calculate total score for a player
 * @param {Object} player - Player object with scores array
 * @returns {number} Total score
 */
function calculateTotalScore(player) {
  return player.scores.reduce((sum, score) => sum + score, 0);
}

/**
 * Get current leader based on total scores
 * @returns {Object} Leader player object
 */
function getCurrentLeader() {
  return mockGameData.players.reduce((leader, player) => {
    const playerTotal = calculateTotalScore(player);
    const leaderTotal = calculateTotalScore(leader);
    return playerTotal > leaderTotal ? player : leader;
  });
}

/**
 * Render the main scoreboard with total scores
 */
function renderScoreBoard() {
  try {
    const container = document.getElementById('scoreBoard');
    if (!container) {
      console.error('Score board container not found');
      return;
    }

    // Sort players by total score (descending)
    const sortedPlayers = [...mockGameData.players].sort((a, b) => 
      calculateTotalScore(b) - calculateTotalScore(a)
    );

    const leader = getCurrentLeader();

    let html = `
      <div class="score-board">
        <h2>Current Scores</h2>
        <table class="score-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Total Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
    `;

    sortedPlayers.forEach((player, index) => {
      const total = calculateTotalScore(player);
      const isLeader = player.id === leader.id;
      const rowClass = isLeader ? 'leader' : '';
      
      html += `
        <tr class="${rowClass}" data-player-id="${player.id}">
          <td class="rank">${index + 1}</td>
          <td class="player-name">${player.name}</td>
          <td class="total-score">${total}</td>
          <td>
            <button class="btn-details" onclick="togglePlayerDetails(${player.id})">
              View Details
            </button>
          </td>
        </tr>
        <tr class="player-details" id="details-${player.id}" style="display: none;">
          <td colspan="4">
            <div class="round-breakdown">
              <h4>${player.name} - Round by Round</h4>
              <div class="rounds-grid">
                ${player.scores.map((score, roundIndex) => `
                  <div class="round-score ${score > 0 ? 'completed' : 'pending'}">
                    <span class="round-label">R${roundIndex + 1}</span>
                    <span class="score-value">${score > 0 ? score : '-'}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
    updateLeaderHighlight();
  } catch (error) {
    console.error('Error rendering score board:', error);
  }
}

/**
 * Render round progress indicator
 */
function renderRoundProgress() {
  try {
    const container = document.getElementById('roundProgress');
    if (!container) {
      console.error('Round progress container not found');
      return;
    }

    const { currentRound, totalRounds } = mockGameData;
    const progressPercentage = (currentRound / totalRounds) * 100;

    const html = `
      <div class="round-progress">
        <div class="round-header">
          <h3>Round ${currentRound} of ${totalRounds}</h3>
          <span class="progress-text">${progressPercentage.toFixed(0)}% Complete</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercentage}%"></div>
        </div>
        <div class="round-breakdown">
          <h4>Round Breakdown</h4>
          <div class="rounds-overview">
            ${Array.from({length: totalRounds}, (_, i) => {
              const roundNum = i + 1;
              const isCompleted = roundNum < currentRound;
              const isCurrent = roundNum === currentRound;
              const statusClass = isCompleted ? 'completed' : (isCurrent ? 'current' : 'upcoming');
              
              return `
                <div class="round-item ${statusClass}">
                  <span class="round-number">${roundNum}</span>
                  <span class="round-status">
                    ${isCompleted ? '✓' : (isCurrent ? '⏳' : '○')}
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    console.error('Error rendering round progress:', error);
  }
}

/**
 * Update leader highlighting in the scoreboard
 */
function updateLeaderHighlight() {
  try {
    // Remove existing leader classes
    const existingLeaders = document.querySelectorAll('.leader');
    existingLeaders.forEach(element => {
      element.classList.remove('leader');
    });

    // Add leader class to current leader
    const leader = getCurrentLeader();
    const leaderRow = document.querySelector(`[data-player-id="${leader.id}"]`);
    if (leaderRow) {
      leaderRow.classList.add('leader');
    }
  } catch (error) {
    console.error('Error updating leader highlight:', error);
  }
}

/**
 * Toggle player details visibility (for round-by-round breakdown)
 * @param {number} playerId - ID of the player
 */
function togglePlayerDetails(playerId) {
  try {
    const detailsRow = document.getElementById(`details-${playerId}`);
    if (detailsRow) {
      const isVisible = detailsRow.style.display !== 'none';
      detailsRow.style.display = isVisible ? 'none' : 'table-row';
      
      // Update button text
      const button = document.querySelector(`[onclick="togglePlayerDetails(${playerId})"]`);
      if (button) {
        button.textContent = isVisible ? 'View Details' : 'Hide Details';
      }
    }
  } catch (error) {
    console.error('Error toggling player details:', error);
  }
}

/**
 * Initialize score displays
 */
function initializeScoreDisplay() {
  try {
    renderScoreBoard();
    renderRoundProgress();
  } catch (error) {
    console.error('Error initializing score display:', error);
  }
}

// Make functions available globally
window.renderScoreBoard = renderScoreBoard;
window.renderRoundProgress = renderRoundProgress;
window.updateLeaderHighlight = updateLeaderHighlight;
window.togglePlayerDetails = togglePlayerDetails;
window.initializeScoreDisplay = initializeScoreDisplay;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeScoreDisplay);
} else {
  initializeScoreDisplay();
}