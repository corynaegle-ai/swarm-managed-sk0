/**
 * PlayerSetup class handles adding and managing players before game starts
 */
class PlayerSetup {
  constructor() {
    this.players = [];
    this.minPlayers = 2;
    this.maxPlayers = 8;
  }

  /**
   * Add a player with given name
   * @param {string} name - Player name
   * @returns {boolean} - Success status
   */
  addPlayer(name) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('Player name is required and must be a non-empty string');
    }

    if (this.players.length >= this.maxPlayers) {
      throw new Error(`Cannot add more than ${this.maxPlayers} players`);
    }

    const trimmedName = name.trim();
    
    // Check for duplicate names
    if (this.players.some(player => player.name === trimmedName)) {
      throw new Error('Player name must be unique');
    }

    const player = {
      name: trimmedName,
      totalScore: 0
    };

    this.players.push(player);
    return true;
  }

  /**
   * Remove a player by index
   * @param {number} index - Player index to remove
   */
  removePlayer(index) {
    if (index >= 0 && index < this.players.length) {
      this.players.splice(index, 1);
    }
  }

  /**
   * Get all players
   * @returns {Array} - Array of player objects
   */
  getPlayers() {
    return [...this.players];
  }

  /**
   * Get player count
   * @returns {number} - Number of players
   */
  getPlayerCount() {
    return this.players.length;
  }

  /**
   * Validate if game can start with current player count
   * @returns {boolean} - Whether game can start
   */
  canStartGame() {
    return this.players.length >= this.minPlayers && this.players.length <= this.maxPlayers;
  }

  /**
   * Get validation message for current state
   * @returns {string} - Validation message
   */
  getValidationMessage() {
    const count = this.players.length;
    
    if (count < this.minPlayers) {
      return `Need at least ${this.minPlayers} players to start (currently have ${count})`;  
    }
    
    if (count > this.maxPlayers) {
      return `Too many players! Maximum is ${this.maxPlayers} (currently have ${count})`;
    }
    
    return `Ready to start with ${count} players`;
  }

  /**
   * Clear all players
   */
  clearPlayers() {
    this.players = [];
  }
}

module.exports = PlayerSetup;