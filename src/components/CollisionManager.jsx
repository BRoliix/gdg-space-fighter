// CollisionManager.jsx
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { collisionStateAtom } from '../store/atom';

const CollisionManager = ({ 
  obstacles, 
  playerPosition, 
  setGameOver,
  gameOver 
}) => {
  const [isColliding, setIsColliding] = useAtom(collisionStateAtom);

  useEffect(() => {
    if (!gameOver) {
      setIsColliding(false);
    }
  }, [gameOver, setIsColliding]);

  useEffect(() => {
    const checkCollisions = () => {
      obstacles.forEach(obstacle => {
        const spaceshipWidth = 50;
        const spaceshipHeight = 50;
        
        const playerCollision = 
          obstacle.x < (playerPosition.x + spaceshipWidth) &&
          (obstacle.x + 20) > playerPosition.x &&
          obstacle.y > (600 - spaceshipHeight - 20) &&
          (obstacle.y + 20) > (600 - spaceshipHeight);
        
        if (playerCollision && !isColliding) {
          setIsColliding(true);
          setGameOver(true);
        }
      });
    };

    const collisionInterval = setInterval(checkCollisions, 16);
    return () => clearInterval(collisionInterval);
  }, [obstacles, playerPosition, isColliding, setGameOver, setIsColliding]);

  return null;
};

export default CollisionManager;
