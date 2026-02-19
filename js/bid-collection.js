/**
 * Bid Collection Module
 * Handles the bid collection phase of the game
 */

class BidCollection {
    constructor() {
        this.currentRound = 0;
        this.handsInRound = 0;
        this.players = [];
        this.bids = new Map();
        this.proceedButton = null;
        this.totalDisplay = null;
    }

    /**
     * Shows the bid collection interface
     * @param {number} roundNumber - Current round number
     * @param {number} handsInRound - Number of hands available in this round
     * @param {Array} players - Array of player objects with id and name
     */
    showBidCollection(roundNumber, handsInRound, players) {
        this.currentRound = roundNumber;
        this.handsInRound = handsInRound;
        this.players = players;
        this.bids.clear();

        this.createBidCollectionUI();
        this.setupEventListeners();
        this.updateProceedButton();
    }

    /**
     * Creates the bid collection UI elements
     */
    createBidCollectionUI() {
        // Find or create container
        let container = document.getElementById('bid-collection-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'bid-collection-container';
            document.body.appendChild(container);
        }

        // Build UI HTML
        const html = `
            <div class="bid-collection-panel">
                <h2>Round ${this.currentRound} - Bid Collection</h2>
                <p class="round-info">Hands Available: <strong>${this.handsInRound}</strong></p>
                
                <div class="player-bids">
                    ${this.players.map(player => `
                        <div class="player-bid-row">
                            <label for="bid-${player.id}">${player.name}:</label>
                            <input 
                                type="number" 
                                id="bid-${player.id}" 
                                class="bid-input" 
                                data-player-id="${player.id}"
                                min="0" 
                                max="${this.handsInRound}" 
                                placeholder="Enter bid (0-${this.handsInRound})"
                            >
                            <span class="validation-message" id="validation-${player.id}"></span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="bid-summary">
                    <p class="total-display">Total Bids: <span id="bid-total">0</span> / ${this.handsInRound}</p>
                    <div class="validation-status" id="total-validation"></div>
                </div>
                
                <button id="proceed-bid-button" class="proceed-button" disabled>
                    Proceed to Next Phase
                </button>
            </div>
        `;

        container.innerHTML = html;

        // Store references
        this.totalDisplay = document.getElementById('bid-total');
        this.proceedButton = document.getElementById('proceed-bid-button');
    }

    /**
     * Sets up event listeners for bid inputs
     */
    setupEventListeners() {
        const bidInputs = document.querySelectorAll('.bid-input');
        
        bidInputs.forEach(input => {
            // Real-time validation on input
            input.addEventListener('input', (e) => {
                this.validateBid(e.target);
                this.updateBidTotal();
                this.updateProceedButton();
            });

            // Validation on blur
            input.addEventListener('blur', (e) => {
                this.validateBid(e.target);
            });

            // Prevent invalid characters
            input.addEventListener('keypress', (e) => {
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                    e.preventDefault();
                }
            });
        });
    }

    /**
     * Validates individual bid input
     * @param {HTMLInputElement} input - The input element to validate
     */
    validateBid(input) {
        const playerId = input.dataset.playerId;
        const value = input.value.trim();
        const validationElement = document.getElementById(`validation-${playerId}`);
        
        // Clear previous validation message
        validationElement.textContent = '';
        validationElement.className = 'validation-message';
        input.classList.remove('invalid', 'valid');

        // Check if empty
        if (value === '') {
            this.bids.delete(playerId);
            return false;
        }

        const bid = parseInt(value, 10);

        // Check if valid number
        if (isNaN(bid)) {
            validationElement.textContent = 'Please enter a valid number';
            validationElement.classList.add('error');
            input.classList.add('invalid');
            this.bids.delete(playerId);
            return false;
        }

        // Check range
        if (bid < 0 || bid > this.handsInRound) {
            validationElement.textContent = `Bid must be between 0 and ${this.handsInRound}`;
            validationElement.classList.add('error');
            input.classList.add('invalid');
            this.bids.delete(playerId);
            return false;
        }

        // Valid bid
        input.classList.add('valid');
        this.bids.set(playerId, bid);
        return true;
    }

    /**
     * Updates the total bid display
     */
    updateBidTotal() {
        const total = Array.from(this.bids.values()).reduce((sum, bid) => sum + bid, 0);
        
        if (this.totalDisplay) {
            this.totalDisplay.textContent = total;
            
            // Update total validation display
            const totalValidation = document.getElementById('total-validation');
            if (totalValidation) {
                totalValidation.className = 'validation-status';
                
                if (total > this.handsInRound) {
                    totalValidation.textContent = `Warning: Total bids (${total}) exceed available hands (${this.handsInRound})`;
                    totalValidation.classList.add('warning');
                } else if (total === this.handsInRound && this.bids.size === this.players.length) {
                    totalValidation.textContent = 'Perfect! All hands are bid.';
                    totalValidation.classList.add('success');
                } else {
                    totalValidation.textContent = '';
                }
            }
        }
    }

    /**
     * Updates the proceed button state
     */
    updateProceedButton() {
        if (!this.proceedButton) return;

        const allPlayersHaveBids = this.bids.size === this.players.length;
        const allBidsValid = this.validateAllBids();
        
        if (allPlayersHaveBids && allBidsValid) {
            this.proceedButton.disabled = false;
            this.proceedButton.textContent = 'Proceed to Next Phase';
        } else {
            this.proceedButton.disabled = true;
            if (!allPlayersHaveBids) {
                const remaining = this.players.length - this.bids.size;
                this.proceedButton.textContent = `Waiting for ${remaining} more bid${remaining !== 1 ? 's' : ''}`;
            } else {
                this.proceedButton.textContent = 'Fix invalid bids to proceed';
            }
        }
    }

    /**
     * Validates all current bids
     * @returns {boolean} - True if all bids are valid
     */
    validateAllBids() {
        for (const [playerId, bid] of this.bids) {
            if (typeof bid !== 'number' || bid < 0 || bid > this.handsInRound) {
                return false;
            }
        }
        return true;
    }

    /**
     * Gets all current bids
     * @returns {Array} - Array of {playerId, playerName, bid} objects
     */
    getBids() {
        const bidArray = [];
        
        for (const player of this.players) {
            const bid = this.bids.get(player.id);
            if (bid !== undefined) {
                bidArray.push({
                    playerId: player.id,
                    playerName: player.name,
                    bid: bid
                });
            }
        }
        
        return bidArray;
    }

    /**
     * Clears the bid collection UI
     */
    clearUI() {
        const container = document.getElementById('bid-collection-container');
        if (container) {
            container.innerHTML = '';
        }
    }
}

// Global instance
let bidCollectionInstance = null;

/**
 * Shows the bid collection interface
 * @param {number} roundNumber - Current round number
 * @param {number} handsInRound - Number of hands available in this round
 * @param {Array} players - Array of player objects with id and name
 */
function showBidCollection(roundNumber, handsInRound, players) {
    if (!bidCollectionInstance) {
        bidCollectionInstance = new BidCollection();
    }
    bidCollectionInstance.showBidCollection(roundNumber, handsInRound, players);
}

/**
 * Gets all current bids
 * @returns {Array} - Array of {playerId, playerName, bid} objects
 */
function getBids() {
    if (!bidCollectionInstance) {
        return [];
    }
    return bidCollectionInstance.getBids();
}

// Export functions for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showBidCollection,
        getBids,
        BidCollection
    };
}