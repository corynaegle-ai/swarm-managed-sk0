/**
 * Score Display Module
 * Handles rendering and updating score displays in the DOM
 */

// Import scoreManager functions (assuming they exist)
import { getCurrentScores, getRoundData, getLeader } from './scoreManager.js';

/**
 * Renders the main scoreboard with current total scores
 * Targets #scoreboard container in index.html
 */
export function renderScoreBoard() {
    const scoreboardContainer = document.getElementById('scoreboard');
    if (!scoreboardContainer) {
        console.error('Scoreboard container not found');
        return;
    }

    try {
        const scores = getCurrentScores();
        const leader = getLeader();
        
        let html = '<div class="score-table">';
        html += '<h3>Current Standings</h3>';
        html += '<table class="scores">';
        html += '<thead><tr><th>Player</th><th>Total Score</th></tr></thead>';
        html += '<tbody>';
        
        // Sort players by score (highest first)
        const sortedPlayers = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        
        sortedPlayers.forEach(([player, score]) => {
            const isLeader = player === leader;
            const rowClass = isLeader ? 'leader' : '';
            html += `<tr class="${rowClass}">`;
            html += `<td class="player-name">${player}</td>`;
            html += `<td class="player-score">${score}</td>`;
            html += '</tr>';
        });
        
        html += '</tbody></table></div>';
        scoreboardContainer.innerHTML = html;
        
    } catch (error) {
        console.error('Error rendering scoreboard:', error);
        scoreboardContainer.innerHTML = '<div class="error">Error loading scores</div>';
    }
}

/**
 * Renders round progress display showing current round and breakdown
 * Targets #round-progress container in index.html
 */
export function renderRoundProgress() {
    const progressContainer = document.getElementById('round-progress');
    if (!progressContainer) {
        console.error('Round progress container not found');
        return;
    }

    try {
        const roundData = getRoundData();
        const currentRound = roundData.currentRound || 1;
        const totalRounds = roundData.totalRounds || 10;
        const roundScores = roundData.roundScores || {};
        
        let html = '<div class="round-display">';
        html += `<h3>Round ${currentRound} of ${totalRounds}</h3>`;
        
        // Progress bar
        const progressPercent = (currentRound / totalRounds) * 100;
        html += '<div class="progress-bar">';
        html += `<div class="progress-fill" style="width: ${progressPercent}%"></div>`;
        html += '</div>';
        
        // Round-by-round breakdown (collapsible)
        html += '<div class="round-breakdown">';
        html += '<button class="toggle-breakdown" onclick="toggleRoundBreakdown()">Show Round Breakdown</button>';
        html += '<div class="breakdown-content" id="breakdown-content" style="display: none;">';
        html += '<table class="round-scores">';
        html += '<thead><tr><th>Round</th>';
        
        // Get all players for header
        const allPlayers = Object.keys(roundScores[1] || {});
        allPlayers.forEach(player => {
            html += `<th>${player}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        // Add each completed round
        for (let round = 1; round < currentRound; round++) {
            html += `<tr><td>Round ${round}</td>`;
            allPlayers.forEach(player => {
                const score = roundScores[round]?.[player] || 0;
                html += `<td>${score}</td>`;
            });
            html += '</tr>';
        }
        
        html += '</tbody></table></div></div></div>';
        progressContainer.innerHTML = html;
        
    } catch (error) {
        console.error('Error rendering round progress:', error);
        progressContainer.innerHTML = '<div class="error">Error loading round data</div>';
    }
}

/**
 * Updates leader highlighting across all score displays
 */
export function updateLeaderHighlight() {
    try {
        const leader = getLeader();
        
        // Remove existing leader highlights
        const existingLeaders = document.querySelectorAll('.leader');
        existingLeaders.forEach(element => {
            element.classList.remove('leader');
        });
        
        // Add leader class to current leader's row
        const playerRows = document.querySelectorAll('.scores tbody tr');
        playerRows.forEach(row => {
            const playerName = row.querySelector('.player-name')?.textContent;
            if (playerName === leader) {
                row.classList.add('leader');
            }
        });
        
    } catch (error) {
        console.error('Error updating leader highlight:', error);
    }
}

/**
 * Toggle function for round breakdown (attached to window for onclick)
 */
window.toggleRoundBreakdown = function() {
    const content = document.getElementById('breakdown-content');
    const button = document.querySelector('.toggle-breakdown');
    
    if (content && button) {
        if (content.style.display === 'none') {
            content.style.display = 'block';
            button.textContent = 'Hide Round Breakdown';
        } else {
            content.style.display = 'none';
            button.textContent = 'Show Round Breakdown';
        }
    }
};

/**
 * Initialize score display - call this when page loads
 */
export function initializeScoreDisplay() {
    renderScoreBoard();
    renderRoundProgress();
    updateLeaderHighlight();
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScoreDisplay);
} else {
    initializeScoreDisplay();
}