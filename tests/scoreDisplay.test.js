/**
 * Tests for scoreDisplay.js
 */

// Mock DOM elements
document.body.innerHTML = `
  <div id="scoreboard"></div>
  <div id="round-progress"></div>
`;

// Mock scoreManager functions
const mockGetPlayers = () => ['Alice', 'Bob', 'Charlie'];
const mockGetPlayerTotalScore = (player) => {
  const scores = { 'Alice': 95, 'Bob': 87, 'Charlie': 92 };
  return scores[player] || 0;
};
const mockGetRoundScores = (player) => [10, 15, 8, 12, 20, 11, 9, 10, 0, 0];
const mockGetCurrentRound = () => 6;
const mockGetLeader = () => 'Alice';

// Test renderScoreBoard
function testRenderScoreBoard() {
  // Mock the imported functions
  global.getPlayers = mockGetPlayers;
  global.getPlayerTotalScore = mockGetPlayerTotalScore;
  global.getLeader = mockGetLeader;
  
  const { renderScoreBoard } = require('../js/scoreDisplay.js');
  
  renderScoreBoard();
  
  const scoreboard = document.getElementById('scoreboard');
  const leaderRow = scoreboard.querySelector('.leader');
  const playerNames = scoreboard.querySelectorAll('.player-name');
  
  console.assert(scoreboard.innerHTML.includes('Alice'), 'Alice should be displayed');
  console.assert(scoreboard.innerHTML.includes('Bob'), 'Bob should be displayed');
  console.assert(scoreboard.innerHTML.includes('Charlie'), 'Charlie should be displayed');
  console.assert(leaderRow !== null, 'Leader should be highlighted');
  console.assert(playerNames.length === 3, 'Should display 3 players');
  
  console.log('✓ renderScoreBoard tests passed');
}

// Test renderRoundProgress
function testRenderRoundProgress() {
  global.getCurrentRound = mockGetCurrentRound;
  global.getPlayers = mockGetPlayers;
  global.getRoundScores = mockGetRoundScores;
  
  const { renderRoundProgress } = require('../js/scoreDisplay.js');
  
  renderRoundProgress();
  
  const roundProgress = document.getElementById('round-progress');
  const progressFill = roundProgress.querySelector('.progress-fill');
  
  console.assert(roundProgress.innerHTML.includes('Round 6 of 10'), 'Should show current round');
  console.assert(progressFill !== null, 'Should have progress bar');
  console.assert(roundProgress.innerHTML.includes('Round-by-Round'), 'Should show breakdown section');
  
  console.log('✓ renderRoundProgress tests passed');
}

// Test updateLeaderHighlight
function testUpdateLeaderHighlight() {
  global.getLeader = mockGetLeader;
  
  const { renderScoreBoard, updateLeaderHighlight } = require('../js/scoreDisplay.js');
  
  // First render scoreboard
  renderScoreBoard();
  
  // Then update leader highlight
  updateLeaderHighlight();
  
  const leaderRows = document.querySelectorAll('.leader');
  console.assert(leaderRows.length > 0, 'Should have leader highlighted');
  
  console.log('✓ updateLeaderHighlight tests passed');
}

// Run tests
try {
  testRenderScoreBoard();
  testRenderRoundProgress();
  testUpdateLeaderHighlight();
  console.log('\n✅ All scoreDisplay tests passed!');
} catch (error) {
  console.error('❌ Test failed:', error);
}