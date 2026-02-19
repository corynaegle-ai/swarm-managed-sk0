import { useState, useCallback } from 'react';
import { RoundBid, BidValidator } from '../types/game';

/**
 * Custom hook for managing bid collection logic
 */
export const useBidCollection = (gameId, roundNumber, handsInRound) => {
  const [bids, setBids] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Add or update a bid for a player
   */
  const setBid = useCallback((playerId, bidValue) => {
    try {
      const bid = new RoundBid(gameId, roundNumber, playerId, bidValue);
      
      if (!bid.isValidForRound(handsInRound)) {
        throw new Error(`Bid ${bidValue} exceeds maximum hands ${handsInRound}`);
      }

      setBids(prev => new Map(prev.set(playerId, bid)));
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [gameId, roundNumber, handsInRound]);

  /**
   * Remove a bid for a player
   */
  const removeBid = useCallback((playerId) => {
    setBids(prev => {
      const newBids = new Map(prev);
      newBids.delete(playerId);
      return newBids;
    });
  }, []);

  /**
   * Get bid for a specific player
   */
  const getBid = useCallback((playerId) => {
    return bids.get(playerId);
  }, [bids]);

  /**
   * Get all bids as an array
   */
  const getAllBids = useCallback(() => {
    return Array.from(bids.values());
  }, [bids]);

  /**
   * Check if all players have submitted bids
   */
  const allBidsCollected = useCallback((playerIds) => {
    return playerIds.every(playerId => bids.has(playerId));
  }, [bids]);

  /**
   * Validate all current bids
   */
  const validateAllBids = useCallback(() => {
    const allBids = getAllBids();
    return BidValidator.validateRoundBids(allBids, handsInRound);
  }, [getAllBids, handsInRound]);

  /**
   * Get total of all bids
   */
  const getTotalBids = useCallback(() => {
    return getAllBids().reduce((sum, bid) => sum + bid.bid, 0);
  }, [getAllBids]);

  /**
   * Submit all bids (placeholder for actual API call)
   */
  const submitBids = useCallback(async (onSubmit) => {
    setIsLoading(true);
    setError(null);

    try {
      const allBids = getAllBids();
      const validation = validateAllBids();
      
      if (!validation.valid) {
        throw new Error(`Invalid bids: ${validation.errors.join(', ')}`);
      }

      await onSubmit(allBids.map(bid => bid.toJSON()));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [getAllBids, validateAllBids]);

  /**
   * Reset all bids
   */
  const resetBids = useCallback(() => {
    setBids(new Map());
    setError(null);
  }, []);

  return {
    setBid,
    removeBid,
    getBid,
    getAllBids,
    allBidsCollected,
    validateAllBids,
    getTotalBids,
    submitBids,
    resetBids,
    isLoading,
    error,
    bidCount: bids.size
  };
};