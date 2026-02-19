class TricksEntry {
    constructor() {
        this.gameState = this.loadGameState();
        this.currentRound = this.gameState.currentRound;
        this.roundData = this.gameState.rounds[this.currentRound];
        this.submitButton = null;
        this.init();
    }

    loadGameState() {
        const stored = localStorage.getItem('gameState');
        if (!stored) {
            throw new Error('No game state found. Please start a new game.');
        }
        return JSON.parse(stored);
    }

    saveGameState() {
        localStorage.setItem('gameState', JSON.stringify(this.gameState));
    }

    init() {
        this.createTricksEntryForm();
        this.populatePlayerBids();
        this.attachEventListeners();
        this.validateForm();
    }

    createTricksEntryForm() {
        const container = document.getElementById('tricks-entry-container') || document.body;
        
        const formHTML = `
            <div class="tricks-entry-section">
                <h2>Round ${this.currentRound + 1} - Tricks Taken</h2>
                <div class="round-info">
                    <p>Cards per player: ${this.roundData.cardsPerPlayer}</p>
                    <p>Trump suit: ${this.roundData.trumpSuit || 'None'}</p>
                </div>
                <form id="tricks-form" class="tricks-form">
                    <div id="players-tricks-container" class="players-container">
                        <!-- Player entries will be populated here -->
                    </div>
                    <div class="form-actions">
                        <button type="submit" id="submit-tricks" class="btn btn-primary" disabled>
                            Calculate Scores
                        </button>
                        <button type="button" id="back-to-bidding" class="btn btn-secondary">
                            Back to Bidding
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        container.innerHTML = formHTML;
        this.submitButton = document.getElementById('submit-tricks');
    }

    populatePlayerBids() {
        const playersContainer = document.getElementById('players-tricks-container');
        let playerEntries = '';

        this.gameState.players.forEach((player, index) => {
            const bid = this.roundData.bids[index];
            const currentTricks = bid.tricksTaken || '';
            const currentBonus = bid.bonusPoints || '';

            playerEntries += `
                <div class="player-entry" data-player-index="${index}">
                    <div class="player-header">
                        <h3>${player.name}</h3>
                        <span class="bid-display">Bid: ${bid.bid}</span>
                    </div>
                    <div class="input-group">
                        <label for="tricks-${index}">Tricks Taken:</label>
                        <input 
                            type="number" 
                            id="tricks-${index}" 
                            name="tricks-${index}"
                            min="0" 
                            max="${this.roundData.cardsPerPlayer}"
                            value="${currentTricks}"
                            class="tricks-input"
                            data-player-index="${index}"
                            required
                        >
                    </div>
                    <div class="input-group">
                        <label for="bonus-${index}">Bonus Points:</label>
                        <input 
                            type="number" 
                            id="bonus-${index}" 
                            name="bonus-${index}"
                            min="0" 
                            value="${currentBonus}"
                            class="bonus-input"
                            data-player-index="${index}"
                        >
                    </div>
                </div>
            `;
        });

        playersContainer.innerHTML = playerEntries;
    }

    attachEventListeners() {
        // Form submission
        document.getElementById('tricks-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Back button
        document.getElementById('back-to-bidding').addEventListener('click', () => {
            window.location.href = 'bidding.html';
        });

        // Input validation on change
        document.querySelectorAll('.tricks-input, .bonus-input').forEach(input => {
            input.addEventListener('input', () => {
                this.validateInput(input);
                this.validateForm();
            });

            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
        });
    }

    validateInput(input) {
        const value = parseInt(input.value);
        const min = parseInt(input.min);
        const max = parseInt(input.max);
        
        // Remove previous error styling
        input.classList.remove('error');
        
        // Validate tricks input
        if (input.classList.contains('tricks-input')) {
            if (isNaN(value) || value < min || value > max) {
                input.classList.add('error');
                return false;
            }
        }
        
        // Validate bonus input (optional, but if provided must be >= 0)
        if (input.classList.contains('bonus-input')) {
            if (input.value !== '' && (isNaN(value) || value < min)) {
                input.classList.add('error');
                return false;
            }
        }
        
        return true;
    }

    validateForm() {
        let allValid = true;
        let totalTricks = 0;
        
        // Check all tricks inputs are filled and valid
        document.querySelectorAll('.tricks-input').forEach(input => {
            if (!input.value || !this.validateInput(input)) {
                allValid = false;
            } else {
                totalTricks += parseInt(input.value);
            }
        });

        // Check all bonus inputs are valid (can be empty)
        document.querySelectorAll('.bonus-input').forEach(input => {
            if (!this.validateInput(input)) {
                allValid = false;
            }
        });

        // Validate total tricks matches cards per player (optional warning)
        const expectedTotal = this.roundData.cardsPerPlayer;
        if (allValid && totalTricks !== expectedTotal) {
            this.showTricksWarning(totalTricks, expectedTotal);
        } else {
            this.hideTricksWarning();
        }

        this.submitButton.disabled = !allValid;
        return allValid;
    }

    showTricksWarning(actual, expected) {
        let warningEl = document.getElementById('tricks-warning');
        if (!warningEl) {
            warningEl = document.createElement('div');
            warningEl.id = 'tricks-warning';
            warningEl.className = 'warning-message';
            document.getElementById('players-tricks-container').after(warningEl);
        }
        warningEl.innerHTML = `
            <strong>Warning:</strong> Total tricks (${actual}) doesn't match expected total (${expected}).
            This may be correct if cards were not played.
        `;
    }

    hideTricksWarning() {
        const warningEl = document.getElementById('tricks-warning');
        if (warningEl) {
            warningEl.remove();
        }
    }

    handleSubmit() {
        if (!this.validateForm()) {
            alert('Please correct the errors before submitting.');
            return;
        }

        try {
            // Update gameState with tricks taken and bonus points
            this.gameState.players.forEach((player, index) => {
                const tricksInput = document.getElementById(`tricks-${index}`);
                const bonusInput = document.getElementById(`bonus-${index}`);
                
                this.roundData.bids[index].tricksTaken = parseInt(tricksInput.value);
                this.roundData.bids[index].bonusPoints = parseInt(bonusInput.value) || 0;
            });

            // Mark round as having tricks entered
            this.roundData.tricksEntered = true;
            this.roundData.lastUpdated = new Date().toISOString();

            // Save updated game state
            this.saveGameState();

            // Navigate to score calculation
            window.location.href = 'scoring.html';
        } catch (error) {
            console.error('Error saving tricks data:', error);
            alert('Error saving data. Please try again.');
        }
    }

    // Utility method to get current round data
    getCurrentRoundData() {
        return this.roundData;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        new TricksEntry();
    } catch (error) {
        console.error('Error initializing tricks entry:', error);
        alert('Error loading game data. Please return to the main menu.');
        window.location.href = 'index.html';
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TricksEntry;
}