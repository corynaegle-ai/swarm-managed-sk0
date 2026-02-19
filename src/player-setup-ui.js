/**
 * PlayerSetupUI handles the user interface for player setup
 */
class PlayerSetupUI {
  constructor(playerSetup) {
    this.playerSetup = playerSetup;
    this.setupContainer = null;
  }

  /**
   * Initialize the UI elements
   * @param {HTMLElement} container - Container element for the setup UI
   */
  initialize(container) {
    this.setupContainer = container;
    this.render();
  }

  /**
   * Render the complete player setup UI
   */
  render() {
    if (!this.setupContainer) return;

    this.setupContainer.innerHTML = `
      <div class="player-setup">
        <h2>Player Setup</h2>
        
        <div class="add-player-section">
          <input type="text" id="playerNameInput" placeholder="Enter player name" maxlength="50">
          <button id="addPlayerBtn">Add Player</button>
        </div>
        
        <div class="player-list">
          <h3>Players (${this.playerSetup.getPlayerCount()}):</h3>
          <ul id="playersList"></ul>
        </div>
        
        <div class="validation-message" id="validationMessage">
          ${this.playerSetup.getValidationMessage()}
        </div>
        
        <div class="game-controls">
          <button id="startGameBtn" ${!this.playerSetup.canStartGame() ? 'disabled' : ''}>Start Game</button>
          <button id="clearPlayersBtn" ${this.playerSetup.getPlayerCount() === 0 ? 'disabled' : ''}>Clear All</button>
        </div>
      </div>
    `;

    this.attachEventListeners();
    this.updatePlayersList();
  }

  /**
   * Attach event listeners to UI elements
   */
  attachEventListeners() {
    const addBtn = document.getElementById('addPlayerBtn');
    const nameInput = document.getElementById('playerNameInput');
    const startBtn = document.getElementById('startGameBtn');
    const clearBtn = document.getElementById('clearPlayersBtn');

    if (addBtn) {
      addBtn.addEventListener('click', () => this.handleAddPlayer());
    }

    if (nameInput) {
      nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleAddPlayer();
        }
      });
    }

    if (startBtn) {
      startBtn.addEventListener('click', () => this.handleStartGame());
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.handleClearPlayers());
    }
  }

  /**
   * Handle adding a new player
   */
  handleAddPlayer() {
    const nameInput = document.getElementById('playerNameInput');
    if (!nameInput) return;

    const name = nameInput.value;
    
    try {
      this.playerSetup.addPlayer(name);
      nameInput.value = '';
      this.updateUI();
    } catch (error) {
      this.showError(error.message);
    }
  }

  /**
   * Handle starting the game
   */
  handleStartGame() {
    if (this.playerSetup.canStartGame()) {
      // Emit custom event that game can listen to
      const event = new CustomEvent('gameStart', {
        detail: { players: this.playerSetup.getPlayers() }
      });
      document.dispatchEvent(event);
    }
  }

  /**
   * Handle clearing all players
   */
  handleClearPlayers() {
    if (confirm('Are you sure you want to clear all players?')) {
      this.playerSetup.clearPlayers();
      this.updateUI();
    }
  }

  /**
   * Update the players list display
   */
  updatePlayersList() {
    const playersList = document.getElementById('playersList');
    if (!playersList) return;

    const players = this.playerSetup.getPlayers();
    
    if (players.length === 0) {
      playersList.innerHTML = '<li class="no-players">No players added yet</li>';
      return;
    }

    playersList.innerHTML = players.map((player, index) => `
      <li class="player-item">
        <span class="player-name">${this.escapeHtml(player.name)}</span>
        <span class="player-score">Score: ${player.totalScore}</span>
        <button class="remove-btn" onclick="this.parentElement.dispatchEvent(new CustomEvent('removePlayer', {detail: {index: ${index}}, bubbles: true}))">×</button>
      </li>
    `).join('');

    // Add remove player event listener
    playersList.addEventListener('removePlayer', (e) => {
      this.playerSetup.removePlayer(e.detail.index);
      this.updateUI();
    });
  }

  /**
   * Update the entire UI
   */
  updateUI() {
    this.updatePlayersList();
    
    // Update validation message
    const validationMsg = document.getElementById('validationMessage');
    if (validationMsg) {
      validationMsg.textContent = this.playerSetup.getValidationMessage();
      validationMsg.className = `validation-message ${this.playerSetup.canStartGame() ? 'valid' : 'invalid'}`;
    }

    // Update button states
    const startBtn = document.getElementById('startGameBtn');
    if (startBtn) {
      startBtn.disabled = !this.playerSetup.canStartGame();
    }

    const clearBtn = document.getElementById('clearPlayersBtn');
    if (clearBtn) {
      clearBtn.disabled = this.playerSetup.getPlayerCount() === 0;
    }

    // Update player count in header
    const playerCountHeader = this.setupContainer.querySelector('.player-list h3');
    if (playerCountHeader) {
      playerCountHeader.textContent = `Players (${this.playerSetup.getPlayerCount()}):`;
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    const validationMsg = document.getElementById('validationMessage');
    if (validationMsg) {
      validationMsg.textContent = message;
      validationMsg.className = 'validation-message error';
      
      // Reset to normal validation message after 3 seconds
      setTimeout(() => {
        this.updateUI();
      }, 3000);
    }
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} - Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PlayerSetupUI;
}