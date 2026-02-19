// Test file for PlayerSetup class
// This would be used if testing framework is available

if (typeof require !== 'undefined') {
    const PlayerSetup = require('../js/player-setup.js');
}

// Basic functionality tests
function testPlayerSetup() {
    const setup = new PlayerSetup();
    
    console.log('Testing PlayerSetup class...');
    
    // Test initial state
    console.assert(setup.getPlayerCount() === 0, 'Initial player count should be 0');
    console.assert(setup.getPlayers().length === 0, 'Initial players array should be empty');
    
    // Test adding players
    const result1 = setup.addPlayer('Alice');
    console.assert(result1.success === true, 'Should successfully add first player');
    console.assert(setup.getPlayerCount() === 1, 'Player count should be 1');
    
    const result2 = setup.addPlayer('Bob');
    console.assert(result2.success === true, 'Should successfully add second player');
    console.assert(setup.getPlayerCount() === 2, 'Player count should be 2');
    
    // Test duplicate name validation
    const result3 = setup.addPlayer('Alice');
    console.assert(result3.success === false, 'Should reject duplicate name');
    console.assert(setup.getPlayerCount() === 2, 'Player count should remain 2');
    
    // Test empty name validation
    const result4 = setup.addPlayer('');
    console.assert(result4.success === false, 'Should reject empty name');
    
    // Test player removal
    const removeResult = setup.removePlayer(0);
    console.assert(removeResult.success === true, 'Should successfully remove player');
    console.assert(setup.getPlayerCount() === 1, 'Player count should be 1 after removal');
    
    console.log('All tests passed!');
}

// Run tests if in Node.js environment
if (typeof require !== 'undefined') {
    testPlayerSetup();
}