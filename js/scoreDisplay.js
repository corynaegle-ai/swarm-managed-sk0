/**
 * Score Display Module
 * Handles rendering and updating of score displays in the DOM
 */

/**
 * Renders the main scoreboard with current total scores for all players
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
            return getTotalScore(b) - getTotalScore(a);
        });

        let html = '<div class="scoreboard">';
        html += '<h3>Current Standings</h3>';
        html += '<div class="score-table">';
        html += '<div class="score-header">';
        html += '<div class="player-name-col">Player</div>';
        html += '<div class="total-score-col">Total Score</div>';
        html += '<div class="actions-col">Details</div>';
        html += '</div>';

        sortedPlayers.forEach(function(playerId, index) {
            const totalScore = getTotalScore(playerId);
            const isLeader = getLeader() === playerId;
            
            const rowDiv = document.createElement('div');
            rowDiv.className = 'score-row' + (isLeader ? ' leader-row' : '');
            rowDiv.setAttribute('data-player-id', playerId);
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'player-name-col';
            nameDiv.textContent = playerId;
            if (index === 0) {
                const crownSpan = document.createElement('span');
                crownSpan.className = 'leader-crown';
                crownSpan.textContent = ' 👑';
                nameDiv.appendChild(crownSpan);
            }
            
            const scoreDiv = document.createElement('div');
            scoreDiv.className = 'total-score-col';
            scoreDiv.textContent = totalScore.toString();
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'actions-col';
            
            const detailsBtn = document.createElement('button');
            detailsBtn.className = 'details-btn';
            detailsBtn.textContent = 'View Rounds';
            detailsBtn.addEventListener('click', function() {
                togglePlayerDetails(playerId);
            });
            
            actionsDiv.appendChild(detailsBtn);
            rowDiv.appendChild(nameDiv);
            rowDiv.appendChild(scoreDiv);
            rowDiv.appendChild(actionsDiv);
            
            container.querySelector('.score-table').appendChild(rowDiv);
        });

        html += '</div></div>';
        container.innerHTML = html;
        
        // Re-attach event listeners after innerHTML update
        sortedPlayers.forEach(function(playerId) {
            const row = container.querySelector('[data-player-id="' + playerId + '"]');
            if (row) {
                const btn = row.querySelector('.details-btn');
                if (btn) {
                    btn.addEventListener('click', function() {
                        togglePlayerDetails(playerId);
                    });
                }
            }
        });
        
    } catch (error) {
        console.error('Error rendering scoreboard:', error);
        container.innerHTML = '<div class="error">Error loading scores</div>';
    }
}

/**
 * Shows round-by-round breakdown for a specific player
 */
function togglePlayerDetails(playerId) {
    const container = document.getElementById('scoreboard-container');
    if (!container) return;
    
    const existingDetails = document.getElementById('player-details-' + playerId);
    if (existingDetails) {
        existingDetails.remove();
        return;
    }
    
    try {
        const rounds = getPlayerRounds(playerId);
        const currentRound = getCurrentRound();
        
        const detailsDiv = document.createElement('div');
        detailsDiv.id = 'player-details-' + playerId;
        detailsDiv.className = 'player-details';
        
        let html = '<h4>' + playerId + ' - Round by Round</h4>';
        html += '<div class="rounds-grid">';
        
        for (let i = 0; i < 10; i++) {
            const roundNum = i + 1;
            const score = rounds[i] !== undefined ? rounds[i] : '-';
            const isCurrentRound = roundNum === currentRound && score === '-';
            const isCompleted = rounds[i] !== undefined;
            
            html += '<div class="round-cell' + 
                   (isCurrentRound ? ' current-round' : '') + 
                   (isCompleted ? ' completed-round' : '') + '">';
            html += '<div class="round-number">R' + roundNum + '</div>';
            html += '<div class="round-score">' + score + '</div>';
            html += '</div>';
        }
        
        html += '</div>';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-details-btn';
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', function() {
            detailsDiv.remove();
        });
        
        detailsDiv.innerHTML = html;
        detailsDiv.appendChild(closeBtn);
        
        const playerRow = container.querySelector('[data-player-id="' + playerId + '"]');
        if (playerRow && playerRow.parentNode) {
            playerRow.parentNode.insertBefore(detailsDiv, playerRow.nextSibling);
        }
        
    } catch (error) {
        console.error('Error showing player details:', error);
    }
}

/**
 * Renders the current round progress indicator
 */
function renderRoundProgress() {
    const container = document.getElementById('round-progress-container');
    if (!container) return;
    
    try {
        const currentRound = getCurrentRound();
        const totalRounds = 10;
        
        let html = '<div class="round-progress">';
        html += '<h3>Round Progress</h3>';
        html += '<div class="round-indicator">';
        html += '<span class="round-text">Round ' + currentRound + ' of ' + totalRounds + '</span>';
        html += '</div>';
        
        // Progress bar
        html += '<div class="progress-bar-container">';
        html += '<div class="progress-bar">';
        const progressPercent = ((currentRound - 1) / totalRounds) * 100;
        html += '<div class="progress-fill" style="width: ' + progressPercent + '%"></div>';
        html += '</div>';
        html += '</div>';
        
        // Round circles
        html += '<div class="round-circles">';
        for (let i = 1; i <= totalRounds; i++) {
            const isCompleted = i < currentRound;
            const isCurrent = i === currentRound;
            html += '<div class="round-circle' + 
                   (isCompleted ? ' completed' : '') + 
                   (isCurrent ? ' current' : '') + '">' + i + '</div>';
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
 * Updates visual highlighting for the current leader
 */
function updateLeaderHighlight() {
    try {
        const leader = getLeader();
        
        // Remove existing leader highlights
        const existingLeaderRows = document.querySelectorAll('.leader-row');
        existingLeaderRows.forEach(function(row) {
            row.classList.remove('leader-row');
        });
        
        const existingCrowns = document.querySelectorAll('.leader-crown');
        existingCrowns.forEach(function(crown) {
            crown.remove();
        });
        
        if (!leader) return;
        
        // Add leader highlight to current leader
        const leaderRow = document.querySelector('[data-player-id="' + leader + '"]');
        if (leaderRow) {
            leaderRow.classList.add('leader-row');
            
            const nameCell = leaderRow.querySelector('.player-name-col');
            if (nameCell) {
                const crownSpan = document.createElement('span');
                crownSpan.className = 'leader-crown';
                crownSpan.textContent = ' 👑';
                nameCell.appendChild(crownSpan);
            }
        }
        
    } catch (error) {
        console.error('Error updating leader highlight:', error);
    }
}

// Optional module.exports guard for test compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderScoreBoard, renderRoundProgress, updateLeaderHighlight };
}