// Score Display Module - Self-contained score management and display

// Internal data store for players and scores
let gameData = {
  players: [],
  roundScores: {},
  currentRound: 1,
  maxRounds: 10
};

// Initialize players if not already set
function initializePlayers(playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4']) {
  if (gameData.players.length === 0) {
    gameData.players = playerNames.map(name => ({ name, id: name.toLowerCase().replace(/\s+/g, '') }));
    // Initialize round scores
    for (let round = 1; round <= gameData.maxRounds; round++) {
      gameData.roundScores[round] = {};
      gameData.players.forEach(player => {
        gameData.roundScores[round][player.id] = 0;
      });
    }
  }
}

// Get current players
function getPlayers() {
  initializePlayers();
  return gameData.players;
}

// Get player total score
function getPlayerTotalScore(playerId) {
  let total = 0;
  for (let round = 1; round <= gameData.currentRound; round++) {
    total += gameData.roundScores[round][playerId] || 0;
  }
  return total;
}

// Get round scores for a specific round
function getRoundScores(round) {
  return gameData.roundScores[round] || {};
}

// Get current round
function getCurrentRound() {
  return gameData.currentRound;
}

// Get current leader
function getLeader() {
  const players = getPlayers();
  let leader = players[0];
  let highestScore = getPlayerTotalScore(leader.id);
  
  players.forEach(player => {
    const score = getPlayerTotalScore(player.id);
    if (score > highestScore) {
      highestScore = score;
      leader = player;
    }
  });
  
  return leader;
}

// Set score for a player in a specific round
function setPlayerRoundScore(playerId, round, score) {
  if (!gameData.roundScores[round]) {
    gameData.roundScores[round] = {};
  }
  gameData.roundScores[round][playerId] = score;
}

// Advance to next round
function nextRound() {
  if (gameData.currentRound < gameData.maxRounds) {
    gameData.currentRound++;
  }
}

// Main display functions

/**
 * Renders the main scoreboard showing current total scores for all players
 */
function renderScoreBoard() {
  const container = document.getElementById('scoreboard');
  if (!container) {
    console.error('Scoreboard container not found');
    return;
  }

  const players = getPlayers();
  const leader = getLeader();
  
  container.innerHTML = `
    <div class="scoreboard-header">
      <h2>Current Scores</h2>
    </div>
    <div class="scoreboard-table">
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          ${players.map(player => {
            const totalScore = getPlayerTotalScore(player.id);
            const isLeader = leader && player.id === leader.id;
            return `
              <tr class="${isLeader ? 'leader' : ''}" data-player-id="${player.id}">
                <td class="player-name">${player.name}</td>
                <td class="player-score">${totalScore}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Renders round progress showing current round and round breakdown
 */
function renderRoundProgress() {
  const container = document.getElementById('round-progress');
  if (!container) {
    console.error('Round progress container not found');
    return;
  }

  const currentRound = getCurrentRound();
  const maxRounds = gameData.maxRounds;
  const players = getPlayers();
  
  container.innerHTML = `
    <div class="round-header">
      <h3>Round ${currentRound} of ${maxRounds}</h3>
      <div class="round-progress-bar">
        <div class="progress-fill" style="width: ${(currentRound / maxRounds) * 100}%"></div>
      </div>
    </div>
    <div class="round-breakdown">
      <button class="toggle-breakdown" onclick="toggleRoundBreakdown()">
        Show Round-by-Round Scores
      </button>
      <div class="breakdown-content" id="breakdown-content" style="display: none;">
        <table class="breakdown-table">
          <thead>
            <tr>
              <th>Round</th>
              ${players.map(player => `<th>${player.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${Array.from({length: currentRound}, (_, i) => i + 1).map(round => `
              <tr>
                <td>Round ${round}</td>
                ${players.map(player => {
                  const score = getRoundScores(round)[player.id] || 0;
                  return `<td>${score}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Updates the visual highlighting of the current leader
 */
function updateLeaderHighlight() {
  const leader = getLeader();
  
  // Remove existing leader highlights
  document.querySelectorAll('.leader').forEach(el => {
    el.classList.remove('leader');
  });
  
  // Add leader class to current leader
  if (leader) {
    const leaderRow = document.querySelector(`[data-player-id="${leader.id}"]`);
    if (leaderRow) {
      leaderRow.classList.add('leader');
    }
  }
}

/**
 * Toggles the visibility of the round breakdown table
 */
function toggleRoundBreakdown() {
  const content = document.getElementById('breakdown-content');
  const button = document.querySelector('.toggle-breakdown');
  
  if (content && button) {
    if (content.style.display === 'none') {
      content.style.display = 'block';
      button.textContent = 'Hide Round-by-Round Scores';
    } else {
      content.style.display = 'none';
      button.textContent = 'Show Round-by-Round Scores';
    }
  }
}

// Make functions available globally for HTML onclick handlers
window.toggleRoundBreakdown = toggleRoundBreakdown;

// Utility functions for demo/testing
function addRandomScores() {
  const players = getPlayers();
  const currentRound = getCurrentRound();
  
  players.forEach(player => {
    const randomScore = Math.floor(Math.random() * 100) + 1;
    setPlayerRoundScore(player.id, currentRound, randomScore);
  });
  
  renderScoreBoard();
  renderRoundProgress();
  updateLeaderHighlight();
}

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderScoreBoard,
    renderRoundProgress,
    updateLeaderHighlight,
    getPlayers,
    getPlayerTotalScore,
    getRoundScores,
    getCurrentRound,
    getLeader,
    setPlayerRoundScore,
    nextRound,
    addRandomScores
  };
}

// Auto-initialize on DOM load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    initializePlayers();
    renderScoreBoard();
    renderRoundProgress();
    updateLeaderHighlight();
  });
}