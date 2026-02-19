// Tests for UI functionality
describe('UI Manager', () => {
  let uiManager;

  beforeEach(() => {
    // Clean up DOM
    const existingButton = document.getElementById('resetButton');
    if (existingButton) {
      existingButton.remove();
    }

    // Create new UI manager
    if (typeof UIManager !== 'undefined') {
      uiManager = new UIManager();
    } else {
      uiManager = window.uiManager;
    }
  });

  afterEach(() => {
    // Clean up
    const button = document.getElementById('resetButton');
    if (button) {
      button.remove();
    }
  });

  describe('showResetButton()', () => {
    test('should make reset button visible', () => {
      uiManager.showResetButton();
      const button = document.getElementById('resetButton');
      
      expect(button).toBeTruthy();
      expect(button.style.display).toBe('block');
    });

    test('should create button if it does not exist', () => {
      expect(document.getElementById('resetButton')).toBeNull();
      
      uiManager.showResetButton();
      
      expect(document.getElementById('resetButton')).toBeTruthy();
    });
  });

  describe('hideResetButton()', () => {
    test('should hide reset button', () => {
      uiManager.showResetButton();
      uiManager.hideResetButton();
      
      const button = document.getElementById('resetButton');
      expect(button.style.display).toBe('none');
    });

    test('should not throw error if button does not exist', () => {
      expect(() => {
        uiManager.hideResetButton();
      }).not.toThrow();
    });
  });

  describe('reset button styling', () => {
    test('should have appropriate styling', () => {
      uiManager.showResetButton();
      const button = document.getElementById('resetButton');
      
      expect(button.className).toBe('reset-button');
      expect(button.style.position).toBe('fixed');
      expect(button.style.top).toBe('20px');
      expect(button.style.right).toBe('20px');
      expect(button.style.backgroundColor).toBe('rgb(220, 53, 69)');
      expect(button.style.color).toBe('white');
    });

    test('should be positioned correctly', () => {
      uiManager.showResetButton();
      const button = document.getElementById('resetButton');
      
      expect(button.style.position).toBe('fixed');
      expect(button.style.top).toBe('20px');
      expect(button.style.right).toBe('20px');
      expect(button.style.zIndex).toBe('1000');
    });
  });

  describe('button visibility during game phases', () => {
    test('should show button during active game phases', () => {
      if (typeof gameState !== 'undefined') {
        gameState.currentPhase = 'playing';
        uiManager.updateResetButtonVisibility();
        
        const button = document.getElementById('resetButton');
        expect(button.style.display).toBe('block');
      }
    });

    test('should hide button during setup phase', () => {
      if (typeof gameState !== 'undefined') {
        gameState.currentPhase = 'setup';
        uiManager.updateResetButtonVisibility();
        
        const button = document.getElementById('resetButton');
        if (button) {
          expect(button.style.display).toBe('none');
        }
      }
    });
  });

  describe('reset button click handling', () => {
    test('should call resetGame when clicked and confirmed', () => {
      if (typeof gameState !== 'undefined') {
        const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true);
        const resetSpy = jest.spyOn(gameState, 'resetGame');
        
        uiManager.showResetButton();
        const button = document.getElementById('resetButton');
        button.click();
        
        expect(resetSpy).toHaveBeenCalled();
        
        mockConfirm.mockRestore();
        resetSpy.mockRestore();
      }
    });

    test('should not reset when click is cancelled', () => {
      if (typeof gameState !== 'undefined') {
        const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
        const resetSpy = jest.spyOn(gameState, 'resetGame');
        
        uiManager.showResetButton();
        const button = document.getElementById('resetButton');
        button.click();
        
        expect(resetSpy).not.toHaveBeenCalled();
        
        mockConfirm.mockRestore();
        resetSpy.mockRestore();
      }
    });
  });
});