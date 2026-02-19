const PlayerSetup = require('../src/player-setup');

describe('PlayerSetup', () => {
  let playerSetup;

  beforeEach(() => {
    playerSetup = new PlayerSetup();
  });

  describe('Adding Players', () => {
    test('should add a player with valid name', () => {
      const result = playerSetup.addPlayer('Alice');
      expect(result).toBe(true);
      expect(playerSetup.getPlayerCount()).toBe(1);
      expect(playerSetup.getPlayers()[0]).toEqual({
        name: 'Alice',
        totalScore: 0
      });
    });

    test('should trim whitespace from player names', () => {
      playerSetup.addPlayer('  Bob  ');
      expect(playerSetup.getPlayers()[0].name).toBe('Bob');
    });

    test('should throw error for empty name', () => {
      expect(() => playerSetup.addPlayer('')).toThrow('Player name is required');
      expect(() => playerSetup.addPlayer('   ')).toThrow('Player name is required');
    });

    test('should throw error for non-string name', () => {
      expect(() => playerSetup.addPlayer(null)).toThrow('Player name is required');
      expect(() => playerSetup.addPlayer(123)).toThrow('Player name is required');
    });

    test('should prevent duplicate names', () => {
      playerSetup.addPlayer('Alice');
      expect(() => playerSetup.addPlayer('Alice')).toThrow('Player name must be unique');
    });

    test('should allow adding up to 8 players', () => {
      for (let i = 1; i <= 8; i++) {
        playerSetup.addPlayer(`Player${i}`);
      }
      expect(playerSetup.getPlayerCount()).toBe(8);
    });

    test('should prevent adding more than 8 players', () => {
      for (let i = 1; i <= 8; i++) {
        playerSetup.addPlayer(`Player${i}`);
      }
      expect(() => playerSetup.addPlayer('Player9')).toThrow('Cannot add more than 8 players');
    });
  });

  describe('Game Validation', () => {
    test('should not allow starting game with 0 players', () => {
      expect(playerSetup.canStartGame()).toBe(false);
    });

    test('should not allow starting game with 1 player', () => {
      playerSetup.addPlayer('Alice');
      expect(playerSetup.canStartGame()).toBe(false);
    });

    test('should allow starting game with 2 players', () => {
      playerSetup.addPlayer('Alice');
      playerSetup.addPlayer('Bob');
      expect(playerSetup.canStartGame()).toBe(true);
    });

    test('should allow starting game with 8 players', () => {
      for (let i = 1; i <= 8; i++) {
        playerSetup.addPlayer(`Player${i}`);
      }
      expect(playerSetup.canStartGame()).toBe(true);
    });

    test('should provide appropriate validation messages', () => {
      expect(playerSetup.getValidationMessage()).toContain('Need at least 2 players');
      
      playerSetup.addPlayer('Alice');
      expect(playerSetup.getValidationMessage()).toContain('Need at least 2 players');
      
      playerSetup.addPlayer('Bob');
      expect(playerSetup.getValidationMessage()).toContain('Ready to start with 2 players');
    });
  });

  describe('Player Management', () => {
    test('should remove player by index', () => {
      playerSetup.addPlayer('Alice');
      playerSetup.addPlayer('Bob');
      playerSetup.addPlayer('Charlie');
      
      playerSetup.removePlayer(1); // Remove Bob
      
      const players = playerSetup.getPlayers();
      expect(players.length).toBe(2);
      expect(players[0].name).toBe('Alice');
      expect(players[1].name).toBe('Charlie');
    });

    test('should handle invalid remove index gracefully', () => {
      playerSetup.addPlayer('Alice');
      playerSetup.removePlayer(5); // Invalid index
      expect(playerSetup.getPlayerCount()).toBe(1);
    });

    test('should clear all players', () => {
      playerSetup.addPlayer('Alice');
      playerSetup.addPlayer('Bob');
      playerSetup.clearPlayers();
      expect(playerSetup.getPlayerCount()).toBe(0);
    });

    test('should return copy of players array', () => {
      playerSetup.addPlayer('Alice');
      const players1 = playerSetup.getPlayers();
      const players2 = playerSetup.getPlayers();
      
      expect(players1).not.toBe(players2); // Different objects
      expect(players1).toEqual(players2); // Same content
    });
  });

  describe('Initial State', () => {
    test('should start with 0 players', () => {
      expect(playerSetup.getPlayerCount()).toBe(0);
      expect(playerSetup.getPlayers()).toEqual([]);
    });

    test('should have correct min/max player limits', () => {
      expect(playerSetup.minPlayers).toBe(2);
      expect(playerSetup.maxPlayers).toBe(8);
    });
  });
});