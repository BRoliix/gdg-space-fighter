import React from 'react';

const Obstacle = ({ x, y }) => {
  return (
    <div 
      className="obstacle"
      style={{ 
        left: `${x}px`,
        top: `${y}px`
      }}
    />
  );
};

export default Obstacle;