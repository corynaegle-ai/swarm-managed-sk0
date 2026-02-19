import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BidCollection = ({ 
  gameId, 
  roundNumber, 
  handsInRound, 
  players, 
  onBidsCollected 
}) => {
  const [bids, setBids] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize bids object
  useEffect(() => {
    const initialBids = {};
    players.forEach(player => {
      initialBids[player.id] = '';
    });
    setBids(initialBids);
  }, [players]);

  // Calculate total bids
  const totalBids = Object.values(bids)
    .filter(bid => bid !== '')
    .reduce((sum, bid) => sum + parseInt(bid), 0);

  // Validate individual bid
  const validateBid = (playerId, bidValue) => {
    const bid = parseInt(bidValue);
    const newErrors = { ...errors };

    if (bidValue === '') {
      delete newErrors[playerId];
    } else if (isNaN(bid) || bid < 0) {
      newErrors[playerId] = 'Bid must be a non-negative number';
    } else if (bid > handsInRound) {
      newErrors[playerId] = `Bid cannot exceed ${handsInRound} hands`;
    } else {
      delete newErrors[playerId];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle bid input change
  const handleBidChange = (playerId, value) => {
    setBids(prev => ({ ...prev, [playerId]: value }));
    validateBid(playerId, value);
  };

  // Check if all bids are collected and valid
  const allBidsCollected = () => {
    return players.every(player => {
      const bid = bids[player.id];
      return bid !== '' && !errors[player.id] && parseInt(bid) >= 0;
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!allBidsCollected()) return;

    setIsSubmitting(true);
    try {
      const roundBids = players.map(player => ({
        gameId,
        roundNumber,
        playerId: player.id,
        bid: parseInt(bids[player.id])
      }));

      await onBidsCollected(roundBids);
    } catch (error) {
      console.error('Error submitting bids:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Round {roundNumber} - Bid Collection
        </CardTitle>
        <div className="text-center text-lg font-medium text-muted-foreground">
          Hands Available: {handsInRound}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Player bid inputs */}
        {players.map((player) => (
          <div key={player.id} className="space-y-2">
            <Label htmlFor={`bid-${player.id}`} className="text-sm font-medium">
              {player.name} - Bid (0-{handsInRound})
            </Label>
            <Input
              id={`bid-${player.id}`}
              type="number"
              min="0"
              max={handsInRound}
              value={bids[player.id] || ''}
              onChange={(e) => handleBidChange(player.id, e.target.value)}
              className={errors[player.id] ? 'border-red-500' : ''}
              placeholder="Enter bid"
            />
            {errors[player.id] && (
              <p className="text-sm text-red-500">{errors[player.id]}</p>
            )}
          </div>
        ))}

        {/* Bid validation summary */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Bids:</span>
            <span className={`font-bold ${
              totalBids === handsInRound ? 'text-green-600' : 
              totalBids > handsInRound ? 'text-red-600' : 
              'text-orange-600'
            }`}>
              {totalBids} / {handsInRound}
            </span>
          </div>
          {totalBids !== handsInRound && (
            <Alert className="mt-2">
              <AlertDescription>
                {totalBids > handsInRound 
                  ? `Bids exceed available hands by ${totalBids - handsInRound}`
                  : totalBids === 0
                  ? 'No bids entered yet'
                  : `${handsInRound - totalBids} hands remaining`
                }
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Submit button */}
        <Button
          onClick={handleSubmit}
          disabled={!allBidsCollected() || isSubmitting}
          className="w-full mt-6"
          size="lg"
        >
          {isSubmitting ? 'Collecting Bids...' : 'Confirm All Bids'}
        </Button>

        {!allBidsCollected() && (
          <p className="text-sm text-muted-foreground text-center">
            All players must submit valid bids to continue
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BidCollection;