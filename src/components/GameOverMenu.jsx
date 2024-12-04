import React from 'react';

const GameOverMenu = ({ score, onRestart }) => {
  return (
    <div className="game-over">
      <h2>Game Over!</h2>
      <p>Final Score: {score}</p>
      <button className="button" onClick={onRestart}>
        Play Again
      </button>
    </div>
  );
};

export default GameOverMenu;