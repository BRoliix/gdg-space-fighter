import { useEffect, useRef } from 'react';

const useGameLoop = (callback, fps = 60) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const interval = 1000 / fps;

  const animate = time => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      if (deltaTime >= interval) {
        callback(deltaTime);
        previousTimeRef.current = time;
      }
    } else {
      previousTimeRef.current = time;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);
};

export default useGameLoop;