"use client"
import React, { useEffect, useCallback, useState } from 'react';
import { useAtom } from 'jotai';
import { 
  playerPositionAtom, 
  scoreAtom, 
  gameOverAtom, 
  obstaclesAtom, 
  bulletsAtom 
} from '../store/atom';
import Bullet from './Bullet';
import Spaceship from './Spaceship';
import Obstacle from './Obstacle';
import GameOverMenu from './GameOverMenu';
import CollisionManager from './CollisionManager';

const GameBoard = () => {
  const [playerPosition, setPlayerPosition] = useAtom(playerPositionAtom);
  const [score, setScore] = useAtom(scoreAtom);
  const [gameOver, setGameOver] = useAtom(gameOverAtom);
  const [obstacles, setObstacles] = useAtom(obstaclesAtom);
  const [bullets, setBullets] = useAtom(bulletsAtom);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 800,
    height: 600
  });

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(window.innerWidth * 0.95, 800);
      const height = Math.min(window.innerHeight * 0.9, 600);
      setContainerDimensions({ width, height });
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle keyboard controls
  const handleKeyPress = useCallback((e) => {
    if (gameOver) return;
    
    const MOVE_DISTANCE = containerDimensions.width * 0.025; // Responsive movement
    const MAX_POSITION = containerDimensions.width - 80; // Account for spaceship width

    switch(e.key) {
      case 'ArrowLeft':
        setPlayerPosition(prev => ({
          ...prev,
          x: Math.max(0, prev.x - MOVE_DISTANCE)
        }));
        break;
      case 'ArrowRight':
        setPlayerPosition(prev => ({
          ...prev,
          x: Math.min(MAX_POSITION, prev.x + MOVE_DISTANCE)
        }));
        break;
      case ' ':
        setBullets(prev => [...prev, {
          id: Date.now(),
          x: playerPosition.x + containerDimensions.width * 0.029,
          y: containerDimensions.height * 0.88
        }]);
        break;
      default:
        break;
    }
  }, [playerPosition, gameOver, containerDimensions, setPlayerPosition, setBullets]);

  // Handle touch controls
  const handleTouch = useCallback((direction) => {
    if (gameOver) return;
    
    const MOVE_DISTANCE = containerDimensions.width * 0.025;
    const MAX_POSITION = containerDimensions.width - 80;

    switch(direction) {
      case 'left':
        setPlayerPosition(prev => ({
          ...prev,
          x: Math.max(0, prev.x - MOVE_DISTANCE)
        }));
        break;
      case 'right':
        setPlayerPosition(prev => ({
          ...prev,
          x: Math.min(MAX_POSITION, prev.x + MOVE_DISTANCE)
        }));
        break;
      case 'shoot':
        setBullets(prev => [...prev, {
          id: Date.now(),
          x: playerPosition.x + containerDimensions.width * 0.029,
          y: containerDimensions.height * 0.88
        }]);
        break;
    }
  }, [gameOver, containerDimensions, playerPosition.x, setPlayerPosition, setBullets]);

  // Game loop
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    
    const gameLoop = setInterval(() => {
      if (!gameOver) {
        // Move bullets
        setBullets(prev => 
          prev
            .map(bullet => ({ 
              ...bullet, 
              y: bullet.y - containerDimensions.height * 0.017 
            }))
            .filter(bullet => bullet.y > 0)
        );

        // Move obstacles
        setObstacles(prev => {
          const updated = prev
            .map(obstacle => ({
              ...obstacle,
              y: obstacle.y + containerDimensions.height * 0.005
            }))
            .filter(obstacle => obstacle.y < containerDimensions.height);

          // Spawn new obstacles
          if (Math.random() < 0.05) {
            updated.push({
              id: Date.now(),
              x: Math.random() * (containerDimensions.width - 20),
              y: -20
            });
          }
          return updated;
        });

        setScore(prev => prev + 1);
      }
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameLoop);
    };
  }, [gameOver, handleKeyPress, containerDimensions, setBullets, setObstacles, setScore]);

  // Reset game function
  const handleRestart = useCallback(() => {
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    setBullets([]);
    setPlayerPosition({ 
      x: containerDimensions.width / 2 - 40, 
      y: 20 
    });
  }, [containerDimensions, setGameOver, setScore, setObstacles, setBullets, setPlayerPosition]);

  return (
    <>
      <div 
        className="game-container"
        style={{
          width: `${containerDimensions.width}px`,
          height: `${containerDimensions.height}px`
        }}
      >
        <div className="score-display">Score: {score}</div>
        
        {obstacles.map(obstacle => (
          <Obstacle 
            key={obstacle.id} 
            x={obstacle.x} 
            y={obstacle.y} 
          />
        ))}
        
        {bullets.map(bullet => (
          <Bullet 
            key={bullet.id} 
            x={bullet.x} 
            y={bullet.y} 
          />
        ))}
        
        <Spaceship position={playerPosition} />
        
        <CollisionManager
          obstacles={obstacles}
          playerPosition={playerPosition}
          setGameOver={setGameOver}
          gameOver={gameOver}
          containerDimensions={containerDimensions}
        />
        
        {gameOver && (
          <GameOverMenu 
            score={score} 
            onRestart={handleRestart}
          />
        )}
      </div>

      {/* Mobile Touch Controls */}
      <div className="mobile-controls">
        <button 
          className="control-button"
          onTouchStart={() => handleTouch('left')}
          onTouchEnd={(e) => e.preventDefault()}
          aria-label="Move Left"
        >
          ←
        </button>
        <button 
          className="control-button"
          onTouchStart={() => handleTouch('shoot')}
          onTouchEnd={(e) => e.preventDefault()}
          aria-label="Shoot"
        >
          🔫
        </button>
        <button 
          className="control-button"
          onTouchStart={() => handleTouch('right')}
          onTouchEnd={(e) => e.preventDefault()}
          aria-label="Move Right"
        >
          →
        </button>
      </div>
    </>
  );
};

export default GameBoard;