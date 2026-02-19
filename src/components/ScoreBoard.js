import React from 'react';
import './ScoreBoard.css';

const ScoreBoard = ({ players, currentRound, totalRounds = 10 }) => {
  // Find current leader
  const leader = players.reduce((prev, current) => 
    (prev.totalScore > current.totalScore) ? prev : current
  );

  return (
    <div className="scoreboard">
      <div className="game-progress">
        <h2>Round {currentRound} of {totalRounds}</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentRound / totalRounds) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="scores-container">
        <h3>Scores</h3>
        {players.map((player, index) => (
          <div 
            key={player.id || index} 
            className={`player-score ${player.id === leader.id ? 'leader' : ''}`}
          >
            <div className="player-info">
              <span className="player-name">
                {player.name}
                {player.id === leader.id && <span className="leader-badge">👑</span>}
              </span>
              <span className="total-score">{player.totalScore}</span>
            </div>
            
            <div className="round-breakdown">
              <h4>Round Scores:</h4>
              <div className="round-scores">
                {player.roundScores && player.roundScores.map((score, roundIndex) => (
                  <div key={roundIndex} className="round-score">
                    <span>Round {roundIndex + 1}:</span>
                    <span>{score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBoard;