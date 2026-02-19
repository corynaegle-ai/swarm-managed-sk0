/**
 * Score Display Module
 * Handles rendering of score displays and leaderboards
 */

// Import score manager functions
import { getScores, getCurrentRound, getTotalRounds, getRoundHistory } from './scoreManager.js';

/**
 * Renders the main scoreboard showing total scores for all players
 * Targets DOM container with id 'scoreboard'
 */
export function renderScoreBoard() {
    const container = document.getElementById('scoreboard');
    if (!container) {
        console.warn('Scoreboard container not found');
        return;
    }

    try {
        const scores = getScores();
        const players = Object.keys(scores);
        
        if (players.length === 0) {
            container.innerHTML = '<p class="no-scores">No scores available</p>';
            return;
        }

        // Sort players by total score (descending)
        const sortedPlayers = players.sort((a, b) => scores[b].total - scores[a].total);
        
        let html = '<div class="score-table">';
        html += '<h3>Current Scores</h3>';
        html += '<table>';
        html += '<thead><tr><th>Player</th><th>Total Score</th></tr></thead>';
        html += '<tbody>';
        
        sortedPlayers.forEach((player, index) => {
            const isLeader = index === 0;
            const rowClass = isLeader ? 'leader' : '';
            html += `<tr class="${rowClass}">`;
            html += `<td class="player-name">${player}</td>`;
            html += `<td class="score-value">${scores[player].total}</td>`;
            html += '</tr>';
        });
        
        html += '</tbody></table></div>';
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error rendering scoreboard:', error);
        container.innerHTML = '<p class="error">Error loading scores</p>';
    }
}

/**
 * Renders round progress indicator showing current round and breakdown
 * Targets DOM container with id 'round-progress'
 */
export function renderRoundProgress() {
    const container = document.getElementById('round-progress');
    if (!container) {
        console.warn('Round progress container not found');
        return;
    }

    try {
        const currentRound = getCurrentRound();
        const totalRounds = getTotalRounds();
        const roundHistory = getRoundHistory();
        
        let html = '<div class="round-progress">';
        html += `<h3>Round ${currentRound} of ${totalRounds}</h3>`;
        
        // Progress bar
        const progressPercent = (currentRound / totalRounds) * 100;
        html += '<div class="progress-bar">';
        html += `<div class="progress-fill" style="width: ${progressPercent}%"></div>`;
        html += '</div>';
        
        // Round breakdown (collapsible)
        if (roundHistory && roundHistory.length > 0) {
            html += '<div class="round-breakdown">';
            html += '<button class="toggle-breakdown" onclick="toggleRoundBreakdown()">Show Round Details</button>';
            html += '<div class="breakdown-content" style="display: none;">';
            html += '<table class="round-table">';
            html += '<thead><tr><th>Round</th><th>Scores</th></tr></thead>';
            html += '<tbody>';
            
            roundHistory.forEach((round, index) => {
                html += `<tr><td>Round ${index + 1}</td><td>`;
                const roundScores = Object.entries(round).map(([player, score]) => `${player}: ${score}`).join(', ');
                html += roundScores;
                html += '</td></tr>';
            });
            
            html += '</tbody></table></div></div>';
        }
        
        html += '</div>';
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error rendering round progress:', error);
        container.innerHTML = '<p class="error">Error loading round progress</p>';
    }
}

/**
 * Updates visual highlighting for the current leader
 * Adds/removes leader class from appropriate elements
 */
export function updateLeaderHighlight() {
    try {
        const scores = getScores();
        const players = Object.keys(scores);
        
        if (players.length === 0) return;
        
        // Find current leader
        const leader = players.reduce((a, b) => scores[a].total > scores[b].total ? a : b);
        
        // Remove existing leader highlights
        const existingLeaders = document.querySelectorAll('.leader');
        existingLeaders.forEach(el => el.classList.remove('leader'));
        
        // Add leader class to current leader's row
        const rows = document.querySelectorAll('.score-table tbody tr');
        rows.forEach(row => {
            const playerCell = row.querySelector('.player-name');
            if (playerCell && playerCell.textContent === leader) {
                row.classList.add('leader');
            }
        });
        
    } catch (error) {
        console.error('Error updating leader highlight:', error);
    }
}

/**
 * Global function to toggle round breakdown visibility
 */
window.toggleRoundBreakdown = function() {
    const content = document.querySelector('.breakdown-content');
    const button = document.querySelector('.toggle-breakdown');
    
    if (content && button) {
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        button.textContent = isHidden ? 'Hide Round Details' : 'Show Round Details';
    }
};

/**
 * Initialize score display when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    renderScoreBoard();
    renderRoundProgress();
    updateLeaderHighlight();
});