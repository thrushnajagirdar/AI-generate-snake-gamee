import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 100;

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (isGameOver) {
      if (e.key === 'Enter') resetGame();
      return;
    }

    if (e.key === ' ') {
      setIsPaused(p => !p);
      e.preventDefault();
      return;
    }

    const currentDir = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir !== 'DOWN') directionRef.current = 'UP';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir !== 'UP') directionRef.current = 'DOWN';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir !== 'RIGHT') directionRef.current = 'LEFT';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir !== 'LEFT') directionRef.current = 'RIGHT';
        break;
    }
  }, [isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        setDirection(currentDir);

        const newHead = { ...head };

        switch (currentDir) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check wall collision
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 16); // Hex-like score increment
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [food, isGameOver, isPaused]);

  const handleGameOver = () => {
    setIsGameOver(true);
    setHighScore(prev => Math.max(prev, score));
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full bg-dark-bg p-4 font-pixel">
      <div className="flex justify-between w-full max-w-[400px] text-[10px] md:text-xs border-b border-magenta pb-2">
        <div className="text-cyan">ALLOC: 0x{score.toString(16).toUpperCase()}</div>
        <div className="text-magenta">PEAK: 0x{highScore.toString(16).toUpperCase()}</div>
      </div>

      <div 
        className="relative bg-dark-bg border-2 border-cyan overflow-hidden"
        style={{ 
          width: '100%',
          maxWidth: 400,
          aspectRatio: '1/1',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Render Food */}
        <div 
          className="bg-magenta"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Render Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div 
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${isHead ? 'bg-white' : 'bg-cyan'}`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
              }}
            />
          );
        })}

        {/* Overlays */}
        {isGameOver && (
          <div className="absolute inset-0 bg-dark-bg/90 flex flex-col items-center justify-center z-10 p-4 text-center border-4 border-magenta">
            <h2 className="text-magenta text-xl md:text-2xl mb-4 glitch-text" data-text="FATAL ERROR">FATAL ERROR</h2>
            <p className="text-cyan text-xs mb-6">SEGFault at 0x{score.toString(16).toUpperCase()}</p>
            <button 
              onClick={resetGame}
              className="px-4 py-2 bg-magenta text-dark-bg text-xs hover:bg-cyan transition-none uppercase"
            >
              [ REBOOT ]
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-dark-bg/80 flex items-center justify-center z-10 border-4 border-cyan">
            <h2 className="text-cyan text-lg glitch-text" data-text="PROCESS SUSPENDED">PROCESS SUSPENDED</h2>
          </div>
        )}
      </div>

      <div className="text-cyan text-[8px] text-center mt-2 opacity-70 leading-relaxed">
        INPUT: [W,A,S,D] OR [ARROWS] <br/>
        INTERRUPT: [SPACE]
      </div>
    </div>
  );
}
