import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrickEntry from './TrickEntry';

const mockPlayers = [
  { id: '1', name: 'Player 1' },
  { id: '2', name: 'Player 2' }
];

const mockRoundBids = [
  { playerId: '1', bid: 3, tricksTaken: 0, bonusPoints: 0 },
  { playerId: '2', bid: 2, tricksTaken: 0, bonusPoints: 0 }
];

const defaultProps = {
  players: mockPlayers,
  roundBids: mockRoundBids,
  handsInRound: 5,
  onTrickEntryComplete: jest.fn(),
  onUpdateRoundBid: jest.fn()
};

describe('TrickEntry Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows each player\'s bid for reference', () => {
    render(<TrickEntry {...defaultProps} />);
    
    expect(screen.getByText('3')).toBeInTheDocument(); // Player 1's bid
    expect(screen.getByText('2')).toBeInTheDocument(); // Player 2's bid
  });

  test('provides input for tricks taken with proper constraints', () => {
    render(<TrickEntry {...defaultProps} />);
    
    const trickInputs = screen.getAllByDisplayValue('0');
    expect(trickInputs.length).toBeGreaterThan(0);
    
    // Test that input accepts valid values
    const firstTrickInput = trickInputs[0];
    fireEvent.change(firstTrickInput, { target: { value: '3' } });
    expect(defaultProps.onUpdateRoundBid).toHaveBeenCalledWith('1', { tricksTaken: 3 });
  });

  test('provides input for bonus points with default 0', () => {
    render(<TrickEntry {...defaultProps} />);
    
    const bonusInputs = screen.getAllByPlaceholderText('0');
    expect(bonusInputs.length).toBe(2); // One for each player
    
    // Test bonus points input
    fireEvent.change(bonusInputs[0], { target: { value: '10' } });
    expect(defaultProps.onUpdateRoundBid).toHaveBeenCalledWith('1', { bonusPoints: 10 });
  });

  test('validates tricks taken <= handsInRound', () => {
    render(<TrickEntry {...defaultProps} />);
    
    const trickInputs = screen.getAllByDisplayValue('0');
    const firstTrickInput = trickInputs[0];
    
    // Enter value greater than handsInRound
    fireEvent.change(firstTrickInput, { target: { value: '6' } });
    
    expect(screen.getByText('Tricks cannot exceed 5')).toBeInTheDocument();
  });

  test('cannot complete round until all players have trick counts entered', () => {
    // Start with empty trick counts
    const propsWithEmptyTricks = {
      ...defaultProps,
      roundBids: [
        { playerId: '1', bid: 3 },
        { playerId: '2', bid: 2 }
      ]
    };
    
    render(<TrickEntry {...propsWithEmptyTricks} />);
    
    const completeButton = screen.getByText('Complete Round');
    expect(completeButton).toBeDisabled();
    expect(screen.getByText('All players must have trick counts entered.')).toBeInTheDocument();
  });

  test('enables complete button when all criteria are met', () => {
    const propsWithValidData = {
      ...defaultProps,
      roundBids: [
        { playerId: '1', bid: 3, tricksTaken: 2, bonusPoints: 0 },
        { playerId: '2', bid: 2, tricksTaken: 1, bonusPoints: 5 }
      ]
    };
    
    render(<TrickEntry {...propsWithValidData} />);
    
    const completeButton = screen.getByText('Complete Round');
    expect(completeButton).not.toBeDisabled();
  });

  test('calls onTrickEntryComplete when complete button is clicked', () => {
    const propsWithValidData = {
      ...defaultProps,
      roundBids: [
        { playerId: '1', bid: 3, tricksTaken: 2, bonusPoints: 0 },
        { playerId: '2', bid: 2, tricksTaken: 1, bonusPoints: 5 }
      ]
    };
    
    render(<TrickEntry {...propsWithValidData} />);
    
    const completeButton = screen.getByText('Complete Round');
    fireEvent.click(completeButton);
    
    expect(defaultProps.onTrickEntryComplete).toHaveBeenCalled();
  });

  test('prevents negative trick counts', () => {
    render(<TrickEntry {...defaultProps} />);
    
    const trickInputs = screen.getAllByDisplayValue('0');
    const firstTrickInput = trickInputs[0];
    
    fireEvent.change(firstTrickInput, { target: { value: '-1' } });
    
    expect(screen.getByText('Tricks cannot be negative')).toBeInTheDocument();
  });
});