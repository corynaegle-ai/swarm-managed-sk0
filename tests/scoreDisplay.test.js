/**
 * Tests for scoreDisplay.js functionality
 * These tests verify the score display functions work correctly
 */

// Mock DOM elements for testing
function setupTestDOM() {
    document.body.innerHTML = `
        <div id="scoreboard-container"></div>
        <div id="round-progress-container"></div>
    `;
}

// Mock scoreManager functions
let mockAllScores = {};
let mockCurrentRound = 1;
let mockLeader = null;

function getAllScores() { return mockAllScores; }
function getTotalScore(playerId) { return mockAllScores[playerId]?.total || 0; }
function getPlayerRounds(playerId) { return mockAllScores[playerId]?.rounds || []; }
function getCurrentRound() { return mockCurrentRound; }
function getLeader() { return mockLeader; }

// Test renderScoreBoard function
function testRenderScoreBoard() {
    console.log('Testing renderScoreBoard...');
    setupTestDOM();
    
    // Test with no players
    mockAllScores = {};
    renderScoreBoard();
    const container = document.getElementById('scoreboard-container');
    if (container.innerHTML.includes('No players added yet')) {
        console.log('✓ No players case handled correctly');
    } else {
        console.error('✗ No players case failed');
    }
    
    // Test with players
    mockAllScores = {
        'Alice': { total: 150, rounds: [15, 20, 25, 30, 35, 25] },
        'Bob': { total: 120, rounds: [20, 15, 18, 22, 25, 20] },
        'Charlie': { total: 180, rounds: [25, 30, 35, 40, 30, 20] }
    };
    mockLeader = 'Charlie';
    
    renderScoreBoard();
    
    if (container.innerHTML.includes('Charlie') && 
        container.innerHTML.includes('180') &&
        container.innerHTML.includes('leader')) {
        console.log('✓ Scoreboard renders players correctly');
    } else {
        console.error('✗ Scoreboard rendering failed');
    }
}

// Test renderRoundProgress function
function testRenderRoundProgress() {
    console.log('Testing renderRoundProgress...');
    setupTestDOM();
    
    mockCurrentRound = 5;
    renderRoundProgress();
    
    const container = document.getElementById('round-progress-container');
    if (container.innerHTML.includes('Round 5 of 10') &&
        container.innerHTML.includes('progress-bar') &&
        container.innerHTML.includes('round-indicators')) {
        console.log('✓ Round progress renders correctly');
    } else {
        console.error('✗ Round progress rendering failed');
    }
}

// Test updateLeaderHighlight function
function testUpdateLeaderHighlight() {
    console.log('Testing updateLeaderHighlight...');
    setupTestDOM();
    
    // First render scoreboard
    mockAllScores = {
        'Alice': { total: 150, rounds: [] },
        'Bob': { total: 120, rounds: [] }
    };
    mockLeader = 'Alice';
    renderScoreBoard();
    
    // Test leader highlighting
    updateLeaderHighlight();
    
    const leaderRow = document.querySelector('[data-player="Alice"]');
    if (leaderRow && leaderRow.classList.contains('leader')) {
        console.log('✓ Leader highlighting works correctly');
    } else {
        console.error('✗ Leader highlighting failed');
    }
}

// Test expandable details functionality
function testTogglePlayerDetails() {
    console.log('Testing togglePlayerDetails...');
    setupTestDOM();
    
    mockAllScores = {
        'Alice': { total: 150, rounds: [15, 20, 25, 30, 35, 25] }
    };
    renderScoreBoard();
    
    const breakdown = document.getElementById('breakdown-Alice');
    const initialDisplay = breakdown.style.display;
    
    togglePlayerDetails('Alice');
    
    if (breakdown.style.display !== initialDisplay) {
        console.log('✓ Player details toggle works correctly');
    } else {
        console.error('✗ Player details toggle failed');
    }
}

// Run all tests
function runAllTests() {
    console.log('Running scoreDisplay tests...');
    testRenderScoreBoard();
    testRenderRoundProgress();
    testUpdateLeaderHighlight();
    testTogglePlayerDetails();
    console.log('Tests completed.');
}

// Export for Node.js testing if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testRenderScoreBoard,
        testRenderRoundProgress,
        testUpdateLeaderHighlight,
        testTogglePlayerDetails,
        runAllTests
    };
}

// Auto-run tests if in browser
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllTests);
    } else {
        runAllTests();
    }
}