// Score Display UI Components
// Handles rendering score displays in the DOM

// Import scoreManager functions (assuming scoreManager.js is available)
import { getPlayers, getPlayerTotalScore, getRoundScores, getCurrentRound, getLeader } from './scoreManager.js';

/**
 * Renders the main scoreboard displaying current total scores for all players
 * Targets DOM container with id 'scoreboard-container'
 */
export function renderScoreBoard() {
    try {
        const container = document.getElementById('scoreboard-container');
        if (!container) {
            console.error('Scoreboard container not found');
            return;
        }

        const players = getPlayers();
        if (!players || players.length === 0) {
            container.innerHTML = '<div class="no-players">No players added yet</div>';
            return;
        }

        // Create scoreboard table
        const table = document.createElement('table');
        table.className = 'scoreboard-table';
        
        // Create header
        const header = document.createElement('thead');
        header.innerHTML = `
            <tr>
                <th class="player-name">Player</th>
                <th class="total-score">Total Score</th>
                <th class="actions">Details</th>
            </tr>
        `;
        table.appendChild(header);

        // Create body with player scores
        const tbody = document.createElement('tbody');
        
        players.forEach((player, index) => {
            const totalScore = getPlayerTotalScore(player);
            const row = document.createElement('tr');
            row.className = 'player-row';
            row.dataset.playerId = `player-${index}`;
            
            row.innerHTML = `
                <td class="player-name">${player}</td>
                <td class="total-score">${totalScore}</td>
                <td class="actions">
                    <button class="toggle-details" onclick="togglePlayerDetails('player-${index}')">Show Details</button>
                </td>
            `;
            
            tbody.appendChild(row);
            
            // Add expandable details row
            const detailsRow = document.createElement('tr');
            detailsRow.className = 'player-details';
            detailsRow.id = `details-player-${index}`;
            detailsRow.style.display = 'none';
            
            const detailsCell = document.createElement('td');
            detailsCell.colSpan = 3;
            detailsCell.innerHTML = generatePlayerDetailsHTML(player);
            
            detailsRow.appendChild(detailsCell);
            tbody.appendChild(detailsRow);
        });
        
        table.appendChild(tbody);
        container.innerHTML = '';
        container.appendChild(table);
        
        // Update leader highlighting
        updateLeaderHighlight();
        
    } catch (error) {
        console.error('Error rendering scoreboard:', error);
    }
}

/**
 * Renders round progress display showing current round and breakdown
 * Targets DOM container with id 'round-progress-container'
 */
export function renderRoundProgress() {
    try {
        const container = document.getElementById('round-progress-container');
        if (!container) {
            console.error('Round progress container not found');
            return;
        }

        const currentRound = getCurrentRound();
        const totalRounds = 10;
        
        const progressHTML = `
            <div class="round-progress">
                <div class="round-header">
                    <h3>Round ${currentRound} of ${totalRounds}</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(currentRound / totalRounds) * 100}%"></div>
                    </div>
                </div>
                <div class="round-breakdown">
                    <button class="toggle-breakdown" onclick="toggleRoundBreakdown()">Show Round Breakdown</button>
                    <div class="breakdown-content" id="round-breakdown-content" style="display: none;">
                        ${generateRoundBreakdownHTML()}
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = progressHTML;
        
    } catch (error) {
        console.error('Error rendering round progress:', error);
    }
}

/**
 * Updates leader highlighting by adding .leader class to current leader's row
 */
export function updateLeaderHighlight() {
    try {
        // Remove existing leader highlighting
        const existingLeaders = document.querySelectorAll('.player-row.leader');
        existingLeaders.forEach(row => row.classList.remove('leader'));
        
        // Get current leader
        const leader = getLeader();
        if (!leader) return;
        
        // Find and highlight leader's row
        const players = getPlayers();
        const leaderIndex = players.indexOf(leader);
        
        if (leaderIndex !== -1) {
            const leaderRow = document.querySelector(`[data-player-id="player-${leaderIndex}"]`);
            if (leaderRow) {
                leaderRow.classList.add('leader');
            }
        }
        
    } catch (error) {
        console.error('Error updating leader highlight:', error);
    }
}

/**
 * Generates HTML for player details showing round-by-round scores
 * @param {string} player - Player name
 * @returns {string} HTML string for player details
 */
function generatePlayerDetailsHTML(player) {
    try {
        const roundScores = getRoundScores(player);
        const currentRound = getCurrentRound();
        
        let detailsHTML = '<div class="player-details-content">';
        detailsHTML += '<h4>Round-by-Round Scores</h4>';
        detailsHTML += '<div class="round-scores">';
        
        for (let round = 1; round <= 10; round++) {
            const score = roundScores && roundScores[round - 1] !== undefined ? roundScores[round - 1] : '-';
            const isCurrentRound = round === currentRound;
            const isCompleted = round < currentRound;
            
            detailsHTML += `
                <div class="round-score ${isCurrentRound ? 'current' : ''} ${isCompleted ? 'completed' : ''}">
                    <span class="round-number">R${round}</span>
                    <span class="score-value">${score}</span>
                </div>
            `;
        }
        
        detailsHTML += '</div></div>';
        return detailsHTML;
        
    } catch (error) {
        console.error('Error generating player details:', error);
        return '<div class="error">Error loading player details</div>';
    }
}

/**
 * Generates HTML for round breakdown showing all players' scores per round
 * @returns {string} HTML string for round breakdown
 */
function generateRoundBreakdownHTML() {
    try {
        const players = getPlayers();
        const currentRound = getCurrentRound();
        
        let breakdownHTML = '<div class="round-breakdown-table">';
        breakdownHTML += '<table class="breakdown-table">';
        
        // Header with round numbers
        breakdownHTML += '<thead><tr><th>Player</th>';
        for (let round = 1; round <= Math.min(currentRound, 10); round++) {
            breakdownHTML += `<th>R${round}</th>`;
        }
        breakdownHTML += '<th>Total</th></tr></thead>';
        
        // Player rows
        breakdownHTML += '<tbody>';
        players.forEach(player => {
            const roundScores = getRoundScores(player);
            const totalScore = getPlayerTotalScore(player);
            
            breakdownHTML += `<tr><td class="player-name">${player}</td>`;
            
            for (let round = 1; round <= Math.min(currentRound, 10); round++) {
                const score = roundScores && roundScores[round - 1] !== undefined ? roundScores[round - 1] : '-';
                breakdownHTML += `<td class="round-score">${score}</td>`;
            }
            
            breakdownHTML += `<td class="total-score"><strong>${totalScore}</strong></td></tr>`;
        });
        breakdownHTML += '</tbody></table></div>';
        
        return breakdownHTML;
        
    } catch (error) {
        console.error('Error generating round breakdown:', error);
        return '<div class="error">Error loading round breakdown</div>';
    }
}

// Global functions for onclick handlers
window.togglePlayerDetails = function(playerId) {
    const detailsRow = document.getElementById(`details-${playerId}`);
    const button = document.querySelector(`[data-player-id="${playerId}"] .toggle-details`);
    
    if (detailsRow.style.display === 'none') {
        detailsRow.style.display = 'table-row';
        button.textContent = 'Hide Details';
    } else {
        detailsRow.style.display = 'none';
        button.textContent = 'Show Details';
    }
};

window.toggleRoundBreakdown = function() {
    const content = document.getElementById('round-breakdown-content');
    const button = document.querySelector('.toggle-breakdown');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        button.textContent = 'Hide Round Breakdown';
    } else {
        content.style.display = 'none';
        button.textContent = 'Show Round Breakdown';
    }
};

// Auto-refresh functionality
let autoRefreshInterval;

export function startAutoRefresh(intervalMs = 1000) {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    autoRefreshInterval = setInterval(() => {
        renderScoreBoard();
        renderRoundProgress();
    }, intervalMs);
}

export function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}