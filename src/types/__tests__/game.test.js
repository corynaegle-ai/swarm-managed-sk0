import { RoundBid, BidValidator } from '../game';

describe('RoundBid', () => {
  test('creates valid RoundBid instance', () => {
    const bid = new RoundBid('game-123', 3, 'player1', 2);
    
    expect(bid.gameId).toBe('game-123');
    expect(bid.roundNumber).toBe(3);
    expect(bid.playerId).toBe('player1');
    expect(bid.bid).toBe(2);
    expect(bid.createdAt).toBeInstanceOf(Date);
  });

  test('validates required fields', () => {
    expect(() => new RoundBid('', 1, 'player1', 0)).toThrow('gameId is required');
    expect(() => new RoundBid('game-123', 0, 'player1', 0)).toThrow('Invalid round number');
    expect(() => new RoundBid('game-123', 1, '', 0)).toThrow('playerId is required');
    expect(() => new RoundBid('game-123', 1, 'player1', -1)).toThrow('Bid cannot be negative');
    expect(() => new RoundBid('game-123', 1, 'player1', 1.5)).toThrow('Bid must be an integer');
  });

  test('validates bid against round hands', () => {
    const bid = new RoundBid('game-123', 3, 'player1', 4);
    
    expect(bid.isValidForRound(4)).toBe(true);
    expect(bid.isValidForRound(3)).toBe(false);
  });

  test('converts to JSON correctly', () => {
    const bid = new RoundBid('game-123', 3, 'player1', 2);
    const json = bid.toJSON();
    
    expect(json).toEqual({
      gameId: 'game-123',
      roundNumber: 3,
      playerId: 'player1',
      bid: 2,
      createdAt: bid.createdAt
    });
  });
});

describe('BidValidator', () => {
  test('validates individual bids correctly', () => {
    expect(BidValidator.validateBid(2, 4)).toEqual({ valid: true });
    expect(BidValidator.validateBid(5, 4)).toEqual({
      valid: false,
      error: 'Bid cannot exceed 4 hands'
    });
    expect(BidValidator.validateBid(-1, 4)).toEqual({
      valid: false,
      error: 'Bid cannot be negative'
    });
    expect(BidValidator.validateBid(1.5, 4)).toEqual({
      valid: false,
      error: 'Bid must be a whole number'
    });
  });

  test('validates round bids correctly', () => {
    const bids = [
      new RoundBid('game-123', 3, 'player1', 2),
      new RoundBid('game-123', 3, 'player2', 1),
      new RoundBid('game-123', 3, 'player3', 1)
    ];
    
    const result = BidValidator.validateRoundBids(bids, 4);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.totalBids).toBe(4);
  });

  test('catches invalid round bids', () => {
    const bids = [
      new RoundBid('game-123', 3, 'player1', 5), // Invalid - exceeds hands
      new RoundBid('game-123', 3, 'player2', 1)
    ];
    
    const result = BidValidator.validateRoundBids(bids, 4);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Player player1: Bid cannot exceed 4 hands');
    expect(result.totalBids).toBe(6);
  });
});