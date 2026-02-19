/**
 * @jest-environment jsdom
 */

const PlayerSetup = require('../src/player-setup');
const PlayerSetupUI = require('../src/player-setup-ui');

describe('PlayerSetupUI', () => {
  let playerSetup;
  let playerSetupUI;
  let container;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '<div id="test-container"></div>';
    container = document.getElementById('test-container');
    
    playerSetup = new PlayerSetup();
    playerSetupUI = new PlayerSetupUI(playerSetup);
    playerSetupUI.initialize(container);
  });

  describe('Initialization', () => {
    test('should render player setup UI', () => {
      expect(container.querySelector('.player-setup')).toBeTruthy();
      expect(container.querySelector('#playerNameInput')).toBeTruthy();
      expect(container.querySelector('#addPlayerBtn')).toBeTruthy();
      expect(container.querySelector('#startGameBtn')).toBeTruthy();
    });

    test('should disable start button initially', () => {
      const startBtn = container.querySelector('#startGameBtn');
      expect(startBtn.disabled).toBe(true);
    });

    test('should show validation message', () => {
      const validationMsg = container.querySelector('#validationMessage');
      expect(validationMsg.textContent).toContain('Need at least 2 players');
    });
  });

  describe('Adding Players via UI', () => {
    test('should add player when button clicked', () => {
      const nameInput = container.querySelector('#playerNameInput');
      const addBtn = container.querySelector('#addPlayerBtn');
      
      nameInput.value = 'Alice';
      addBtn.click();
      
      expect(playerSetup.getPlayerCount()).toBe(1);
      expect(container.querySelector('.player-name').textContent).toBe('Alice');
    });

    test('should add player when Enter key pressed', () => {
      const nameInput = container.querySelector('#playerNameInput');
      
      nameInput.value = 'Bob';
      nameInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
      
      expect(playerSetup.getPlayerCount()).toBe(1);
    });

    test('should clear input after adding player', () => {
      const nameInput = container.querySelector('#playerNameInput');
      const addBtn = container.querySelector('#addPlayerBtn');
      
      nameInput.value = 'Charlie';
      addBtn.click();
      
      expect(nameInput.value).toBe('');
    });

    test('should show error for invalid input', () => {
      const nameInput = container.querySelector('#playerNameInput');
      const addBtn = container.querySelector('#addPlayerBtn');
      
      nameInput.value = ''; // Empty name
      addBtn.click();
      
      const validationMsg = container.querySelector('#validationMessage');
      expect(validationMsg.classList.contains('error')).toBe(true);
    });
  });

  describe('Player List Display', () => {
    test('should show "no players" message initially', () => {
      const noPlayersMsg = container.querySelector('.no-players');
      expect(noPlayersMsg).toBeTruthy();
      expect(noPlayersMsg.textContent).toBe('No players added yet');
    });

    test('should display added players', () => {
      playerSetup.addPlayer('Alice');
      playerSetup.addPlayer('Bob');
      playerSetupUI.updatePlayersList();
      
      const playerItems = container.querySelectorAll('.player-item');
      expect(playerItems.length).toBe(2);
      expect(playerItems[0].querySelector('.player-name').textContent).toBe('Alice');
      expect(playerItems[1].querySelector('.player-name').textContent).toBe('Bob');
    });

    test('should show player scores', () => {
      playerSetup.addPlayer('Alice');
      playerSetupUI.updatePlayersList();
      
      const scoreElement = container.querySelector('.player-score');
      expect(scoreElement.textContent).toBe('Score: 0');
    });

    test('should show remove buttons for each player', () => {
      playerSetup.addPlayer('Alice');
      playerSetup.addPlayer('Bob');
      playerSetupUI.updatePlayersList();
      
      const removeButtons = container.querySelectorAll('.remove-btn');
      expect(removeButtons.length).toBe(2);
    });
  });

  describe('Game Controls', () => {
    test('should enable start button with 2+ players', () => {
      playerSetup.addPlayer('Alice');
      playerSetup.addPlayer('Bob');
      playerSetupUI.updateUI();
      
      const startBtn = container.querySelector('#startGameBtn');
      expect(startBtn.disabled).toBe(false);
    });

    test('should emit gameStart event when start clicked', () => {
      playerSetup.addPlayer('Alice');
      playerSetup.addPlayer('Bob');
      playerSetupUI.updateUI();
      
      let gameStartEvent = null;
      document.addEventListener('gameStart', (e) => {
        gameStartEvent = e;
      });
      
      const startBtn = container.querySelector('#startGameBtn');
      startBtn.click();
      
      expect(gameStartEvent).toBeTruthy();
      expect(gameStartEvent.detail.players.length).toBe(2);
    });

    test('should show confirmation before clearing players', () => {
      playerSetup.addPlayer('Alice');
      playerSetupUI.updateUI();
      
      // Mock confirm to return false
      window.confirm = jest.fn(() => false);
      
      const clearBtn = container.querySelector('#clearPlayersBtn');
      clearBtn.click();
      
      expect(window.confirm).toHaveBeenCalled();
      expect(playerSetup.getPlayerCount()).toBe(1); // Should not clear
    });
  });

  describe('Validation Messages', () => {
    test('should update validation message based on player count', () => {
      const validationMsg = container.querySelector('#validationMessage');
      
      // 0 players
      expect(validationMsg.textContent).toContain('Need at least 2 players');
      expect(validationMsg.classList.contains('invalid')).toBe(true);
      
      // Add 2 players
      playerSetup.addPlayer('Alice');
      playerSetup.addPlayer('Bob');
      playerSetupUI.updateUI();
      
      expect(validationMsg.textContent).toContain('Ready to start with 2 players');
      expect(validationMsg.classList.contains('valid')).toBe(true);
    });
  });

  describe('HTML Escaping', () => {
    test('should escape HTML in player names', () => {
      const maliciousName = '<script>alert("xss")</script>';
      playerSetup.addPlayer(maliciousName);
      playerSetupUI.updatePlayersList();
      
      const playerNameElement = container.querySelector('.player-name');
      expect(playerNameElement.innerHTML).not.toContain('<script>');
      expect(playerNameElement.textContent).toBe(maliciousName);
    });
  });
});