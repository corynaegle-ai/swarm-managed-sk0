/**
 * PlayerSetup class manages the player list for the game
 * Handles adding, removing, and validating players
 */
class PlayerSetup {
    constructor() {
        this.players = [];
        this.nextId = 1;
    }

    /**
     * Add a new player to the game
     * @param {string} name - Player's name
     * @returns {Object} - Result object with success status and message
     */
    addPlayer(name) {
        // Validate name is not empty
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return {
                success: false,
                message: 'Player name cannot be empty'
            };
        }

        const trimmedName = name.trim();

        // Check for duplicate names (case-insensitive)
        const isDuplicate = this.players.some(player => 
            player.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (isDuplicate) {
            return {
                success: false,
                message: 'Player name must be unique'
            };
        }

        // Check player count limit (maximum 8 players)
        if (this.players.length >= 8) {
            return {
                success: false,
                message: 'Maximum 8 players allowed'
            };
        }

        // Create new player object
        const newPlayer = {
            id: Date.now() + this.nextId++, // Ensure uniqueness
            name: trimmedName,
            totalScore: 0
        };

        this.players.push(newPlayer);

        return {
            success: true,
            message: 'Player added successfully',
            player: newPlayer
        };
    }

    /**
     * Remove a player by index
     * @param {number} index - Index of player to remove
     * @returns {Object} - Result object with success status and message
     */
    removePlayer(index) {
        if (typeof index !== 'number' || index < 0 || index >= this.players.length) {
            return {
                success: false,
                message: 'Invalid player index'
            };
        }

        const removedPlayer = this.players.splice(index, 1)[0];

        return {
            success: true,
            message: 'Player removed successfully',
            player: removedPlayer
        };
    }

    /**
     * Get all players
     * @returns {Array} - Array of player objects
     */
    getPlayers() {
        return [...this.players]; // Return copy to prevent external modification
    }

    /**
     * Get current player count
     * @returns {number} - Number of players
     */
    getPlayerCount() {
        return this.players.length;
    }

    /**
     * Check if minimum players (2) are present
     * @returns {boolean} - True if at least 2 players
     */
    hasMinimumPlayers() {
        return this.players.length >= 2;
    }

    /**
     * Reset all players
     */
    reset() {
        this.players = [];
        this.nextId = 1;
    }
}

// Export the PlayerSetup class
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = PlayerSetup;
} else {
    // Browser environment
    window.PlayerSetup = PlayerSetup;
}