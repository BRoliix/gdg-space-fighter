"use client"
import React, { useEffect, useCallback, useState } from 'react';
import { useAtom } from 'jotai';
import { 
  playerPositionAtom, 
  scoreAtom, 
  gameOverAtom, 
  obstaclesAtom, 
  bulletsAtom,
  timerAtom
} from '../store/atom';
import Bullet from './Bullet';
import Spaceship from './Spaceship';
import Obstacle from './Obstacle';
import GameOverMenu from './GameOverMenu';
import CollisionManager from './CollisionManager';
import Timer from './Timer';

const GameBoard = () => {
  const [playerPosition, setPlayerPosition] = useAtom(playerPositionAtom);
  const [score, setScore] = useAtom(scoreAtom);
  const [gameOver, setGameOver] = useAtom(gameOverAtom);
  const [obstacles, setObstacles] = useAtom(obstaclesAtom);
  const [bullets, setBullets] = useAtom(bulletsAtom);
  const [, setTime] = useAtom(timerAtom);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 800,
    height: 600
  });

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

  const handleKeyPress = useCallback((e) => {
    if (gameOver) return;
    
    const MOVE_DISTANCE = containerDimensions.width * 0.025;
    const MAX_POSITION = containerDimensions.width - 80;

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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    
    const gameLoop = setInterval(() => {
      if (!gameOver) {
        setBullets(prev => 
          prev
            .map(bullet => ({ 
              ...bullet, 
              y: bullet.y - containerDimensions.height * 0.017 
            }))
            .filter(bullet => bullet.y > 0)
        );

        setObstacles(prev => {
          const updated = prev
            .map(obstacle => ({
              ...obstacle,
              y: obstacle.y + containerDimensions.height * 0.005
            }))
            .filter(obstacle => obstacle.y < containerDimensions.height);

          if (Math.random() < 0.05) {
            updated.push({
              id: Date.now(),
              x: Math.random() * (containerDimensions.width - 20),
              y: -20
            });
          }
          return updated;
        });
      }
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameLoop);
    };
  }, [gameOver, handleKeyPress, containerDimensions, setBullets, setObstacles]);

  const handleRestart = useCallback(() => {
    setGameOver(false);
    setScore(0);
    setTime(0);
    setObstacles([]);
    setBullets([]);
    setPlayerPosition({ 
      x: containerDimensions.width / 2 - 40, 
      y: 20 
    });
  }, [containerDimensions, setGameOver, setScore, setTime, setObstacles, setBullets, setPlayerPosition]);

  return (
    <div 
      className="game-container"
      style={{
        width: `${containerDimensions.width}px`,
        height: `${containerDimensions.height}px`
      }}
    >
      <Timer gameOver={gameOver} />
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
          id={bullet.id}
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
  );
};

export default GameBoard;
