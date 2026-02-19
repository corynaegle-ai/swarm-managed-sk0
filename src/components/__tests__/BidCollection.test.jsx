import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BidCollection from '../BidCollection';

const mockProps = {
  gameId: 'game-123',
  roundNumber: 3,
  handsInRound: 4,
  players: [
    { id: 'player1', name: 'Alice' },
    { id: 'player2', name: 'Bob' },
    { id: 'player3', name: 'Charlie' }
  ],
  onBidsCollected: jest.fn()
};

describe('BidCollection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays current round number and hands available', () => {
    render(<BidCollection {...mockProps} />);
    
    expect(screen.getByText('Round 3 - Bid Collection')).toBeInTheDocument();
    expect(screen.getByText('Hands Available: 4')).toBeInTheDocument();
  });

  test('displays input field for each player', () => {
    render(<BidCollection {...mockProps} />);
    
    mockProps.players.forEach(player => {
      expect(screen.getByLabelText(`${player.name} - Bid (0-4)`)).toBeInTheDocument();
    });
  });

  test('validates bid does not exceed handsInRound', async () => {
    render(<BidCollection {...mockProps} />);
    
    const aliceInput = screen.getByLabelText('Alice - Bid (0-4)');
    fireEvent.change(aliceInput, { target: { value: '5' } });
    
    await waitFor(() => {
      expect(screen.getByText('Bid cannot exceed 4 hands')).toBeInTheDocument();
    });
  });

  test('validates negative bids', async () => {
    render(<BidCollection {...mockProps} />);
    
    const aliceInput = screen.getByLabelText('Alice - Bid (0-4)');
    fireEvent.change(aliceInput, { target: { value: '-1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Bid must be a non-negative number')).toBeInTheDocument();
    });
  });

  test('submit button disabled until all bids collected', async () => {
    render(<BidCollection {...mockProps} />);
    
    const submitButton = screen.getByText('Confirm All Bids');
    expect(submitButton).toBeDisabled();
    
    // Fill in all bids
    const aliceInput = screen.getByLabelText('Alice - Bid (0-4)');
    const bobInput = screen.getByLabelText('Bob - Bid (0-4)');
    const charlieInput = screen.getByLabelText('Charlie - Bid (0-4)');
    
    fireEvent.change(aliceInput, { target: { value: '2' } });
    fireEvent.change(bobInput, { target: { value: '1' } });
    fireEvent.change(charlieInput, { target: { value: '1' } });
    
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  test('shows current bid total vs hands available', async () => {
    render(<BidCollection {...mockProps} />);
    
    const aliceInput = screen.getByLabelText('Alice - Bid (0-4)');
    fireEvent.change(aliceInput, { target: { value: '2' } });
    
    await waitFor(() => {
      expect(screen.getByText('2 / 4')).toBeInTheDocument();
    });
  });

  test('calls onBidsCollected with correct data', async () => {
    render(<BidCollection {...mockProps} />);
    
    // Fill in all bids
    fireEvent.change(screen.getByLabelText('Alice - Bid (0-4)'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Bob - Bid (0-4)'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Charlie - Bid (0-4)'), { target: { value: '1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Confirm All Bids')).toBeEnabled();
    });
    
    fireEvent.click(screen.getByText('Confirm All Bids'));
    
    await waitFor(() => {
      expect(mockProps.onBidsCollected).toHaveBeenCalledWith([
        { gameId: 'game-123', roundNumber: 3, playerId: 'player1', bid: 2 },
        { gameId: 'game-123', roundNumber: 3, playerId: 'player2', bid: 1 },
        { gameId: 'game-123', roundNumber: 3, playerId: 'player3', bid: 1 }
      ]);
    });
  });
});