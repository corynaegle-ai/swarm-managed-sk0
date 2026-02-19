import { renderHook, act } from '@testing-library/react';
import { useBidCollection } from '../useBidCollection';

describe('useBidCollection', () => {
  const gameId = 'game-123';
  const roundNumber = 3;
  const handsInRound = 4;
  const playerIds = ['player1', 'player2', 'player3'];

  test('initializes with empty state', () => {
    const { result } = renderHook(() => 
      useBidCollection(gameId, roundNumber, handsInRound)
    );

    expect(result.current.bidCount).toBe(0);
    expect(result.current.getTotalBids()).toBe(0);
    expect(result.current.allBidsCollected(playerIds)).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test('sets and gets bids correctly', () => {
    const { result } = renderHook(() => 
      useBidCollection(gameId, roundNumber, handsInRound)
    );

    act(() => {
      const setBidResult = result.current.setBid('player1', 2);
      expect(setBidResult.success).toBe(true);
    });

    expect(result.current.bidCount).toBe(1);
    expect(result.current.getBid('player1').bid).toBe(2);
    expect(result.current.getTotalBids()).toBe(2);
  });

  test('validates bids against handsInRound', () => {
    const { result } = renderHook(() => 
      useBidCollection(gameId, roundNumber, handsInRound)
    );

    act(() => {
      const setBidResult = result.current.setBid('player1', 5); // Exceeds handsInRound
      expect(setBidResult.success).toBe(false);
      expect(setBidResult.error).toContain('exceeds maximum hands');
    });

    expect(result.current.bidCount).toBe(0);
    expect(result.current.error).toContain('exceeds maximum hands');
  });

  test('removes bids correctly', () => {
    const { result } = renderHook(() => 
      useBidCollection(gameId, roundNumber, handsInRound)
    );

    act(() => {
      result.current.setBid('player1', 2);
      result.current.setBid('player2', 1);
    });

    expect(result.current.bidCount).toBe(2);

    act(() => {
      result.current.removeBid('player1');
    });

    expect(result.current.bidCount).toBe(1);
    expect(result.current.getBid('player1')).toBeUndefined();
    expect(result.current.getBid('player2').bid).toBe(1);
  });

  test('checks if all bids collected', () => {
    const { result } = renderHook(() => 
      useBidCollection(gameId, roundNumber, handsInRound)
    );

    expect(result.current.allBidsCollected(playerIds)).toBe(false);

    act(() => {
      result.current.setBid('player1', 2);
      result.current.setBid('player2', 1);
    });

    expect(result.current.allBidsCollected(playerIds)).toBe(false);

    act(() => {
      result.current.setBid('player3', 1);
    });

    expect(result.current.allBidsCollected(playerIds)).toBe(true);
  });

  test('validates all bids', () => {
    const { result } = renderHook(() => 
      useBidCollection(gameId, roundNumber, handsInRound)
    );

    act(() => {
      result.current.setBid('player1', 2);
      result.current.setBid('player2', 1);
      result.current.setBid('player3', 1);
    });

    const validation = result.current.validateAllBids();
    expect(validation.valid).toBe(true);
    expect(validation.totalBids).toBe(4);
  });

  test('resets bids correctly', () => {
    const { result } = renderHook(() => 
      useBidCollection(gameId, roundNumber, handsInRound)
    );

    act(() => {
      result.current.setBid('player1', 2);
      result.current.setBid('player2', 1);
    });

    expect(result.current.bidCount).toBe(2);

    act(() => {
      result.current.resetBids();
    });

    expect(result.current.bidCount).toBe(0);
    expect(result.current.error).toBe(null);
  });
});