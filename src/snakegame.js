// snake game.js
window.initGame = (React, assetsUrl) => {
  const { useState, useEffect } = React;

  const SnakeGame = ({ assetsUrl }) => {
    const [snake, setSnake] = useState([[0, 0]]);
    const [food, setFood] = useState([Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]);
    const [direction, setDirection] = useState([0, 1]); // Starting moving right
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
      const moveSnake = () => {
        if (gameOver) return;

        const newSnake = [...snake];
        const head = newSnake[0];
        const newHead = [head[0] + direction[0], head[1] + direction[1]];

        // Check for collision with walls or self
        if (
          newHead[0] < 0 || newHead[0] >= 10 || 
          newHead[1] < 0 || newHead[1] >= 10 || 
          newSnake.slice(1).some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])
        ) {
          setGameOver(true);
          return;
        }

        newSnake.unshift(newHead);

        // Check if snake has eaten the food
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore(score + 1);
          setFood([Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]);
        } else {
          newSnake.pop(); // Remove the tail
        }

        setSnake(newSnake);
      };

      const interval = setInterval(moveSnake, 100);
      return () => clearInterval(interval);
    }, [snake, direction, food, gameOver, score]);

    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection([-1, 0]);
          break;
        case 'ArrowDown':
          setDirection([1, 0]);
          break;
        case 'ArrowLeft':
          setDirection([0, -1]);
          break;
        case 'ArrowRight':
          setDirection([0, 1]);
          break;
        default:
          break;
      }
    };

    useEffect(() => {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }, []);

    return React.createElement(
      'div',
      { className: "snake-game" },
      React.createElement('h2', null, "Snake Game"),
      React.createElement('p', null, `Score: ${score}`),
      gameOver && React.createElement('p', { style: { color: 'red' } }, 'Game Over!'),
      React.createElement(
        'div',
        { className: "game-board" },
        Array.from({ length: 10 }, (_, rowIndex) =>
          React.createElement(
            'div',
            { key: rowIndex, className: 'row' },
            Array.from({ length: 10 }, (_, colIndex) =>
              React.createElement(
               'div',
            {
              key: colIndex,
              className: `cell ${snake.some(segment => segment[0] === rowIndex && segment[1] === colIndex) ? 'snake' : ''}`,
              style: food[0] === rowIndex && food[1] === colIndex ? { backgroundImage: `url('${assetsUrl}/Food.png')`, backgroundSize: 'cover' } : {}
            }
              )
            )
          )
        )
      )
    );
  };
  return () => React.createElement(SnakeGame, { assetsUrl: assetsUrl });
};

console.log('Snake game script loaded');
