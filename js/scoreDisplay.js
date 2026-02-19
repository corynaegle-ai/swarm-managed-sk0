/**
 * Score Display Module
 * Handles rendering of score displays, round progress, and leader highlighting
 */

/**
 * Renders the main scoreboard with all players' total scores
 * Displays players sorted by total score (highest first)
 */
function renderScoreBoard() {
    const container = document.getElementById('scoreboard-container');
    if (!container) return;

    try {
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
        html += '<div class="score-header">';
        html += '<div class="rank-col">Rank</div>';
        html += '<div class="name-col">Player</div>';
        html += '<div class="score-col">Total Score</div>';
        html += '<div class="details-col">Details</div>';
        html += '</div>';

        sortedPlayers.forEach(function(playerId, index) {
            const totalScore = getTotalScore(playerId) || 0;
            const isLeader = getLeader() === playerId;
            const rank = index + 1;
            
            html += '<div class="score-row' + (isLeader ? ' leader' : '') + '" data-player="' + playerId + '">';
            html += '<div class="rank-col">' + rank + '</div>';
            html += '<div class="name-col">' + playerId + '</div>';
            html += '<div class="score-col">' + totalScore + '</div>';
            html += '<div class="details-col"><button class="details-btn" data-player="' + playerId + '">View Rounds</button></div>';
            html += '</div>';
            
            // Add collapsible round details
            html += '<div class="round-details" id="details-' + playerId + '" style="display: none;">';
            html += '<div class="round-breakdown">';
            const rounds = getPlayerRounds(playerId) || [];
            if (rounds.length > 0) {
                html += '<h4>Round-by-Round Scores:</h4>';
                html += '<div class="rounds-grid">';
                rounds.forEach(function(score, roundIndex) {
                    html += '<div class="round-item">';
                    html += '<span class="round-num">Round ' + (roundIndex + 1) + '</span>';
                    html += '<span class="round-score">' + (score || 0) + '</span>';
                    html += '</div>';
                });
                html += '</div>';
            } else {
                html += '<p>No rounds played yet</p>';
            }
            html += '</div>';
            html += '</div>';
        });

        html += '</div>';
        html += '</div>';
        
        container.innerHTML = html;
        
        // Add click listeners for details buttons
        const detailsBtns = container.querySelectorAll('.details-btn');
        detailsBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const playerId = btn.getAttribute('data-player');
                togglePlayerDetails(playerId);
            });
        });
        
    } catch (error) {
        console.error('Error rendering scoreboard:', error);
        container.innerHTML = '<div class="error">Error loading scores</div>';
    }
}

/**
 * Renders round progress indicator showing current round and progress
 */
function renderRoundProgress() {
    const container = document.getElementById('round-progress-container');
    if (!container) return;

    try {
        const currentRound = getCurrentRound() || 1;
        const totalRounds = 10;
        const progress = (currentRound / totalRounds) * 100;
        
        let html = '<div class="round-progress">';
        html += '<h3>Round Progress</h3>';
        html += '<div class="round-info">';
        html += '<span class="current-round">Round ' + currentRound + ' of ' + totalRounds + '</span>';
        html += '</div>';
        html += '<div class="progress-bar">';
        html += '<div class="progress-fill" style="width: ' + progress + '%"></div>';
        html += '</div>';
        html += '<div class="round-indicators">';
        
        for (let i = 1; i <= totalRounds; i++) {
            const status = i < currentRound ? 'completed' : (i === currentRound ? 'current' : 'upcoming');
            html += '<div class="round-indicator ' + status + '" title="Round ' + i + '">';
            html += i;
            html += '</div>';
        }
        
        html += '</div>';
        html += '</div>';
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error rendering round progress:', error);
        container.innerHTML = '<div class="error">Error loading round progress</div>';
    }
}

/**
 * Updates visual highlighting of the current leader
 */
function updateLeaderHighlight() {
    try {
        const leader = getLeader();
        
        // Remove existing leader highlights
        const existingLeaders = document.querySelectorAll('.score-row.leader');
        existingLeaders.forEach(function(row) {
            row.classList.remove('leader');
        });
        
        // Add leader highlight to current leader
        if (leader) {
            const leaderRow = document.querySelector('.score-row[data-player="' + leader + '"]');
            if (leaderRow) {
                leaderRow.classList.add('leader');
            }
        }
        
    } catch (error) {
        console.error('Error updating leader highlight:', error);
    }
}

/**
 * Toggles the visibility of round-by-round details for a player
 * @param {string} playerId - The player's name/ID
 */
function togglePlayerDetails(playerId) {
    const detailsElement = document.getElementById('details-' + playerId);
    if (detailsElement) {
        const isVisible = detailsElement.style.display !== 'none';
        detailsElement.style.display = isVisible ? 'none' : 'block';
        
        // Update button text
        const btn = document.querySelector('.details-btn[data-player="' + playerId + '"]');
        if (btn) {
            btn.textContent = isVisible ? 'View Rounds' : 'Hide Rounds';
        }
    }
}

// Optional module.exports guard for test compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderScoreBoard, renderRoundProgress, updateLeaderHighlight };
}