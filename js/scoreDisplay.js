/**
 * Score Display Module
 * Handles rendering of score displays, leaderboards, and round progress
 */

/**
 * Renders the main scoreboard with current total scores for all players
 * Displays players sorted by total score (highest first)
 */
function renderScoreBoard() {
    const container = document.getElementById('scoreboard-container');
    if (!container) return;

    try {
        const allScores = getAllScores();
        const playerIds = Object.keys(allScores);
        
        if (playerIds.length === 0) {
            container.innerHTML = '<p class="no-players">No players registered yet.</p>';
            return;
        }

        // Sort players by total score (highest first)
        const sortedPlayers = playerIds.sort((a, b) => {
            return getTotalScore(b) - getTotalScore(a);
        });

        let html = '<div class="scoreboard">';
        html += '<h2>Current Standings</h2>';
        html += '<table class="score-table">';
        html += '<thead><tr><th>Rank</th><th>Player</th><th>Total Score</th><th>Actions</th></tr></thead>';
        html += '<tbody>';

        sortedPlayers.forEach(function(playerId, index) {
            const totalScore = getTotalScore(playerId);
            const isLeader = getLeader() === playerId;
            const rowClass = isLeader ? 'leader-row' : '';
            
            html += '<tr class="' + rowClass + '" data-player="' + playerId + '">';
            html += '<td class="rank">' + (index + 1) + '</td>';
            html += '<td class="player-name">' + escapeHtml(playerId) + '</td>';
            html += '<td class="total-score">' + totalScore + '</td>';
            html += '<td class="actions">';
            html += '<button class="details-btn" data-player="' + playerId + '">View Details</button>';
            html += '</td>';
            html += '</tr>';
            
            // Hidden details row
            html += '<tr class="details-row" id="details-' + playerId + '" style="display: none;">';
            html += '<td colspan="4">';
            html += '<div class="round-breakdown">';
            html += '<h4>Round-by-Round Scores for ' + escapeHtml(playerId) + '</h4>';
            
            const rounds = getPlayerRounds(playerId);
            if (rounds.length > 0) {
                html += '<div class="rounds-grid">';
                rounds.forEach(function(score, roundIndex) {
                    html += '<div class="round-score">';
                    html += '<span class="round-label">R' + (roundIndex + 1) + '</span>';
                    html += '<span class="round-value">' + score + '</span>';
                    html += '</div>';
                });
                html += '</div>';
            } else {
                html += '<p>No rounds completed yet.</p>';
            }
            
            html += '</div>';
            html += '</td>';
            html += '</tr>';
        });

        html += '</tbody></table></div>';
        container.innerHTML = html;

        // Add event listeners for detail buttons
        const detailBtns = container.querySelectorAll('.details-btn');
        detailBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const playerId = btn.getAttribute('data-player');
                togglePlayerDetails(playerId);
            });
        });

    } catch (error) {
        console.error('Error rendering scoreboard:', error);
        container.innerHTML = '<p class="error">Error loading scoreboard. Please refresh.</p>';
    }
}

/**
 * Renders the round progress indicator showing current round and progress
 */
function renderRoundProgress() {
    const container = document.getElementById('round-progress-container');
    if (!container) return;

    try {
        const currentRound = getCurrentRound();
        const totalRounds = 10;
        const progressPercent = ((currentRound - 1) / totalRounds) * 100;

        let html = '<div class="round-progress">';
        html += '<h3>Round ' + currentRound + ' of ' + totalRounds + '</h3>';
        html += '<div class="progress-bar">';
        html += '<div class="progress-fill" style="width: ' + progressPercent + '%"></div>';
        html += '</div>';
        html += '<div class="round-indicators">';
        
        for (let i = 1; i <= totalRounds; i++) {
            let className = 'round-indicator';
            if (i < currentRound) {
                className += ' completed';
            } else if (i === currentRound) {
                className += ' current';
            }
            html += '<div class="' + className + '">' + i + '</div>';
        }
        
        html += '</div>';
        html += '</div>';
        
        container.innerHTML = html;

    } catch (error) {
        console.error('Error rendering round progress:', error);
        container.innerHTML = '<p class="error">Error loading round progress.</p>';
    }
}

/**
 * Updates the visual highlighting for the current leader
 */
function updateLeaderHighlight() {
    try {
        // Remove existing leader highlights
        const existingLeaders = document.querySelectorAll('.leader-row');
        existingLeaders.forEach(function(row) {
            row.classList.remove('leader-row');
        });

        // Add leader highlight to current leader
        const leader = getLeader();
        if (leader) {
            const leaderRow = document.querySelector('[data-player="' + leader + '"]');
            if (leaderRow) {
                leaderRow.classList.add('leader-row');
            }
        }
    } catch (error) {
        console.error('Error updating leader highlight:', error);
    }
}

/**
 * Toggles the visibility of player details (round-by-round scores)
 * @param {string} playerId - The player name to toggle details for
 */
function togglePlayerDetails(playerId) {
    const detailsRow = document.getElementById('details-' + playerId);
    const btn = document.querySelector('.details-btn[data-player="' + playerId + '"]');
    
    if (!detailsRow || !btn) return;
    
    const isVisible = detailsRow.style.display !== 'none';
    
    if (isVisible) {
        detailsRow.style.display = 'none';
        btn.textContent = 'View Details';
    } else {
        detailsRow.style.display = 'table-row';
        btn.textContent = 'Hide Details';
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

/**
 * Initialize score display when DOM is ready
 */
function initScoreDisplay() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            renderScoreBoard();
            renderRoundProgress();
        });
    } else {
        renderScoreBoard();
        renderRoundProgress();
    }
}

// Auto-initialize
initScoreDisplay();

// Optional module.exports for test compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        renderScoreBoard, 
        renderRoundProgress, 
        updateLeaderHighlight,
        togglePlayerDetails,
        escapeHtml
    };
}