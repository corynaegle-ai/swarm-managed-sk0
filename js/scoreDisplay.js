/**
 * Score Display Management
 * Handles rendering of scoreboards, round progress, and leader highlighting
 */

/**
 * Renders the main scoreboard with current total scores
 * Creates expandable sections for round-by-round breakdown
 */
function renderScoreBoard() {
    const container = document.getElementById('scoreboard-container');
    if (!container) return;
    
    const allScores = getAllScores();
    const playerIds = Object.keys(allScores);
    
    if (playerIds.length === 0) {
        container.innerHTML = '<div class="no-players">No players added yet</div>';
        return;
    }
    
    // Sort players by total score (descending)
    const sortedPlayers = playerIds.sort((a, b) => {
        const scoreA = getTotalScore(a) || 0;
        const scoreB = getTotalScore(b) || 0;
        return scoreB - scoreA;
    });
    
    let html = '<div class="scoreboard">';
    html += '<h3>Current Standings</h3>';
    html += '<div class="score-table">';
    
    sortedPlayers.forEach((playerId, index) => {
        const totalScore = getTotalScore(playerId) || 0;
        const rounds = getPlayerRounds(playerId) || [];
        const leader = getLeader();
        const isLeader = leader === playerId;
        
        html += `<div class="player-row ${isLeader ? 'leader' : ''}" data-player="${playerId}">`;
        html += `<div class="player-info">`;
        html += `<span class="rank">#${index + 1}</span>`;
        html += `<span class="player-name">${playerId}</span>`;
        html += `<span class="total-score">${totalScore}</span>`;
        html += `<button class="details-btn" data-player="${playerId}">Details</button>`;
        html += `</div>`;
        
        // Round breakdown (initially hidden)
        html += `<div class="round-breakdown" id="breakdown-${playerId}" style="display: none;">`;
        html += `<div class="rounds-grid">`;
        
        for (let i = 0; i < 10; i++) {
            const roundScore = rounds[i] !== undefined ? rounds[i] : '-';
            const roundClass = rounds[i] !== undefined ? 'completed' : 'pending';
            html += `<div class="round-cell ${roundClass}">`;
            html += `<span class="round-label">R${i + 1}</span>`;
            html += `<span class="round-score">${roundScore}</span>`;
            html += `</div>`;
        }
        
        html += `</div></div></div>`;
    });
    
    html += '</div></div>';
    container.innerHTML = html;
    
    // Add event listeners for details buttons
    const detailButtons = container.querySelectorAll('.details-btn');
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const playerId = this.getAttribute('data-player');
            togglePlayerDetails(playerId);
        });
    });
}

/**
 * Toggles the visibility of player round breakdown
 * @param {string} playerId - The player name
 */
function togglePlayerDetails(playerId) {
    const breakdown = document.getElementById(`breakdown-${playerId}`);
    if (!breakdown) return;
    
    const isVisible = breakdown.style.display !== 'none';
    breakdown.style.display = isVisible ? 'none' : 'block';
    
    // Update button text
    const button = document.querySelector(`[data-player="${playerId}"].details-btn`);
    if (button) {
        button.textContent = isVisible ? 'Details' : 'Hide';
    }
}

/**
 * Renders round progress indicator
 * Shows current round and overall progress
 */
function renderRoundProgress() {
    const container = document.getElementById('round-progress-container');
    if (!container) return;
    
    const currentRound = getCurrentRound() || 1;
    const totalRounds = 10;
    
    let html = '<div class="round-progress">';
    html += `<div class="round-info">`;
    html += `<h4>Round ${currentRound} of ${totalRounds}</h4>`;
    html += `</div>`;
    
    // Progress bar
    const progressPercent = ((currentRound - 1) / totalRounds) * 100;
    html += `<div class="progress-bar">`;
    html += `<div class="progress-fill" style="width: ${progressPercent}%"></div>`;
    html += `</div>`;
    
    // Round indicators
    html += `<div class="round-indicators">`;
    for (let i = 1; i <= totalRounds; i++) {
        const roundClass = i < currentRound ? 'completed' : 
                          i === currentRound ? 'current' : 'pending';
        html += `<div class="round-indicator ${roundClass}">${i}</div>`;
    }
    html += `</div>`;
    
    html += '</div>';
    container.innerHTML = html;
}

/**
 * Updates leader highlighting in the scoreboard
 * Adds/removes leader class from player rows
 */
function updateLeaderHighlight() {
    const leader = getLeader();
    const playerRows = document.querySelectorAll('.player-row');
    
    playerRows.forEach(row => {
        const playerId = row.getAttribute('data-player');
        if (playerId === leader) {
            row.classList.add('leader');
        } else {
            row.classList.remove('leader');
        }
    });
    
    // Update leader crown icon if it exists
    const existingCrown = document.querySelector('.leader-crown');
    if (existingCrown) {
        existingCrown.remove();
    }
    
    if (leader) {
        const leaderRow = document.querySelector(`[data-player="${leader}"]`);
        if (leaderRow) {
            const crown = document.createElement('span');
            crown.className = 'leader-crown';
            crown.innerHTML = '👑';
            const playerName = leaderRow.querySelector('.player-name');
            if (playerName) {
                playerName.appendChild(crown);
            }
        }
    }
}

/**
 * Refreshes all score displays
 * Convenience function to update all components
 */
function refreshScoreDisplays() {
    renderScoreBoard();
    renderRoundProgress();
    updateLeaderHighlight();
}

// Optional module.exports guard for test compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        renderScoreBoard, 
        renderRoundProgress, 
        updateLeaderHighlight,
        togglePlayerDetails,
        refreshScoreDisplays
    };
}