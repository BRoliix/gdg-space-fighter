// Bullet.jsx
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { bulletsAtom, obstaclesAtom, scoreAtom } from '../store/atom';

const Bullet = ({ x, y, id }) => {
  const [, setObstacles] = useAtom(obstaclesAtom);
  const [, setBullets] = useAtom(bulletsAtom);
  const [, setScore] = useAtom(scoreAtom);

  useEffect(() => {
    const checkBulletCollision = () => {
      setObstacles(prevObstacles => 
        prevObstacles.filter(obstacle => {
          const collision = 
            x < obstacle.x + 20 &&
            x + 4 > obstacle.x &&
            y < obstacle.y + 20 &&
            y + 10 > obstacle.y;
          
          if (collision) {
            setBullets(prev => prev.filter(bullet => bullet.id !== id));
            setScore(prev => prev + 10);
            return false;
          }
          return true;
        })
      );
    };

    const collisionInterval = setInterval(checkBulletCollision, 16);
    return () => clearInterval(collisionInterval);
  }, [x, y, id, setBullets, setObstacles, setScore]);

  return (
    <div 
      className="bullet"
      style={{ 
        left: `${x}px`,
        top: `${y}px`
      }}
    />
  );
};

export default Bullet;
