// Score display functionality

/**
 * Renders the main scoreboard with current total scores for all players
 */
function renderScoreBoard() {
    const container = document.getElementById('scoreboard-container');
    if (!container) return;
    
    const allScores = getAllScores();
    const playerIds = Object.keys(allScores);
    
    if (playerIds.length === 0) {
        container.innerHTML = '<p class="no-players">No players added yet</p>';
        return;
    }
    
    // Sort players by total score (descending)
    const sortedPlayers = playerIds.sort(function(a, b) {
        return getTotalScore(b) - getTotalScore(a);
    });
    
    let html = '<div class="scoreboard">';
    html += '<h2>Current Scores</h2>';
    html += '<table class="score-table">';
    html += '<thead><tr><th>Rank</th><th>Player</th><th>Total Score</th><th>Details</th></tr></thead>';
    html += '<tbody>';
    
    sortedPlayers.forEach(function(playerId, index) {
        const total = getTotalScore(playerId);
        const isLeader = getLeader() === playerId;
        const rowClass = isLeader ? 'leader-row' : '';
        
        html += '<tr class="' + rowClass + '" data-player="' + playerId + '">';
        html += '<td class="rank">' + (index + 1) + '</td>';
        html += '<td class="player-name">' + escapeHtml(playerId) + '</td>';
        html += '<td class="total-score">' + total + '</td>';
        html += '<td class="details-cell">';
        html += '<button class="details-btn" data-player="' + escapeHtml(playerId) + '">View Rounds</button>';
        html += '</td>';
        html += '</tr>';
        
        // Round details row (initially hidden)
        html += '<tr class="round-details" id="details-' + escapeHtml(playerId) + '" style="display: none;">';
        html += '<td colspan="4">';
        html += '<div class="round-breakdown">';
        html += '<h4>Round-by-Round Scores</h4>';
        html += '<div class="rounds-grid">';
        
        const rounds = getPlayerRounds(playerId);
        for (let i = 0; i < 10; i++) {
            const roundScore = rounds[i] || 0;
            const roundNum = i + 1;
            html += '<div class="round-item">';
            html += '<span class="round-label">Round ' + roundNum + '</span>';
            html += '<span class="round-score">' + roundScore + '</span>';
            html += '</div>';
        }
        
        html += '</div></div></td></tr>';
    });
    
    html += '</tbody></table></div>';
    
    container.innerHTML = html;
    
    // Add event listeners for details buttons
    const detailsBtns = container.querySelectorAll('.details-btn');
    detailsBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const playerId = this.getAttribute('data-player');
            togglePlayerDetails(playerId);
        });
    });
}

/**
 * Renders round progress indicator showing current round
 */
function renderRoundProgress() {
    const container = document.getElementById('round-progress-container');
    if (!container) return;
    
    const currentRound = getCurrentRound();
    const totalRounds = 10;
    
    let html = '<div class="round-progress">';
    html += '<h3>Round ' + currentRound + ' of ' + totalRounds + '</h3>';
    html += '<div class="progress-bar">';
    html += '<div class="progress-fill" style="width: ' + ((currentRound / totalRounds) * 100) + '%"></div>';
    html += '</div>';
    html += '<div class="round-indicators">';
    
    for (let i = 1; i <= totalRounds; i++) {
        let roundClass = 'round-indicator';
        if (i < currentRound) {
            roundClass += ' completed';
        } else if (i === currentRound) {
            roundClass += ' current';
        }
        html += '<span class="' + roundClass + '">' + i + '</span>';
    }
    
    html += '</div></div>';
    
    container.innerHTML = html;
}

/**
 * Updates the visual highlighting of the current leader
 */
function updateLeaderHighlight() {
    const leader = getLeader();
    
    // Remove existing leader highlights
    const existingLeaders = document.querySelectorAll('.leader-row');
    existingLeaders.forEach(function(row) {
        row.classList.remove('leader-row');
    });
    
    // Add leader highlight to current leader
    if (leader) {
        const leaderRow = document.querySelector('[data-player="' + escapeHtml(leader) + '"]');
        if (leaderRow) {
            leaderRow.classList.add('leader-row');
        }
    }
}

/**
 * Toggles the display of player round details
 * @param {string} playerId - The player ID (name)
 */
function togglePlayerDetails(playerId) {
    const detailsRow = document.getElementById('details-' + escapeHtml(playerId));
    const btn = document.querySelector('.details-btn[data-player="' + escapeHtml(playerId) + '"]');
    
    if (!detailsRow || !btn) return;
    
    if (detailsRow.style.display === 'none') {
        detailsRow.style.display = 'table-row';
        btn.textContent = 'Hide Rounds';
    } else {
        detailsRow.style.display = 'none';
        btn.textContent = 'View Rounds';
    }
}

/**
 * Escapes HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Optional module.exports guard for test compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderScoreBoard, renderRoundProgress, updateLeaderHighlight, togglePlayerDetails, escapeHtml };
}