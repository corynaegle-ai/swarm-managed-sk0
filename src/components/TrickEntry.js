import React, { useState, useEffect } from 'react';
import './TrickEntry.css';

const TrickEntry = ({ 
  players, 
  roundBids, 
  handsInRound, 
  onTrickEntryComplete,
  onUpdateRoundBid 
}) => {
  const [trickCounts, setTrickCounts] = useState({});
  const [bonusPoints, setBonusPoints] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Initialize state with existing data
    const initialTricks = {};
    const initialBonus = {};
    
    roundBids.forEach(bid => {
      initialTricks[bid.playerId] = bid.tricksTaken || 0;
      initialBonus[bid.playerId] = bid.bonusPoints || 0;
    });
    
    setTrickCounts(initialTricks);
    setBonusPoints(initialBonus);
  }, [roundBids]);

  const handleTrickCountChange = (playerId, value) => {
    const numValue = parseInt(value) || 0;
    const newErrors = { ...errors };
    
    // Validate tricks taken <= handsInRound
    if (numValue > handsInRound) {
      newErrors[playerId] = `Tricks cannot exceed ${handsInRound}`;
    } else if (numValue < 0) {
      newErrors[playerId] = 'Tricks cannot be negative';
    } else {
      delete newErrors[playerId];
    }
    
    setErrors(newErrors);
    setTrickCounts(prev => ({ ...prev, [playerId]: numValue }));
    
    // Update the round bid immediately
    onUpdateRoundBid(playerId, { tricksTaken: numValue });
  };

  const handleBonusPointsChange = (playerId, value) => {
    const numValue = parseInt(value) || 0;
    setBonusPoints(prev => ({ ...prev, [playerId]: numValue }));
    
    // Update the round bid immediately
    onUpdateRoundBid(playerId, { bonusPoints: numValue });
  };

  const canCompleteRound = () => {
    // Check if all players have trick counts entered
    const allTricksEntered = players.every(player => {
      const tricks = trickCounts[player.id];
      return tricks !== undefined && tricks >= 0;
    });
    
    // Check if there are any validation errors
    const hasErrors = Object.keys(errors).length > 0;
    
    return allTricksEntered && !hasErrors;
  };

  const handleCompleteRound = () => {
    if (canCompleteRound()) {
      onTrickEntryComplete();
    }
  };

  return (
    <div className="trick-entry-container">
      <h3>Enter Tricks Taken and Bonus Points</h3>
      
      <div className="trick-entry-grid">
        <div className="header-row">
          <span>Player</span>
          <span>Bid</span>
          <span>Tricks Taken</span>
          <span>Bonus Points</span>
        </div>
        
        {players.map(player => {
          const roundBid = roundBids.find(bid => bid.playerId === player.id);
          const playerError = errors[player.id];
          
          return (
            <div key={player.id} className={`player-row ${playerError ? 'error' : ''}`}>
              <span className="player-name">{player.name}</span>
              <span className="bid-display">{roundBid?.bid || 0}</span>
              
              <div className="input-container">
                <input
                  type="number"
                  min="0"
                  max={handsInRound}
                  value={trickCounts[player.id] || 0}
                  onChange={(e) => handleTrickCountChange(player.id, e.target.value)}
                  className={playerError ? 'error-input' : ''}
                />
                {playerError && (
                  <div className="error-message">{playerError}</div>
                )}
              </div>
              
              <div className="input-container">
                <input
                  type="number"
                  value={bonusPoints[player.id] || 0}
                  onChange={(e) => handleBonusPointsChange(player.id, e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="round-controls">
        <button 
          className={`complete-round-btn ${canCompleteRound() ? 'enabled' : 'disabled'}`}
          onClick={handleCompleteRound}
          disabled={!canCompleteRound()}
        >
          Complete Round
        </button>
        
        {!canCompleteRound() && (
          <div className="completion-requirements">
            {Object.keys(errors).length > 0 && (
              <p className="error-text">Please fix validation errors before completing.</p>
            )}
            {!players.every(p => trickCounts[p.id] >= 0) && (
              <p className="warning-text">All players must have trick counts entered.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrickEntry;