"use client"
import React, { useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { playerPositionAtom, scoreAtom, gameOverAtom, obstaclesAtom, bulletsAtom } from '../store/atom';
import Bullet from './Bullet';
import Spaceship from './Spaceship';
import Obstacle from './Obstacle';
import GameOverMenu from './GameOverMenu';
import CollisionManager from './CollisionManager';
import '../styles/App.css';

const GameBoard = () => {
  const [playerPosition, setPlayerPosition] = useAtom(playerPositionAtom);
  const [score, setScore] = useAtom(scoreAtom);
  const [gameOver, setGameOver] = useAtom(gameOverAtom);
  const [obstacles, setObstacles] = useAtom(obstaclesAtom);
  const [bullets, setBullets] = useAtom(bulletsAtom);

  const handleKeyPress = useCallback((e) => {
    if (gameOver) return;
    
    const MOVE_DISTANCE = 20;
    const MAX_POSITION = 750;

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
          x: playerPosition.x + 23,
          y: 530
        }]);
        break;
      default:
        break;
    }
  }, [playerPosition, gameOver, setPlayerPosition, setBullets]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    
    const gameLoop = setInterval(() => {
      if (!gameOver) {
        // Move bullets
        setBullets(prev => 
          prev
            .map(bullet => ({ ...bullet, y: bullet.y - 10 }))
            .filter(bullet => bullet.y > 0)
        );

        // Move obstacles
        setObstacles(prev => {
          const updated = prev
            .map(obstacle => ({
              ...obstacle,
              y: obstacle.y + 3
            }))
            .filter(obstacle => obstacle.y < 600);

          if (Math.random() < 0.05) {
            updated.push({
              id: Date.now(),
              x: Math.random() * (780),
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
  }, [gameOver, handleKeyPress, setBullets, setObstacles, setScore]);

  return (
    <div className="game-container">
      <div className="score-display">Score: {score}</div>
      {obstacles.map(obstacle => (
        <Obstacle key={obstacle.id} x={obstacle.x} y={obstacle.y} />
      ))}
      {bullets.map(bullet => (
        <Bullet key={bullet.id} x={bullet.x} y={bullet.y} />
      ))}
      <Spaceship position={playerPosition} />
      <CollisionManager
          obstacles={obstacles}
          playerPosition={playerPosition}
          setGameOver={setGameOver}
          gameOver={gameOver}
        />
      {gameOver && (
        <GameOverMenu 
          score={score} 
          onRestart={() => {
            setGameOver(false);
            setScore(0);
            setObstacles([]);
            setBullets([]);
            setPlayerPosition({ x: 375, y: 20 });
          }} 
        />
      )}
    </div>
  );
};

export default GameBoard;