/**
 * @jest-environment jsdom
 */

const PlayerSetup = require('../src/player-setup');
const PlayerSetupUI = require('../src/player-setup-ui');

describe('Player Setup Integration Tests', () => {
  let playerSetup;
  let playerSetupUI;
  let container;

  beforeEach(() => {
    document.body.innerHTML = '<div id="test-container"></div>';
    container = document.getElementById('test-container');
    
    playerSetup = new PlayerSetup();
    playerSetupUI = new PlayerSetupUI(playerSetup);
    playerSetupUI.initialize(container);
  });

  describe('Complete Player Setup Flow', () => {
    test('should handle full player setup workflow', () => {
      // Initial state - no players, can't start
      expect(playerSetup.getPlayerCount()).toBe(0);
      expect(playerSetup.canStartGame()).toBe(false);
      expect(container.querySelector('#startGameBtn').disabled).toBe(true);
      
      // Add first player
      const nameInput = container.querySelector('#playerNameInput');
      const addBtn = container.querySelector('#addPlayerBtn');
      
      nameInput.value = 'Alice';
      addBtn.click();
      
      expect(playerSetup.getPlayerCount()).toBe(1);
      expect(playerSetup.canStartGame()).toBe(false);
      expect(container.querySelector('#startGameBtn').disabled).toBe(true);
      
      // Add second player - now can start
      nameInput.value = 'Bob';
      addBtn.click();
      
      expect(playerSetup.getPlayerCount()).toBe(2);
      expect(playerSetup.canStartGame()).toBe(true);
      expect(container.querySelector('#startGameBtn').disabled).toBe(false);
      
      // Verify players are displayed
      const playerItems = container.querySelectorAll('.player-item');
      expect(playerItems.length).toBe(2);
      
      // Verify validation message
      const validationMsg = container.querySelector('#validationMessage');
      expect(validationMsg.textContent).toContain('Ready to start with 2 players');
    });

    test('should enforce 8 player maximum', () => {
      const nameInput = container.querySelector('#playerNameInput');
      const addBtn = container.querySelector('#addPlayerBtn');
      
      // Add 8 players
      for (let i = 1; i <= 8; i++) {
        nameInput.value = `Player${i}`;
        addBtn.click();
      }
      
      expect(playerSetup.getPlayerCount()).toBe(8);
      expect(playerSetup.canStartGame()).toBe(true);
      
      // Try to add 9th player - should show error
      nameInput.value = 'Player9';
      addBtn.click();
      
      expect(playerSetup.getPlayerCount()).toBe(8); // Still 8
      const validationMsg = container.querySelector('#validationMessage');
      expect(validationMsg.classList.contains('error')).toBe(true);
    });

    test('should handle player removal and re-enable controls', () => {
      // Add 3 players
      ['Alice', 'Bob', 'Charlie'].forEach(name => {
        playerSetup.addPlayer(name);
      });
      playerSetupUI.updateUI();
      
      expect(playerSetup.canStartGame()).toBe(true);
      
      // Remove middle player (Bob)
      playerSetup.removePlayer(1);
      playerSetupUI.updateUI();
      
      expect(playerSetup.getPlayerCount()).toBe(2);
      expect(playerSetup.canStartGame()).toBe(true);
      
      const players = playerSetup.getPlayers();
      expect(players[0].name).toBe('Alice');
      expect(players[1].name).toBe('Charlie');
      
      // Remove another player - should disable start
      playerSetup.removePlayer(1);
      playerSetupUI.updateUI();
      
      expect(playerSetup.getPlayerCount()).toBe(1);
      expect(playerSetup.canStartGame()).toBe(false);
      expect(container.querySelector('#startGameBtn').disabled).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle duplicate name attempts', () => {
      const nameInput = container.querySelector('#playerNameInput');
      const addBtn = container.querySelector('#addPlayerBtn');
      
      // Add Alice
      nameInput.value = 'Alice';
      addBtn.click();
      expect(playerSetup.getPlayerCount()).toBe(1);
      
      // Try to add Alice again
      nameInput.value = 'Alice';
      addBtn.click();
      
      expect(playerSetup.getPlayerCount()).toBe(1); // Still 1
      const validationMsg = container.querySelector('#validationMessage');
      expect(validationMsg.classList.contains('error')).toBe(true);
      expect(validationMsg.textContent).toContain('unique');
    });

    test('should handle whitespace-only names', () => {
      const nameInput = container.querySelector('#playerNameInput');
      const addBtn = container.querySelector('#addPlayerBtn');
      
      nameInput.value = '   ';
      addBtn.click();
      
      expect(playerSetup.getPlayerCount()).toBe(0);
      const validationMsg = container.querySelector('#validationMessage');
      expect(validationMsg.classList.contains('error')).toBe(true);
    });

    test('should trim names and prevent duplicates after trimming', () => {
      const nameInput = container.querySelector('#playerNameInput');
      const addBtn = container.querySelector('#addPlayerBtn');
      
      // Add "Alice" with spaces
      nameInput.value = '  Alice  ';
      addBtn.click();
      expect(playerSetup.getPlayers()[0].name).toBe('Alice');
      
      // Try to add "Alice" without spaces - should be duplicate
      nameInput.value = 'Alice';
      addBtn.click();
      
      expect(playerSetup.getPlayerCount()).toBe(1);
    });
  });

  describe('Game Start Event', () => {
    test('should emit correct player data on game start', () => {
      // Add players
      playerSetup.addPlayer('Alice');
      playerSetup.addPlayer('Bob');
      playerSetupUI.updateUI();
      
      let capturedEvent = null;
      document.addEventListener('gameStart', (event) => {
        capturedEvent = event;
      });
      
      // Start game
      const startBtn = container.querySelector('#startGameBtn');
      startBtn.click();
      
      expect(capturedEvent).toBeTruthy();
      expect(capturedEvent.detail.players).toHaveLength(2);
      expect(capturedEvent.detail.players[0]).toEqual({
        name: 'Alice',
        totalScore: 0
      });
      expect(capturedEvent.detail.players[1]).toEqual({
        name: 'Bob',
        totalScore: 0
      });
    });
  });
});