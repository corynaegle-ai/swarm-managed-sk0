class Round {
  constructor(number) {
    this.number = number;
    this.status = 'bidding';
    this.handsInRound = number;
    this.handsCompleted = 0;
    this.players = [];
    this.bids = new Map();
    this.tricks = [];
  }

  // Get required hands for this round (round 1 = 1 hand, round 2 = 2 hands, etc.)
  getRequiredHands() {
    return this.number;
  }

  // Transition to playing status
  startPlaying() {
    if (this.status !== 'bidding') {
      throw new Error(`Cannot start playing from ${this.status} status`);
    }
    this.status = 'playing';
  }

  // Complete a hand in the round
  completeHand() {
    if (this.status !== 'playing') {
      throw new Error(`Cannot complete hand when status is ${this.status}`);
    }
    
    this.handsCompleted++;
    
    // Check if all hands for this round are completed
    if (this.handsCompleted >= this.handsInRound) {
      this.status = 'completed';
    }
  }

  // Check if round is completed
  isCompleted() {
    return this.status === 'completed';
  }

  // Get current status
  getStatus() {
    return this.status;
  }

  // Add bid for a player
  addBid(playerId, bid) {
    if (this.status !== 'bidding') {
      throw new Error(`Cannot add bid when status is ${this.status}`);
    }
    this.bids.set(playerId, bid);
  }

  // Check if all bids are in
  allBidsComplete() {
    return this.bids.size === this.players.length;
  }
}

module.exports = Round;