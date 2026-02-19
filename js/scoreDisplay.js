import { scoreManager } from './scoreManager.js';

/**
 * Score Display Module
 * Handles rendering and updating score displays in the DOM
 */
class ScoreDisplay {
    constructor() {
        this.scoreBoard = document.getElementById('scoreBoard');
        this.roundProgress = document.getElementById('roundProgress');
        this.currentRound = 1;
        this.totalRounds = 10;
    }

    /**
     * Renders the main scoreboard with current total scores
     */
    renderScoreBoard() {
        if (!this.scoreBoard) {
            console.error('Score board container not found');
            return;
        }

        try {
            const scores = scoreManager.getTotalScores();
            const players = Object.keys(scores);
            
            if (players.length === 0) {
                this.scoreBoard.innerHTML = '<p class="no-scores">No scores available</p>';
                return;
            }

            // Sort players by total score (descending)
            const sortedPlayers = players.sort((a, b) => scores[b] - scores[a]);
            
            let html = '<div class="score-table">';
            html += '<h3>Current Scores</h3>';
            html += '<table>';
            html += '<thead><tr><th>Player</th><th>Total Score</th><th>Rounds</th></tr></thead>';
            html += '<tbody>';
            
            sortedPlayers.forEach((player, index) => {
                const isLeader = index === 0;
                const playerClass = isLeader ? 'player-row leader' : 'player-row';
                const roundScores = scoreManager.getPlayerRoundScores(player);
                
                html += `<tr class="${playerClass}" data-player="${player}">`;
                html += `<td class="player-name">${player}</td>`;
                html += `<td class="total-score">${scores[player]}</td>`;
                html += `<td><button class="toggle-rounds" data-player="${player}">View Rounds</button></td>`;
                html += '</tr>';
                
                // Round breakdown (initially hidden)
                html += `<tr class="round-breakdown" data-player="${player}" style="display: none;">`;
                html += '<td colspan="3">';
                html += '<div class="round-scores">';
                
                for (let round = 1; round <= this.totalRounds; round++) {
                    const score = roundScores[round] || '-';
                    html += `<span class="round-score">R${round}: ${score}</span>`;
                }
                
                html += '</div>';
                html += '</td>';
                html += '</tr>';
            });
            
            html += '</tbody></table></div>';
            
            this.scoreBoard.innerHTML = html;
            
            // Add event listeners for round toggles
            this.attachToggleListeners();
            
        } catch (error) {
            console.error('Error rendering score board:', error);
            this.scoreBoard.innerHTML = '<p class="error">Error loading scores</p>';
        }
    }

    /**
     * Renders the round progress indicator
     */
    renderRoundProgress() {
        if (!this.roundProgress) {
            console.error('Round progress container not found');
            return;
        }

        try {
            this.currentRound = scoreManager.getCurrentRound() || 1;
            
            let html = '<div class="round-progress-container">';
            html += `<h3 class="round-title">Round ${this.currentRound} of ${this.totalRounds}</h3>`;
            
            // Progress bar
            const progressPercent = (this.currentRound / this.totalRounds) * 100;
            html += '<div class="progress-bar">';
            html += `<div class="progress-fill" style="width: ${progressPercent}%"></div>`;
            html += '</div>';
            
            // Round indicators
            html += '<div class="round-indicators">';
            for (let round = 1; round <= this.totalRounds; round++) {
                const roundClass = round < this.currentRound ? 'completed' : 
                                 (round === this.currentRound ? 'current' : 'upcoming');
                html += `<span class="round-indicator ${roundClass}">${round}</span>`;
            }
            html += '</div>';
            
            html += '</div>';
            
            this.roundProgress.innerHTML = html;
            
        } catch (error) {
            console.error('Error rendering round progress:', error);
            this.roundProgress.innerHTML = '<p class="error">Error loading round progress</p>';
        }
    }

    /**
     * Updates the visual highlight for the current leader
     */
    updateLeaderHighlight() {
        try {
            // Remove existing leader highlights
            const existingLeaders = document.querySelectorAll('.leader');
            existingLeaders.forEach(element => {
                element.classList.remove('leader');
            });

            const scores = scoreManager.getTotalScores();
            const players = Object.keys(scores);
            
            if (players.length === 0) return;

            // Find the leader (highest score)
            let leader = players[0];
            let highestScore = scores[leader];
            
            players.forEach(player => {
                if (scores[player] > highestScore) {
                    leader = player;
                    highestScore = scores[player];
                }
            });

            // Apply leader class to the leader's row
            const leaderRow = document.querySelector(`[data-player="${leader}"]`);
            if (leaderRow) {
                leaderRow.classList.add('leader');
            }
            
        } catch (error) {
            console.error('Error updating leader highlight:', error);
        }
    }

    /**
     * Attaches event listeners for round score toggles
     */
    attachToggleListeners() {
        const toggleButtons = document.querySelectorAll('.toggle-rounds');
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const player = button.getAttribute('data-player');
                const roundBreakdown = document.querySelector(`.round-breakdown[data-player="${player}"]`);
                
                if (roundBreakdown) {
                    const isVisible = roundBreakdown.style.display !== 'none';
                    roundBreakdown.style.display = isVisible ? 'none' : 'table-row';
                    button.textContent = isVisible ? 'View Rounds' : 'Hide Rounds';
                }
            });
        });
    }

    /**
     * Updates all score displays
     */
    updateAll() {
        this.renderScoreBoard();
        this.renderRoundProgress();
        this.updateLeaderHighlight();
    }
}

// Create and export singleton instance
export const scoreDisplay = new ScoreDisplay();

// Export individual functions for backward compatibility
export function renderScoreBoard() {
    scoreDisplay.renderScoreBoard();
}

export function renderRoundProgress() {
    scoreDisplay.renderRoundProgress();
}

export function updateLeaderHighlight() {
    scoreDisplay.updateLeaderHighlight();
}