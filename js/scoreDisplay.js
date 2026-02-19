/**
 * Score Display Management
 * Handles rendering and updating score displays in the DOM
 */

// Import score manager functions (assuming they exist)
// import { getCurrentScores, getCurrentRound, getLeader } from './scoreManager.js';

class ScoreDisplay {
    constructor() {
        this.scoreBoard = document.getElementById('scoreBoard');
        this.roundProgress = document.getElementById('roundProgress');
        this.detailedScores = document.getElementById('detailedScores');
        this.isExpanded = false;
    }

    /**
     * Renders the main scoreboard with current total scores
     */
    renderScoreBoard(players = []) {
        if (!this.scoreBoard) {
            console.warn('Score board container not found');
            return;
        }

        // Clear existing content
        this.scoreBoard.innerHTML = '';

        if (players.length === 0) {
            this.scoreBoard.innerHTML = '<p class="no-scores">No scores available</p>';
            return;
        }

        // Create table structure
        const table = document.createElement('table');
        table.className = 'score-table';

        // Table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Player</th>
            <th>Total Score</th>
            <th>Rounds Played</th>
        `;
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Table body
        const tbody = document.createElement('tbody');
        
        // Sort players by total score (descending)
        const sortedPlayers = [...players].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
        
        sortedPlayers.forEach((player, index) => {
            const row = document.createElement('tr');
            row.className = `player-row ${index === 0 ? 'leader' : ''}`;
            row.dataset.playerId = player.id;
            
            row.innerHTML = `
                <td class="player-name">${this.escapeHtml(player.name)}</td>
                <td class="total-score">${player.totalScore || 0}</td>
                <td class="rounds-played">${player.roundsPlayed || 0}/10</td>
            `;
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        this.scoreBoard.appendChild(table);
        
        // Add expand/collapse button for detailed view
        const expandButton = document.createElement('button');
        expandButton.className = 'expand-button';
        expandButton.textContent = this.isExpanded ? 'Hide Details' : 'Show Round Details';
        expandButton.onclick = () => this.toggleDetailedView(players);
        
        this.scoreBoard.appendChild(expandButton);
    }

    /**
     * Renders round progress indicator
     */
    renderRoundProgress(currentRound = 1, totalRounds = 10) {
        if (!this.roundProgress) {
            console.warn('Round progress container not found');
            return;
        }

        this.roundProgress.innerHTML = '';

        // Round text
        const roundText = document.createElement('h3');
        roundText.className = 'round-text';
        roundText.textContent = `Round ${currentRound} of ${totalRounds}`;
        this.roundProgress.appendChild(roundText);

        // Progress bar
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        const percentage = (currentRound / totalRounds) * 100;
        progressFill.style.width = `${Math.min(percentage, 100)}%`;
        
        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressBar);
        
        // Progress text
        const progressText = document.createElement('span');
        progressText.className = 'progress-text';
        progressText.textContent = `${Math.round(percentage)}% Complete`;
        progressContainer.appendChild(progressText);
        
        this.roundProgress.appendChild(progressContainer);

        // Round indicators
        const roundIndicators = document.createElement('div');
        roundIndicators.className = 'round-indicators';
        
        for (let i = 1; i <= totalRounds; i++) {
            const indicator = document.createElement('div');
            indicator.className = `round-indicator ${i <= currentRound ? 'completed' : ''} ${i === currentRound ? 'current' : ''}`;
            indicator.textContent = i;
            roundIndicators.appendChild(indicator);
        }
        
        this.roundProgress.appendChild(roundIndicators);
    }

    /**
     * Updates leader highlighting in the scoreboard
     */
    updateLeaderHighlight(leaderId = null) {
        if (!this.scoreBoard) {
            return;
        }

        // Remove existing leader highlights
        const existingLeaders = this.scoreBoard.querySelectorAll('.leader');
        existingLeaders.forEach(el => el.classList.remove('leader'));

        // Add leader highlight to new leader
        if (leaderId) {
            const leaderRow = this.scoreBoard.querySelector(`[data-player-id="${leaderId}"]`);
            if (leaderRow) {
                leaderRow.classList.add('leader');
            }
        } else {
            // If no specific leader ID, highlight the first row (highest score)
            const firstRow = this.scoreBoard.querySelector('.player-row');
            if (firstRow) {
                firstRow.classList.add('leader');
            }
        }
    }

    /**
     * Toggles detailed round-by-round score view
     */
    toggleDetailedView(players = []) {
        if (!this.detailedScores) {
            // Create detailed scores container if it doesn't exist
            this.detailedScores = document.createElement('div');
            this.detailedScores.id = 'detailedScores';
            this.detailedScores.className = 'detailed-scores';
            this.scoreBoard.parentNode.insertBefore(this.detailedScores, this.scoreBoard.nextSibling);
        }

        this.isExpanded = !this.isExpanded;
        
        const expandButton = this.scoreBoard.querySelector('.expand-button');
        if (expandButton) {
            expandButton.textContent = this.isExpanded ? 'Hide Details' : 'Show Round Details';
        }

        if (this.isExpanded) {
            this.renderDetailedScores(players);
            this.detailedScores.style.display = 'block';
        } else {
            this.detailedScores.style.display = 'none';
        }
    }

    /**
     * Renders detailed round-by-round scores
     */
    renderDetailedScores(players = []) {
        if (!this.detailedScores) return;

        this.detailedScores.innerHTML = '';

        if (players.length === 0) {
            this.detailedScores.innerHTML = '<p class="no-details">No detailed scores available</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'detailed-score-table';

        // Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        let headerHTML = '<th>Player</th>';
        
        // Determine max rounds played
        const maxRounds = Math.max(...players.map(p => (p.roundScores || []).length), 1);
        
        for (let i = 1; i <= Math.min(maxRounds, 10); i++) {
            headerHTML += `<th>R${i}</th>`;
        }
        headerHTML += '<th>Total</th>';
        
        headerRow.innerHTML = headerHTML;
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        
        players.forEach(player => {
            const row = document.createElement('tr');
            row.dataset.playerId = player.id;
            
            let rowHTML = `<td class="player-name">${this.escapeHtml(player.name)}</td>`;
            
            const roundScores = player.roundScores || [];
            for (let i = 0; i < Math.min(maxRounds, 10); i++) {
                const score = roundScores[i] !== undefined ? roundScores[i] : '-';
                rowHTML += `<td class="round-score">${score}</td>`;
            }
            
            rowHTML += `<td class="total-score"><strong>${player.totalScore || 0}</strong></td>`;
            
            row.innerHTML = rowHTML;
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        this.detailedScores.appendChild(table);
    }

    /**
     * Utility function to escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Updates all score displays
     */
    updateAll(players = [], currentRound = 1, leaderId = null) {
        this.renderScoreBoard(players);
        this.renderRoundProgress(currentRound);
        this.updateLeaderHighlight(leaderId);
        
        if (this.isExpanded) {
            this.renderDetailedScores(players);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoreDisplay;
} else {
    window.ScoreDisplay = ScoreDisplay;
}

// Create global instance
const scoreDisplay = new ScoreDisplay();

// Export functions for direct use
function renderScoreBoard(players) {
    return scoreDisplay.renderScoreBoard(players);
}

function renderRoundProgress(currentRound, totalRounds) {
    return scoreDisplay.renderRoundProgress(currentRound, totalRounds);
}

function updateLeaderHighlight(leaderId) {
    return scoreDisplay.updateLeaderHighlight(leaderId);
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports.renderScoreBoard = renderScoreBoard;
    module.exports.renderRoundProgress = renderRoundProgress;
    module.exports.updateLeaderHighlight = updateLeaderHighlight;
} else {
    window.renderScoreBoard = renderScoreBoard;
    window.renderRoundProgress = renderRoundProgress;
    window.updateLeaderHighlight = updateLeaderHighlight;
}