import React from 'react';
import { render, screen } from '@testing-library/react';
import ScoreBoard from '../ScoreBoard';

const mockPlayers = [
  {
    id: '1',
    name: 'Player 1',
    totalScore: 150,
    roundScores: [50, 75, 25]
  },
  {
    id: '2', 
    name: 'Player 2',
    totalScore: 120,
    roundScores: [40, 60, 20]
  }
];

describe('ScoreBoard', () => {
  test('displays current round and total rounds', () => {
    render(<ScoreBoard players={mockPlayers} currentRound={3} totalRounds={10} />);
    expect(screen.getByText('Round 3 of 10')).toBeInTheDocument();
  });

  test('shows total scores for all players', () => {
    render(<ScoreBoard players={mockPlayers} currentRound={3} />);
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  test('displays round-by-round breakdown', () => {
    render(<ScoreBoard players={mockPlayers} currentRound={3} />);
    expect(screen.getByText('Round 1:')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  test('highlights current leader', () => {
    render(<ScoreBoard players={mockPlayers} currentRound={3} />);
    const leaderElement = screen.getByText('Player 1').closest('.player-score');
    expect(leaderElement).toHaveClass('leader');
    expect(screen.getByText('👑')).toBeInTheDocument();
  });

  test('shows progress bar correctly', () => {
    render(<ScoreBoard players={mockPlayers} currentRound={3} totalRounds={10} />);
    const progressBar = document.querySelector('.progress-fill');
    expect(progressBar).toHaveStyle('width: 30%');
  });
});