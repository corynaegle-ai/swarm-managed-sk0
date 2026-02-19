import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameResetButton from '../GameResetButton';

describe('GameResetButton', () => {
  const mockOnReset = jest.fn();

  beforeEach(() => {
    mockOnReset.mockClear();
  });

  it('renders reset button', () => {
    render(<GameResetButton onReset={mockOnReset} />);
    expect(screen.getByText('Reset Game')).toBeInTheDocument();
  });

  it('shows confirmation dialog when reset button is clicked', () => {
    render(<GameResetButton onReset={mockOnReset} />);
    
    fireEvent.click(screen.getByText('Reset Game'));
    
    expect(screen.getByText('Confirm Game Reset')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to reset the game/)).toBeInTheDocument();
  });

  it('calls onReset when confirmation is confirmed', async () => {
    render(<GameResetButton onReset={mockOnReset} />);
    
    fireEvent.click(screen.getByText('Reset Game'));
    fireEvent.click(screen.getByText('Yes, Reset Game'));
    
    await waitFor(() => {
      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });
  });

  it('closes confirmation dialog when cancelled', () => {
    render(<GameResetButton onReset={mockOnReset} />);
    
    fireEvent.click(screen.getByText('Reset Game'));
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(screen.queryByText('Confirm Game Reset')).not.toBeInTheDocument();
    expect(mockOnReset).not.toHaveBeenCalled();
  });

  it('closes confirmation dialog when overlay is clicked', () => {
    render(<GameResetButton onReset={mockOnReset} />);
    
    fireEvent.click(screen.getByText('Reset Game'));
    
    const overlay = document.querySelector('.reset-confirmation-overlay');
    fireEvent.click(overlay);
    
    expect(screen.queryByText('Confirm Game Reset')).not.toBeInTheDocument();
    expect(mockOnReset).not.toHaveBeenCalled();
  });

  it('disables button when disabled prop is true', () => {
    render(<GameResetButton onReset={mockOnReset} disabled={true} />);
    
    const button = screen.getByText('Reset Game');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(screen.queryByText('Confirm Game Reset')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<GameResetButton onReset={mockOnReset} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Reset Game');
    
    fireEvent.click(button);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});