/**
 * PlayerSetup class for managing player list in the game
 * Handles adding/removing players with validation
 */
class PlayerSetup {
  constructor() {
    this.players = [];
    this.nextId = 1;
  }

  /**
   * Add a new player to the game
   * @param {string} name - Player name
   * @returns {boolean} - Success status
   * @throws {Error} - If validation fails
   */
  addPlayer(name) {
    // Validate name is not empty
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('Player name cannot be empty');
    }

    const trimmedName = name.trim();

    // Check for duplicate names (case-insensitive)
    if (this.players.some(player => player.name.toLowerCase() === trimmedName.toLowerCase())) {
      throw new Error('Player name must be unique');
    }

    // Check player count limit
    if (this.players.length >= 8) {
      throw new Error('Maximum of 8 players allowed');
    }

    // Create new player object
    const newPlayer = {
      id: Date.now() + this.nextId++, // Ensure uniqueness
      name: trimmedName,
      totalScore: 0
    };

    this.players.push(newPlayer);
    return true;
  }

  /**
   * Remove a player by index
   * @param {number} index - Player index to remove
   * @returns {boolean} - Success status
   * @throws {Error} - If index is invalid
   */
  removePlayer(index) {
    if (typeof index !== 'number' || index < 0 || index >= this.players.length) {
      throw new Error('Invalid player index');
    }

    this.players.splice(index, 1);
    return true;
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
   * Check if minimum players requirement is met
   * @returns {boolean} - True if at least 2 players
   */
  hasMinimumPlayers() {
    return this.players.length >= 2;
  }

  /**
   * Clear all players
   */
  clearPlayers() {
    this.players = [];
  }
}

// Export the PlayerSetup class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PlayerSetup;
} else {
  window.PlayerSetup = PlayerSetup;
}