/**
 * Test suite for PlayerSetup class
 */

// Import PlayerSetup class (adjust path as needed)
const PlayerSetup = require('../js/player-setup.js');

describe('PlayerSetup', () => {
  let playerSetup;

  beforeEach(() => {
    playerSetup = new PlayerSetup();
  });

  describe('addPlayer', () => {
    test('should add a valid player', () => {
      const result = playerSetup.addPlayer('John');
      expect(result).toBe(true);
      expect(playerSetup.getPlayerCount()).toBe(1);
      
      const players = playerSetup.getPlayers();
      expect(players[0].name).toBe('John');
      expect(players[0].totalScore).toBe(0);
      expect(players[0].id).toBeDefined();
    });

    test('should trim whitespace from names', () => {
      playerSetup.addPlayer('  John  ');
      const players = playerSetup.getPlayers();
      expect(players[0].name).toBe('John');
    });

    test('should reject empty names', () => {
      expect(() => playerSetup.addPlayer('')).toThrow('Player name cannot be empty');
      expect(() => playerSetup.addPlayer('   ')).toThrow('Player name cannot be empty');
      expect(() => playerSetup.addPlayer(null)).toThrow('Player name cannot be empty');
    });

    test('should reject duplicate names (case-insensitive)', () => {
      playerSetup.addPlayer('John');
      expect(() => playerSetup.addPlayer('John')).toThrow('Player name must be unique');
      expect(() => playerSetup.addPlayer('JOHN')).toThrow('Player name must be unique');
      expect(() => playerSetup.addPlayer('john')).toThrow('Player name must be unique');
    });

    test('should enforce 8 player limit', () => {
      // Add 8 players
      for (let i = 1; i <= 8; i++) {
        playerSetup.addPlayer(`Player${i}`);
      }
      
      expect(playerSetup.getPlayerCount()).toBe(8);
      expect(() => playerSetup.addPlayer('Player9')).toThrow('Maximum of 8 players allowed');
    });
  });

  describe('removePlayer', () => {
    test('should remove player by valid index', () => {
      playerSetup.addPlayer('John');
      playerSetup.addPlayer('Jane');
      
      const result = playerSetup.removePlayer(0);
      expect(result).toBe(true);
      expect(playerSetup.getPlayerCount()).toBe(1);
      expect(playerSetup.getPlayers()[0].name).toBe('Jane');
    });

    test('should reject invalid indices', () => {
      playerSetup.addPlayer('John');
      
      expect(() => playerSetup.removePlayer(-1)).toThrow('Invalid player index');
      expect(() => playerSetup.removePlayer(1)).toThrow('Invalid player index');
      expect(() => playerSetup.removePlayer('0')).toThrow('Invalid player index');
    });
  });

  describe('getPlayers', () => {
    test('should return copy of players array', () => {
      playerSetup.addPlayer('John');
      const players = playerSetup.getPlayers();
      
      // Modify the returned array
      players.push({id: 999, name: 'Hacker', totalScore: 100});
      
      // Original should be unchanged
      expect(playerSetup.getPlayerCount()).toBe(1);
    });
  });

  describe('getPlayerCount', () => {
    test('should return correct count', () => {
      expect(playerSetup.getPlayerCount()).toBe(0);
      
      playerSetup.addPlayer('John');
      expect(playerSetup.getPlayerCount()).toBe(1);
      
      playerSetup.addPlayer('Jane');
      expect(playerSetup.getPlayerCount()).toBe(2);
      
      playerSetup.removePlayer(0);
      expect(playerSetup.getPlayerCount()).toBe(1);
    });
  });
});