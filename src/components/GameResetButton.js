import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './GameResetButton.css';

const GameResetButton = ({ onReset, disabled = false }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleResetClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmReset = () => {
    setShowConfirmation(false);
    onReset();
  };

  const handleCancelReset = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <button
        className="game-reset-button"
        onClick={handleResetClick}
        disabled={disabled}
        type="button"
        aria-label="Reset Game"
      >
        Reset Game
      </button>

      {showConfirmation && (
        <div className="reset-confirmation-modal" role="dialog" aria-modal="true">
          <div className="reset-confirmation-overlay" onClick={handleCancelReset} />
          <div className="reset-confirmation-content">
            <h3>Confirm Game Reset</h3>
            <p>Are you sure you want to reset the game? This will clear all scores, rounds, and player data.</p>
            <div className="reset-confirmation-actions">
              <button
                className="reset-confirm-button"
                onClick={handleConfirmReset}
                type="button"
              >
                Yes, Reset Game
              </button>
              <button
                className="reset-cancel-button"
                onClick={handleCancelReset}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

GameResetButton.propTypes = {
  onReset: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default GameResetButton;