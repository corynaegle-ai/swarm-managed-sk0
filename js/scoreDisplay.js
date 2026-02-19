/**
 * Score Display UI Components
 * Renders score displays, round progress, and leader highlighting
 */

/**
 * Renders the main scoreboard with current total scores
 * @param {string} containerId - ID of the container element to render into
 */
function renderScoreBoard(containerId = 'scoreboard-container') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn('Scoreboard container not found:', containerId);
        return;
    }

    try {
        const allScores = getAllScores();
        const playerIds = Object.keys(allScores);
        
        if (playerIds.length === 0) {
            container.innerHTML = '<div class="score-empty">No players added yet</div>';
            return;
        }

        // Sort players by total score (descending)
        const sortedPlayers = playerIds.sort((a, b) => {
            return getTotalScore(b) - getTotalScore(a);
        });

        let html = '<div class="scoreboard">';
        html += '<h2>Current Scores</h2>';
        html += '<div class="score-table">';
        html += '<div class="score-header">';
        html += '<span class="rank-col">Rank</span>';
        html += '<span class="name-col">Player</span>';
        html += '<span class="score-col">Total Score</span>';
        html += '<span class="details-col">Details</span>';
        html += '</div>';

        sortedPlayers.forEach((playerId, index) => {
            const totalScore = getTotalScore(playerId);
            const rank = index + 1;
            const isLeader = getLeader() === playerId;
            
            html += `<div class="score-row ${isLeader ? 'leader' : ''}" data-player="${playerId}">`;
            html += `<span class="rank-col">${rank}</span>`;
            html += `<span class="name-col">${playerId}</span>`;
            html += `<span class="score-col">${totalScore}</span>`;
            html += `<span class="details-col"><button class="details-btn" data-player="${playerId}">Details</button></span>`;
            html += '</div>';
            
            // Add expandable details row
            html += `<div class="score-details" id="details-${playerId}" style="display: none;">`;
            html += renderPlayerDetails(playerId);
            html += '</div>';
        });

        html += '</div></div>';
        container.innerHTML = html;

        // Add event listeners for detail buttons
        const detailButtons = container.querySelectorAll('.details-btn');
        detailButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const playerId = this.getAttribute('data-player');
                togglePlayerDetails(playerId);
            });
        });

    } catch (error) {
        console.error('Error rendering scoreboard:', error);
        container.innerHTML = '<div class="score-error">Error loading scores</div>';
    }
}

/**
 * Renders round progress indicator
 * @param {string} containerId - ID of the container element to render into
 */
function renderRoundProgress(containerId = 'round-progress-container') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn('Round progress container not found:', containerId);
        return;
    }

    try {
        const currentRound = getCurrentRound();
        const totalRounds = 10;
        
        let html = '<div class="round-progress">';
        html += `<h3>Round ${currentRound} of ${totalRounds}</h3>`;
        
        // Progress bar
        const progressPercent = (currentRound / totalRounds) * 100;
        html += '<div class="progress-bar">';
        html += `<div class="progress-fill" style="width: ${progressPercent}%"></div>`;
        html += '</div>';
        
        // Round indicators
        html += '<div class="round-indicators">';
        for (let i = 1; i <= totalRounds; i++) {
            const status = i < currentRound ? 'completed' : (i === currentRound ? 'current' : 'upcoming');
            html += `<span class="round-indicator ${status}">${i}</span>`;
        }
        html += '</div>';
        
        html += '</div>';
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error rendering round progress:', error);
        container.innerHTML = '<div class="score-error">Error loading round progress</div>';
    }
}

/**
 * Updates visual highlighting for the current leader
 */
function updateLeaderHighlight() {
    try {
        // Remove existing leader highlights
        const existingLeaders = document.querySelectorAll('.score-row.leader');
        existingLeaders.forEach(row => {
            row.classList.remove('leader');
        });
        
        // Add highlight to current leader
        const leader = getLeader();
        if (leader) {
            const leaderRow = document.querySelector(`.score-row[data-player="${leader}"]`);
            if (leaderRow) {
                leaderRow.classList.add('leader');
            }
        }
        
    } catch (error) {
        console.error('Error updating leader highlight:', error);
    }
}

/**
 * Renders detailed round-by-round scores for a player
 * @param {string} playerId - The player's name
 * @returns {string} HTML string for player details
 */
function renderPlayerDetails(playerId) {
    try {
        const rounds = getPlayerRounds(playerId);
        const currentRound = getCurrentRound();
        
        let html = '<div class="player-details">';
        html += `<h4>${playerId} - Round Breakdown</h4>`;
        html += '<div class="rounds-grid">';
        
        for (let i = 0; i < 10; i++) {
            const roundNum = i + 1;
            const score = rounds[i] !== undefined ? rounds[i] : '-';
            const status = roundNum < currentRound ? 'completed' : (roundNum === currentRound ? 'current' : 'upcoming');
            
            html += `<div class="round-score ${status}">`;
            html += `<span class="round-label">R${roundNum}</span>`;
            html += `<span class="round-value">${score}</span>`;
            html += '</div>';
        }
        
        html += '</div></div>';
        return html;
        
    } catch (error) {
        console.error('Error rendering player details:', error);
        return '<div class="score-error">Error loading player details</div>';
    }
}

/**
 * Toggles the visibility of player details
 * @param {string} playerId - The player's name
 */
function togglePlayerDetails(playerId) {
    const detailsElement = document.getElementById(`details-${playerId}`);
    if (detailsElement) {
        const isVisible = detailsElement.style.display !== 'none';
        detailsElement.style.display = isVisible ? 'none' : 'block';
        
        // Update button text
        const button = document.querySelector(`[data-player="${playerId}"]`);
        if (button) {
            button.textContent = isVisible ? 'Details' : 'Hide';
        }
    }
}

// Optional module.exports guard for test compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderScoreBoard, renderRoundProgress, updateLeaderHighlight };
}