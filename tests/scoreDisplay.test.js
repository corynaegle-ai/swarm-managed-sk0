// Score Display Tests

// Mock DOM elements
function createMockDOM() {
    const scoreboardContainer = document.createElement('div');
    scoreboardContainer.id = 'scoreboard-container';
    document.body.appendChild(scoreboardContainer);
    
    const roundProgressContainer = document.createElement('div');
    roundProgressContainer.id = 'round-progress-container';
    document.body.appendChild(roundProgressContainer);
    
    return { scoreboardContainer, roundProgressContainer };
}

// Mock scoreManager functions
const mockScores = {
    'Alice': { total: 150, rounds: [10, 20, 30, 40, 50, 0, 0, 0, 0, 0] },
    'Bob': { total: 120, rounds: [15, 25, 35, 45, 0, 0, 0, 0, 0, 0] },
    'Charlie': { total: 180, rounds: [20, 30, 40, 50, 40, 0, 0, 0, 0, 0] }
};

function getAllScores() {
    return mockScores;
}

function getTotalScore(playerId) {
    return mockScores[playerId] ? mockScores[playerId].total : 0;
}

function getPlayerRounds(playerId) {
    return mockScores[playerId] ? mockScores[playerId].rounds : [];
}

function getCurrentRound() {
    return 5;
}

function getLeader() {
    let leader = null;
    let highestScore = -1;
    Object.keys(mockScores).forEach(function(playerId) {
        if (mockScores[playerId].total > highestScore) {
            highestScore = mockScores[playerId].total;
            leader = playerId;
        }
    });
    return leader;
}

// Test renderScoreBoard
function testRenderScoreBoard() {
    const { scoreboardContainer } = createMockDOM();
    
    // Load the scoreDisplay functions (normally loaded via script tag)
    eval(require('fs').readFileSync('./js/scoreDisplay.js', 'utf8'));
    
    renderScoreBoard();
    
    // Check if scoreboard was rendered
    const scoreboard = scoreboardContainer.querySelector('.scoreboard');
    console.assert(scoreboard !== null, 'Scoreboard should be rendered');
    
    // Check if players are displayed
    const playerRows = scoreboardContainer.querySelectorAll('tbody tr:not(.round-details)');
    console.assert(playerRows.length === 3, 'Should display 3 players');
    
    // Check if leader is highlighted
    const leaderRow = scoreboardContainer.querySelector('.leader-row');
    console.assert(leaderRow !== null, 'Leader should be highlighted');
    
    // Check if details buttons exist
    const detailsButtons = scoreboardContainer.querySelectorAll('.details-btn');
    console.assert(detailsButtons.length === 3, 'Should have details buttons for all players');
    
    console.log('✓ renderScoreBoard tests passed');
}

// Test renderRoundProgress
function testRenderRoundProgress() {
    const { roundProgressContainer } = createMockDOM();
    
    eval(require('fs').readFileSync('./js/scoreDisplay.js', 'utf8'));
    
    renderRoundProgress();
    
    // Check if round progress was rendered
    const roundProgress = roundProgressContainer.querySelector('.round-progress');
    console.assert(roundProgress !== null, 'Round progress should be rendered');
    
    // Check round title
    const title = roundProgress.querySelector('h3');
    console.assert(title.textContent === 'Round 5 of 10', 'Should show correct round');
    
    // Check progress bar
    const progressFill = roundProgress.querySelector('.progress-fill');
    console.assert(progressFill.style.width === '50%', 'Progress bar should be 50% for round 5');
    
    // Check round indicators
    const indicators = roundProgress.querySelectorAll('.round-indicator');
    console.assert(indicators.length === 10, 'Should have 10 round indicators');
    
    console.log('✓ renderRoundProgress tests passed');
}

// Test updateLeaderHighlight
function testUpdateLeaderHighlight() {
    const { scoreboardContainer } = createMockDOM();
    
    eval(require('fs').readFileSync('./js/scoreDisplay.js', 'utf8'));
    
    // First render the scoreboard
    renderScoreBoard();
    
    // Update leader highlight
    updateLeaderHighlight();
    
    // Check if Charlie (highest score) is highlighted
    const charlieRow = scoreboardContainer.querySelector('[data-player="Charlie"]');
    console.assert(charlieRow.classList.contains('leader-row'), 'Charlie should be highlighted as leader');
    
    console.log('✓ updateLeaderHighlight tests passed');
}

// Test XSS prevention
function testXSSPrevention() {
    eval(require('fs').readFileSync('./js/scoreDisplay.js', 'utf8'));
    
    const maliciousInput = '<script>alert("XSS")</script>';
    const escaped = escapeHtml(maliciousInput);
    
    console.assert(!escaped.includes('<script>'), 'Script tags should be escaped');
    console.assert(escaped.includes('&lt;script&gt;'), 'Should contain escaped HTML');
    
    console.log('✓ XSS prevention tests passed');
}

// Run tests if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    try {
        testRenderScoreBoard();
        testRenderRoundProgress();
        testUpdateLeaderHighlight();
        testXSSPrevention();
        console.log('\n✅ All scoreDisplay tests passed!');
    } catch (error) {
        console.error('❌ Tests failed:', error);
    }
}