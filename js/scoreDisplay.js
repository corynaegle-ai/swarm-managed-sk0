/**
 * Score Display Management
 * Handles rendering and updating score displays in the DOM
 */

import { 
    getCurrentScores, 
    getLeaderboard, 
    getCurrentRound, 
    getRoundScores,
    getTotalRounds 
} from './scoreManager.js';

/**
 * Renders the main scoreboard showing current total scores
 */
export function renderScoreBoard() {
    try {
        const scoreContainer = document.getElementById('scoreboard-container');
        if (!scoreContainer) {
            console.error('Scoreboard container not found');
            return;
        }

        const scores = getCurrentScores();
        const leaderboard = getLeaderboard();
        
        if (!scores || Object.keys(scores).length === 0) {
            scoreContainer.innerHTML = '<p class="no-scores">No scores available</p>';
            return;
        }

        let html = '<div class="scoreboard">';
        html += '<h3>Current Scores</h3>';
        html += '<div class="score-table">';
        
        // Header
        html += '<div class="score-row header">';
        html += '<div class="player-name">Player</div>';
        html += '<div class="total-score">Total Score</div>';
        html += '<div class="rounds-played">Rounds</div>';
        html += '</div>';
        
        // Player scores sorted by leaderboard position
        leaderboard.forEach((player, index) => {
            const isLeader = index === 0;
            const currentRound = getCurrentRound();
            
            html += `<div class="score-row ${isLeader ? 'leader' : ''}" data-player="${player.name}">`;
            html += `<div class="player-name">${player.name}</div>`;
            html += `<div class="total-score">${player.score}</div>`;
            html += `<div class="rounds-played">${currentRound}</div>`;
            html += '</div>';
        });
        
        html += '</div>';
        html += '</div>';
        
        scoreContainer.innerHTML = html;
        
        // Add click handlers for expandable rows
        addExpandableHandlers();
        
    } catch (error) {
        console.error('Error rendering scoreboard:', error);
    }
}

/**
 * Renders round progress indicator
 */
export function renderRoundProgress() {
    try {
        const progressContainer = document.getElementById('round-progress-container');
        if (!progressContainer) {
            console.error('Round progress container not found');
            return;
        }

        const currentRound = getCurrentRound();
        const totalRounds = getTotalRounds();
        const roundScores = getRoundScores();
        
        let html = '<div class="round-progress">';
        html += `<h4>Round ${currentRound} of ${totalRounds}</h4>`;
        
        // Progress bar
        const progressPercent = ((currentRound - 1) / totalRounds) * 100;
        html += '<div class="progress-bar">';
        html += `<div class="progress-fill" style="width: ${progressPercent}%"></div>`;
        html += '</div>';
        
        // Round breakdown (collapsible)
        if (roundScores && Object.keys(roundScores).length > 0) {
            html += '<div class="round-breakdown">';
            html += '<button class="toggle-breakdown" onclick="toggleRoundBreakdown()">Show Round Details</button>';
            html += '<div class="breakdown-content" id="breakdown-content" style="display: none;">';
            
            // Create rounds table
            html += '<div class="rounds-table">';
            
            // Get all players
            const players = Object.keys(getCurrentScores());
            
            // Header
            html += '<div class="rounds-row header">';
            html += '<div class="round-number">Round</div>';
            players.forEach(player => {
                html += `<div class="player-round-score">${player}</div>`;
            });
            html += '</div>';
            
            // Round data
            for (let round = 1; round < currentRound; round++) {
                html += '<div class="rounds-row">';
                html += `<div class="round-number">${round}</div>`;
                
                players.forEach(player => {
                    const roundScore = roundScores[player] && roundScores[player][round] ? roundScores[player][round] : 0;
                    html += `<div class="player-round-score">${roundScore}</div>`;
                });
                
                html += '</div>';
            }
            
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }
        
        html += '</div>';
        
        progressContainer.innerHTML = html;
        
    } catch (error) {
        console.error('Error rendering round progress:', error);
    }
}

/**
 * Updates the visual highlighting of the current leader
 */
export function updateLeaderHighlight() {
    try {
        const leaderboard = getLeaderboard();
        if (!leaderboard || leaderboard.length === 0) {
            return;
        }
        
        const currentLeader = leaderboard[0];
        
        // Remove existing leader highlights
        const allRows = document.querySelectorAll('.score-row');
        allRows.forEach(row => {
            row.classList.remove('leader');
        });
        
        // Add leader highlight to current leader
        const leaderRow = document.querySelector(`[data-player="${currentLeader.name}"]`);
        if (leaderRow) {
            leaderRow.classList.add('leader');
        }
        
        // Update any leader indicators
        const leaderIndicators = document.querySelectorAll('.leader-indicator');
        leaderIndicators.forEach(indicator => {
            indicator.textContent = `Current Leader: ${currentLeader.name} (${currentLeader.score} points)`;
        });
        
    } catch (error) {
        console.error('Error updating leader highlight:', error);
    }
}

/**
 * Adds event handlers for expandable score rows
 */
function addExpandableHandlers() {
    const scoreRows = document.querySelectorAll('.score-row:not(.header)');
    scoreRows.forEach(row => {
        row.addEventListener('click', () => {
            const playerName = row.getAttribute('data-player');
            togglePlayerDetails(playerName, row);
        });
    });
}

/**
 * Toggles detailed view for a specific player
 */
function togglePlayerDetails(playerName, rowElement) {
    try {
        const existingDetails = rowElement.nextElementSibling;
        
        if (existingDetails && existingDetails.classList.contains('player-details')) {
            existingDetails.remove();
            return;
        }
        
        const roundScores = getRoundScores();
        const playerRounds = roundScores[playerName] || {};
        const currentRound = getCurrentRound();
        
        let detailsHtml = '<div class="player-details">';
        detailsHtml += `<h5>${playerName} - Round by Round</h5>`;
        detailsHtml += '<div class="player-rounds">';
        
        for (let round = 1; round < currentRound; round++) {
            const roundScore = playerRounds[round] || 0;
            detailsHtml += `<div class="round-detail">`;
            detailsHtml += `<span class="round-label">Round ${round}:</span>`;
            detailsHtml += `<span class="round-score">${roundScore}</span>`;
            detailsHtml += '</div>';
        }
        
        detailsHtml += '</div>';
        detailsHtml += '</div>';
        
        rowElement.insertAdjacentHTML('afterend', detailsHtml);
        
    } catch (error) {
        console.error('Error toggling player details:', error);
    }
}

/**
 * Global function to toggle round breakdown (called from HTML)
 */
window.toggleRoundBreakdown = function() {
    const content = document.getElementById('breakdown-content');
    const button = document.querySelector('.toggle-breakdown');
    
    if (content && button) {
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';
        button.textContent = isVisible ? 'Show Round Details' : 'Hide Round Details';
    }
};

/**
 * Refreshes all score displays
 */
export function refreshScoreDisplays() {
    renderScoreBoard();
    renderRoundProgress();
    updateLeaderHighlight();
}

/**
 * Initializes score display components
 */
export function initializeScoreDisplay() {
    try {
        refreshScoreDisplays();
        
        // Set up periodic refresh if needed
        // This could be used for real-time updates
        
    } catch (error) {
        console.error('Error initializing score display:', error);
    }
}