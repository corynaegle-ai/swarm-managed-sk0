/**
 * Tests for scoreDisplay.js
 * Mock scoreManager functions for testing
 */

// Mock scoreManager functions
window.getAllScores = function() {
    return {
        'Alice': { total: 150, rounds: [20, 30, 25, 35, 40] },
        'Bob': { total: 120, rounds: [15, 25, 20, 30, 30] },
        'Charlie': { total: 180, rounds: [25, 35, 30, 40, 50] }
    };
};

window.getTotalScore = function(playerId) {
    const scores = getAllScores();
    return scores[playerId] ? scores[playerId].total : 0;
};

window.getPlayerRounds = function(playerId) {
    const scores = getAllScores();
    return scores[playerId] ? scores[playerId].rounds : [];
};

window.getCurrentRound = function() {
    return 6;
};

window.getLeader = function() {
    const scores = getAllScores();
    const playerIds = Object.keys(scores);
    if (playerIds.length === 0) return null;
    
    return playerIds.reduce((leader, playerId) => {
        return getTotalScore(playerId) > getTotalScore(leader) ? playerId : leader;
    });
};

// Test setup
describe('scoreDisplay.js', function() {
    beforeEach(function() {
        // Create DOM elements for testing
        document.body.innerHTML = `
            <div id="scoreboard-container"></div>
            <div id="round-progress-container"></div>
        `;
    });

    describe('renderScoreBoard', function() {
        it('should render scoreboard with all players', function() {
            renderScoreBoard();
            
            const container = document.getElementById('scoreboard-container');
            expect(container.innerHTML).toContain('Current Standings');
            expect(container.innerHTML).toContain('Alice');
            expect(container.innerHTML).toContain('Bob');
            expect(container.innerHTML).toContain('Charlie');
        });

        it('should sort players by total score', function() {
            renderScoreBoard();
            
            const rows = document.querySelectorAll('.score-table tbody tr:not(.details-row)');
            expect(rows[0].textContent).toContain('Charlie'); // Highest score (180)
            expect(rows[1].textContent).toContain('Alice');   // Middle score (150)
            expect(rows[2].textContent).toContain('Bob');     // Lowest score (120)
        });

        it('should highlight the leader', function() {
            renderScoreBoard();
            
            const leaderRow = document.querySelector('.leader-row');
            expect(leaderRow).toBeTruthy();
            expect(leaderRow.textContent).toContain('Charlie');
        });

        it('should handle empty player list', function() {
            window.getAllScores = function() { return {}; };
            
            renderScoreBoard();
            
            const container = document.getElementById('scoreboard-container');
            expect(container.innerHTML).toContain('No players registered yet');
        });
    });

    describe('renderRoundProgress', function() {
        it('should display current round information', function() {
            renderRoundProgress();
            
            const container = document.getElementById('round-progress-container');
            expect(container.innerHTML).toContain('Round 6 of 10');
        });

        it('should show correct progress percentage', function() {
            renderRoundProgress();
            
            const progressFill = document.querySelector('.progress-fill');
            expect(progressFill.style.width).toBe('50%'); // Round 6: (6-1)/10 * 100 = 50%
        });

        it('should mark completed and current rounds correctly', function() {
            renderRoundProgress();
            
            const completed = document.querySelectorAll('.round-indicator.completed');
            const current = document.querySelector('.round-indicator.current');
            
            expect(completed.length).toBe(5); // Rounds 1-5 completed
            expect(current.textContent).toBe('6'); // Round 6 is current
        });
    });

    describe('updateLeaderHighlight', function() {
        it('should remove old leader highlights and add new ones', function() {
            // Setup initial scoreboard
            renderScoreBoard();
            
            // Mock a different leader
            window.getLeader = function() { return 'Alice'; };
            
            updateLeaderHighlight();
            
            const leaderRows = document.querySelectorAll('.leader-row');
            expect(leaderRows.length).toBe(1);
            expect(leaderRows[0].textContent).toContain('Alice');
        });

        it('should handle no leader gracefully', function() {
            renderScoreBoard();
            
            window.getLeader = function() { return null; };
            
            updateLeaderHighlight();
            
            const leaderRows = document.querySelectorAll('.leader-row');
            expect(leaderRows.length).toBe(0);
        });
    });

    describe('togglePlayerDetails', function() {
        it('should toggle player details visibility', function() {
            renderScoreBoard();
            
            const detailsRow = document.getElementById('details-Alice');
            expect(detailsRow.style.display).toBe('none');
            
            togglePlayerDetails('Alice');
            expect(detailsRow.style.display).toBe('table-row');
            
            togglePlayerDetails('Alice');
            expect(detailsRow.style.display).toBe('none');
        });

        it('should update button text when toggling', function() {
            renderScoreBoard();
            
            const button = document.querySelector('.details-btn[data-player="Alice"]');
            expect(button.textContent).toBe('View Details');
            
            togglePlayerDetails('Alice');
            expect(button.textContent).toBe('Hide Details');
            
            togglePlayerDetails('Alice');
            expect(button.textContent).toBe('View Details');
        });
    });

    describe('escapeHtml', function() {
        it('should escape HTML characters', function() {
            const result = escapeHtml('<script>alert("xss")</script>');
            expect(result).not.toContain('<script>');
            expect(result).toContain('&lt;script&gt;');
        });

        it('should handle quotes and ampersands', function() {
            const result = escapeHtml('"Hello & Goodbye"');
            expect(result).toContain('&quot;');
            expect(result).toContain('&amp;');
        });
    });
});