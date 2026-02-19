/**
 * Score Display Module
 * Handles rendering and updating score displays in the DOM
 */

// Import scoreManager functions (assuming they exist)
// import { getTotalScores, getCurrentRound, getRoundScores, getLeader } from './scoreManager.js';

/**
 * Renders the main scoreboard displaying total scores for all players
 */
function renderScoreBoard() {
    try {
        const scoreboardContainer = document.getElementById('scoreboard');
        if (!scoreboardContainer) {
            console.error('Scoreboard container not found');
            return;
        }

        // Get scores from scoreManager (mock data for now)
        const totalScores = getTotalScores ? getTotalScores() : {
            'Player 1': 2450,
            'Player 2': 1980,
            'Player 3': 2100,
            'Player 4': 1750
        };

        // Clear existing content
        scoreboardContainer.innerHTML = '';

        // Create scoreboard table
        const table = document.createElement('table');
        table.className = 'scoreboard-table';

        // Create header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const playerHeader = document.createElement('th');
        playerHeader.textContent = 'Player';
        const scoreHeader = document.createElement('th');
        scoreHeader.textContent = 'Total Score';
        headerRow.appendChild(playerHeader);
        headerRow.appendChild(scoreHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create body with player scores
        const tbody = document.createElement('tbody');
        
        // Sort players by score (descending)
        const sortedPlayers = Object.entries(totalScores)
            .sort(([,a], [,b]) => b - a);

        sortedPlayers.forEach(([player, score], index) => {
            const row = document.createElement('tr');
            row.className = index === 0 ? 'leader' : '';
            
            const playerCell = document.createElement('td');
            playerCell.textContent = player;
            const scoreCell = document.createElement('td');
            scoreCell.textContent = score.toLocaleString();
            
            row.appendChild(playerCell);
            row.appendChild(scoreCell);
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        scoreboardContainer.appendChild(table);

    } catch (error) {
        console.error('Error rendering scoreboard:', error);
    }
}

/**
 * Renders the round progress display
 */
function renderRoundProgress() {
    try {
        const roundProgressContainer = document.getElementById('round-progress');
        if (!roundProgressContainer) {
            console.error('Round progress container not found');
            return;
        }

        // Get current round from scoreManager (mock data for now)
        const currentRound = getCurrentRound ? getCurrentRound() : 3;
        const totalRounds = 10;
        const roundScores = getRoundScores ? getRoundScores() : {
            1: { 'Player 1': 450, 'Player 2': 380, 'Player 3': 420, 'Player 4': 350 },
            2: { 'Player 1': 520, 'Player 2': 480, 'Player 3': 410, 'Player 4': 390 },
            3: { 'Player 1': 380, 'Player 2': 440, 'Player 3': 460, 'Player 4': 320 }
        };

        // Clear existing content
        roundProgressContainer.innerHTML = '';

        // Create round header
        const roundHeader = document.createElement('div');
        roundHeader.className = 'round-header';
        roundHeader.innerHTML = `<h3>Round ${currentRound} of ${totalRounds}</h3>`;
        roundProgressContainer.appendChild(roundHeader);

        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${(currentRound / totalRounds) * 100}%`;
        progressBar.appendChild(progressFill);
        roundProgressContainer.appendChild(progressBar);

        // Create expandable round breakdown
        const roundBreakdown = document.createElement('div');
        roundBreakdown.className = 'round-breakdown';
        
        const breakdownHeader = document.createElement('button');
        breakdownHeader.className = 'breakdown-toggle';
        breakdownHeader.textContent = 'Show Round Breakdown';
        breakdownHeader.setAttribute('aria-expanded', 'false');
        
        const breakdownContent = document.createElement('div');
        breakdownContent.className = 'breakdown-content';
        breakdownContent.style.display = 'none';

        // Add round-by-round scores
        Object.entries(roundScores).forEach(([round, scores]) => {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'round-detail';
            
            const roundTitle = document.createElement('h4');
            roundTitle.textContent = `Round ${round}`;
            roundDiv.appendChild(roundTitle);

            const roundTable = document.createElement('table');
            roundTable.className = 'round-table';
            
            Object.entries(scores).forEach(([player, score]) => {
                const row = document.createElement('tr');
                const playerCell = document.createElement('td');
                playerCell.textContent = player;
                const scoreCell = document.createElement('td');
                scoreCell.textContent = score.toLocaleString();
                row.appendChild(playerCell);
                row.appendChild(scoreCell);
                roundTable.appendChild(row);
            });

            roundDiv.appendChild(roundTable);
            breakdownContent.appendChild(roundDiv);
        });

        // Add toggle functionality
        breakdownHeader.addEventListener('click', () => {
            const isVisible = breakdownContent.style.display !== 'none';
            breakdownContent.style.display = isVisible ? 'none' : 'block';
            breakdownHeader.textContent = isVisible ? 'Show Round Breakdown' : 'Hide Round Breakdown';
            breakdownHeader.setAttribute('aria-expanded', !isVisible);
        });

        roundBreakdown.appendChild(breakdownHeader);
        roundBreakdown.appendChild(breakdownContent);
        roundProgressContainer.appendChild(roundBreakdown);

    } catch (error) {
        console.error('Error rendering round progress:', error);
    }
}

/**
 * Updates the visual highlighting of the current leader
 */
function updateLeaderHighlight() {
    try {
        // Remove existing leader highlights
        const existingLeaders = document.querySelectorAll('.leader');
        existingLeaders.forEach(element => {
            element.classList.remove('leader');
        });

        // Get current leader from scoreManager (mock data for now)
        const leader = getLeader ? getLeader() : 'Player 1';
        const totalScores = getTotalScores ? getTotalScores() : {
            'Player 1': 2450,
            'Player 2': 1980,
            'Player 3': 2100,
            'Player 4': 1750
        };

        // Find the highest score
        const maxScore = Math.max(...Object.values(totalScores));
        
        // Highlight all players with the highest score (in case of ties)
        const scoreboard = document.querySelector('.scoreboard-table tbody');
        if (scoreboard) {
            const rows = scoreboard.querySelectorAll('tr');
            rows.forEach(row => {
                const playerCell = row.querySelector('td:first-child');
                const scoreCell = row.querySelector('td:last-child');
                
                if (playerCell && scoreCell) {
                    const playerName = playerCell.textContent;
                    const playerScore = parseInt(scoreCell.textContent.replace(/,/g, ''));
                    
                    if (playerScore === maxScore) {
                        row.classList.add('leader');
                    }
                }
            });
        }

        // Also highlight in other displays if they exist
        const allPlayerElements = document.querySelectorAll('[data-player]');
        allPlayerElements.forEach(element => {
            const playerName = element.getAttribute('data-player');
            if (totalScores[playerName] === maxScore) {
                element.classList.add('leader');
            }
        });

    } catch (error) {
        console.error('Error updating leader highlight:', error);
    }
}

/**
 * Initialize score displays
 */
function initializeScoreDisplay() {
    renderScoreBoard();
    renderRoundProgress();
    updateLeaderHighlight();
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderScoreBoard,
        renderRoundProgress,
        updateLeaderHighlight,
        initializeScoreDisplay
    };
}

// Make functions available globally for browser use
if (typeof window !== 'undefined') {
    window.scoreDisplay = {
        renderScoreBoard,
        renderRoundProgress,
        updateLeaderHighlight,
        initializeScoreDisplay
    };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initializeScoreDisplay);
}