import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { timerAtom } from '../store/atom';

const Timer = ({ gameOver }) => {
  const [time, setTime] = useAtom(timerAtom);

  useEffect(() => {
    if (!gameOver) {
      const timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameOver, setTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer">
        Time: {formatTime(time)}
    </div>
  );
};

export default Timer;
