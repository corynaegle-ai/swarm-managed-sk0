/**
 * Score Display Module
 * Handles rendering of score displays in the DOM
 */

// Import score management functions
import { getScores, getCurrentRound, getLeader } from './scoreManager.js';

/**
 * Renders the main scoreboard showing total scores for all players
 * Targets the scoreboard container in index.html
 */
export function renderScoreBoard() {
    const container = document.getElementById('scoreboard-container');
    if (!container) {
        console.error('Scoreboard container not found');
        return;
    }

    try {
        const scores = getScores();
        const leader = getLeader();
        
        // Clear existing content
        container.innerHTML = '';
        
        // Create scoreboard table
        const table = document.createElement('table');
        table.className = 'scoreboard-table';
        
        // Create header
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>Player</th><th>Total Score</th>';
        table.appendChild(headerRow);
        
        // Add player rows
        Object.entries(scores).forEach(([player, playerScores]) => {
            const row = document.createElement('tr');
            const totalScore = playerScores.reduce((sum, score) => sum + score, 0);
            
            row.innerHTML = `<td>${player}</td><td>${totalScore}</td>`;
            
            // Highlight leader
            if (player === leader) {
                row.classList.add('leader');
            }
            
            table.appendChild(row);
        });
        
        container.appendChild(table);
    } catch (error) {
        console.error('Error rendering scoreboard:', error);
        container.innerHTML = '<div class="error">Error loading scoreboard</div>';
    }
}

/**
 * Renders round progress indicator and round breakdown
 * Shows current round and expandable round-by-round scores
 */
export function renderRoundProgress() {
    const container = document.getElementById('round-progress-container');
    if (!container) {
        console.error('Round progress container not found');
        return;
    }

    try {
        const currentRound = getCurrentRound();
        const scores = getScores();
        
        // Clear existing content
        container.innerHTML = '';
        
        // Create round indicator
        const roundIndicator = document.createElement('div');
        roundIndicator.className = 'round-indicator';
        roundIndicator.textContent = `Round ${currentRound} of 10`;
        container.appendChild(roundIndicator);
        
        // Create expandable round breakdown
        const breakdownContainer = document.createElement('div');
        breakdownContainer.className = 'round-breakdown';
        
        const toggleButton = document.createElement('button');
        toggleButton.className = 'breakdown-toggle';
        toggleButton.textContent = 'Show Round Breakdown';
        toggleButton.setAttribute('aria-expanded', 'false');
        
        const breakdownContent = document.createElement('div');
        breakdownContent.className = 'breakdown-content';
        breakdownContent.style.display = 'none';
        
        // Create round-by-round table
        const table = document.createElement('table');
        table.className = 'breakdown-table';
        
        // Create header with round numbers
        const headerRow = document.createElement('tr');
        let headerHTML = '<th>Player</th>';
        for (let round = 1; round <= Math.max(currentRound, 1); round++) {
            headerHTML += `<th>R${round}</th>`;
        }
        headerHTML += '<th>Total</th>';
        headerRow.innerHTML = headerHTML;
        table.appendChild(headerRow);
        
        // Add player rows
        Object.entries(scores).forEach(([player, playerScores]) => {
            const row = document.createElement('tr');
            let rowHTML = `<td>${player}</td>`;
            
            for (let round = 0; round < Math.max(currentRound, 1); round++) {
                const score = playerScores[round] || 0;
                rowHTML += `<td>${score}</td>`;
            }
            
            const total = playerScores.reduce((sum, score) => sum + score, 0);
            rowHTML += `<td class="total-cell">${total}</td>`;
            row.innerHTML = rowHTML;
            table.appendChild(row);
        });
        
        breakdownContent.appendChild(table);
        
        // Add toggle functionality
        toggleButton.addEventListener('click', () => {
            const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
            toggleButton.setAttribute('aria-expanded', !isExpanded);
            breakdownContent.style.display = isExpanded ? 'none' : 'block';
            toggleButton.textContent = isExpanded ? 'Show Round Breakdown' : 'Hide Round Breakdown';
        });
        
        breakdownContainer.appendChild(toggleButton);
        breakdownContainer.appendChild(breakdownContent);
        container.appendChild(breakdownContainer);
        
    } catch (error) {
        console.error('Error rendering round progress:', error);
        container.innerHTML = '<div class="error">Error loading round progress</div>';
    }
}

/**
 * Updates the visual highlighting of the current leader
 * Removes previous leader highlighting and applies to current leader
 */
export function updateLeaderHighlight() {
    try {
        const leader = getLeader();
        
        // Remove existing leader highlights
        const previousLeaders = document.querySelectorAll('.leader');
        previousLeaders.forEach(element => {
            element.classList.remove('leader');
        });
        
        if (!leader) {
            return;
        }
        
        // Find and highlight current leader in scoreboard
        const scoreboardRows = document.querySelectorAll('.scoreboard-table tr');
        scoreboardRows.forEach(row => {
            const playerCell = row.querySelector('td:first-child');
            if (playerCell && playerCell.textContent.trim() === leader) {
                row.classList.add('leader');
            }
        });
        
        // Highlight leader in breakdown table if visible
        const breakdownRows = document.querySelectorAll('.breakdown-table tr');
        breakdownRows.forEach(row => {
            const playerCell = row.querySelector('td:first-child');
            if (playerCell && playerCell.textContent.trim() === leader) {
                row.classList.add('leader');
            }
        });
        
    } catch (error) {
        console.error('Error updating leader highlight:', error);
    }
}

/**
 * Initialize score display functionality
 * Sets up event listeners and initial rendering
 */
export function initializeScoreDisplay() {
    // Render initial displays
    renderScoreBoard();
    renderRoundProgress();
    updateLeaderHighlight();
    
    // Set up periodic updates (optional)
    setInterval(() => {
        renderScoreBoard();
        renderRoundProgress();
        updateLeaderHighlight();
    }, 5000); // Update every 5 seconds
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScoreDisplay);
} else {
    initializeScoreDisplay();
}