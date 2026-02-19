/**
 * Score Display Module
 * Handles rendering of scoreboard, round progress, and leader highlighting
 */

/**
 * Renders the main scoreboard with all player scores
 */
function renderScoreBoard() {
    const container = document.getElementById('scoreboard-container');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Get all player data
    const allScores = getAllScores();
    const playerIds = Object.keys(allScores);

    if (playerIds.length === 0) {
        container.innerHTML = '<div class="no-players">No players added yet</div>';
        return;
    }

    // Create scoreboard table
    const table = document.createElement('table');
    table.className = 'scoreboard-table';

    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const nameHeader = document.createElement('th');
    nameHeader.textContent = 'Player';
    headerRow.appendChild(nameHeader);

    const scoreHeader = document.createElement('th');
    scoreHeader.textContent = 'Total Score';
    headerRow.appendChild(scoreHeader);

    const detailsHeader = document.createElement('th');
    detailsHeader.textContent = 'Details';
    headerRow.appendChild(detailsHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create tbody
    const tbody = document.createElement('tbody');

    // Sort players by total score (descending)
    const sortedPlayerIds = playerIds.sort((a, b) => {
        return getTotalScore(b) - getTotalScore(a);
    });

    sortedPlayerIds.forEach(function(playerId) {
        const row = document.createElement('tr');
        row.setAttribute('data-player-id', playerId);
        
        // Player name cell
        const nameCell = document.createElement('td');
        nameCell.className = 'player-name';
        nameCell.textContent = playerId;
        row.appendChild(nameCell);

        // Total score cell
        const scoreCell = document.createElement('td');
        scoreCell.className = 'total-score';
        scoreCell.textContent = getTotalScore(playerId);
        row.appendChild(scoreCell);

        // Details button cell
        const detailsCell = document.createElement('td');
        const detailsButton = document.createElement('button');
        detailsButton.className = 'details-btn';
        detailsButton.textContent = 'Show Details';
        detailsButton.addEventListener('click', function() {
            togglePlayerDetails(playerId);
        });
        detailsCell.appendChild(detailsButton);
        row.appendChild(detailsCell);

        tbody.appendChild(row);

        // Create hidden details row
        const detailsRow = document.createElement('tr');
        detailsRow.className = 'player-details';
        detailsRow.id = 'details-' + playerId;
        detailsRow.style.display = 'none';

        const detailsColspan = document.createElement('td');
        detailsColspan.setAttribute('colspan', '3');
        
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'details-content';
        
        // Round-by-round breakdown
        const rounds = getPlayerRounds(playerId);
        const roundsTitle = document.createElement('h4');
        roundsTitle.textContent = 'Round-by-Round Scores:';
        detailsDiv.appendChild(roundsTitle);

        const roundsList = document.createElement('ul');
        roundsList.className = 'rounds-list';
        
        rounds.forEach(function(score, index) {
            const listItem = document.createElement('li');
            listItem.textContent = 'Round ' + (index + 1) + ': ' + score;
            roundsList.appendChild(listItem);
        });
        
        detailsDiv.appendChild(roundsList);
        detailsColspan.appendChild(detailsDiv);
        detailsRow.appendChild(detailsColspan);
        
        tbody.appendChild(detailsRow);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    // Update leader highlighting after rendering
    updateLeaderHighlight();
}

/**
 * Toggles the visibility of player details
 * @param {string} playerId - The player's name/ID
 */
function togglePlayerDetails(playerId) {
    const detailsRow = document.getElementById('details-' + playerId);
    const button = document.querySelector('[data-player-id="' + playerId + '"] .details-btn');
    
    if (!detailsRow || !button) return;

    if (detailsRow.style.display === 'none') {
        detailsRow.style.display = 'table-row';
        button.textContent = 'Hide Details';
    } else {
        detailsRow.style.display = 'none';
        button.textContent = 'Show Details';
    }
}

/**
 * Renders the round progress indicator
 */
function renderRoundProgress() {
    const container = document.getElementById('round-progress-container');
    if (!container) return;

    const currentRound = getCurrentRound();
    const totalRounds = 10;

    // Clear existing content
    container.innerHTML = '';

    // Create round progress header
    const header = document.createElement('h3');
    header.className = 'round-progress-header';
    header.textContent = 'Round ' + currentRound + ' of ' + totalRounds;
    container.appendChild(header);

    // Create progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-bar-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    progressFill.style.width = ((currentRound / totalRounds) * 100) + '%';
    
    progressBar.appendChild(progressFill);
    progressContainer.appendChild(progressBar);
    container.appendChild(progressContainer);

    // Create round indicators
    const roundIndicators = document.createElement('div');
    roundIndicators.className = 'round-indicators';
    
    for (let i = 1; i <= totalRounds; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'round-indicator';
        indicator.textContent = i;
        
        if (i < currentRound) {
            indicator.classList.add('completed');
        } else if (i === currentRound) {
            indicator.classList.add('current');
        } else {
            indicator.classList.add('upcoming');
        }
        
        roundIndicators.appendChild(indicator);
    }
    
    container.appendChild(roundIndicators);
}

/**
 * Updates the visual highlighting of the current leader
 */
function updateLeaderHighlight() {
    // Remove existing leader highlights
    const existingLeaders = document.querySelectorAll('.leader-highlight');
    existingLeaders.forEach(function(element) {
        element.classList.remove('leader-highlight');
    });

    // Get current leader
    const leader = getLeader();
    if (!leader) return;

    // Add leader highlight to the leader's row
    const leaderRow = document.querySelector('[data-player-id="' + leader + '"]');
    if (leaderRow) {
        leaderRow.classList.add('leader-highlight');
    }
}

/**
 * Refreshes all score displays
 */
function refreshScoreDisplays() {
    renderScoreBoard();
    renderRoundProgress();
}

// Optional module.exports guard for test compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderScoreBoard: renderScoreBoard,
        renderRoundProgress: renderRoundProgress,
        updateLeaderHighlight: updateLeaderHighlight,
        togglePlayerDetails: togglePlayerDetails,
        refreshScoreDisplays: refreshScoreDisplays
    };
}