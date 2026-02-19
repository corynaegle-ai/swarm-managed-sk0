// UI management functions
class UIManager {
  constructor() {
    this.resetButton = null;
    this.init();
  }

  init() {
    // Initialize UI components
    this.createResetButton();
    this.setupEventListeners();
  }

  // Create reset button if it doesn't exist
  createResetButton() {
    if (!this.resetButton) {
      this.resetButton = document.createElement('button');
      this.resetButton.id = 'resetButton';
      this.resetButton.className = 'reset-button';
      this.resetButton.textContent = 'Reset Game';
      this.resetButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 15px;
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transition: background-color 0.3s ease;
        z-index: 1000;
        display: none;
      `;
      
      // Add hover effect
      this.resetButton.addEventListener('mouseenter', () => {
        this.resetButton.style.backgroundColor = '#c82333';
      });
      
      this.resetButton.addEventListener('mouseleave', () => {
        this.resetButton.style.backgroundColor = '#dc3545';
      });
      
      // Add click handler
      this.resetButton.addEventListener('click', () => {
        this.handleResetClick();
      });
      
      // Append to body
      document.body.appendChild(this.resetButton);
    }
    return this.resetButton;
  }

  // Show reset button
  showResetButton() {
    if (!this.resetButton) {
      this.createResetButton();
    }
    this.resetButton.style.display = 'block';
    return this;
  }

  // Hide reset button
  hideResetButton() {
    if (this.resetButton) {
      this.resetButton.style.display = 'none';
    }
    return this;
  }

  // Handle reset button click
  handleResetClick() {
    if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
      // Reset game state
      if (typeof gameState !== 'undefined') {
        gameState.resetGame();
      }
      
      // Hide reset button after reset
      this.hideResetButton();
      
      // Trigger custom event for other components
      window.dispatchEvent(new CustomEvent('uiReset'));
    }
  }

  // Update reset button visibility based on game phase
  updateResetButtonVisibility() {
    if (typeof gameState !== 'undefined') {
      if (gameState.isActiveGamePhase()) {
        this.showResetButton();
      } else {
        this.hideResetButton();
      }
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Listen for game state changes
    window.addEventListener('gameReset', () => {
      this.hideResetButton();
    });
    
    // Listen for game phase changes
    window.addEventListener('gamePhaseChange', () => {
      this.updateResetButtonVisibility();
    });
    
    // Auto-update visibility when game state changes
    if (typeof gameState !== 'undefined') {
      // Periodically check game state to update button visibility
      setInterval(() => {
        this.updateResetButtonVisibility();
      }, 1000);
    }
  }

  // Get reset button element
  getResetButton() {
    return this.resetButton;
  }

  // Utility function to check if element exists
  elementExists(selector) {
    return document.querySelector(selector) !== null;
  }

  // Utility function to safely get element
  safeGetElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`Element not found: ${selector}`);
    }
    return element;
  }
}

// Create global UI manager instance
const uiManager = new UIManager();

// Standalone functions for backward compatibility
function showResetButton() {
  return uiManager.showResetButton();
}

function hideResetButton() {
  return uiManager.hideResetButton();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    UIManager,
    uiManager,
    showResetButton,
    hideResetButton
  };
}

// Make available globally
if (typeof window !== 'undefined') {
  window.uiManager = uiManager;
  window.showResetButton = showResetButton;
  window.hideResetButton = hideResetButton;
}