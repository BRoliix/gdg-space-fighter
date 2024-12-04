import React from 'react';

const Spaceship = ({ position }) => {
  return (
    <div 
      className="spaceship"
      style={{ 
        left: `${position.x}px`,
        bottom: `${position.y}px`
      }}
    >
      <div className="windows"></div>
      <div className="windows"></div>
      <div className="thruster"></div>
      <div className="side-thrusters"></div>
    </div>
  );
};

export default Spaceship;