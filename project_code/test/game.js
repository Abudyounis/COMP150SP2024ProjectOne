var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 16;
var requestAnimationFrameId = null;

// Initialize snake and apple to be globally accessible
var snake;
var apple;
var updateCounter;

function initGame() {
  snake = {
    x: 160,
    y: 160,
    dx: grid, // moving right
    dy: 0,
    cells: [],
    maxCells: 4
  };
  apple = {
    x: getRandomInt(0, 25) * grid,
    y: getRandomInt(0, 25) * grid
  };
  updateCounter = 0;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function startGame() {
  initGame(); // Initialize or reset game state
  if (requestAnimationFrameId) {
    cancelAnimationFrame(requestAnimationFrameId); // Ensure no old game loops are running
  }

  function loop() {
    requestAnimationFrameId = requestAnimationFrame(loop);
    if (++updateCounter < 10) {  // Slow down game update frequency
      return;
    }
    updateCounter = 0;
    updateGame();
  }

  loop();
  document.getElementById('pauseButton').style.display = 'inline';
  document.getElementById('resumeButton').style.display = 'none';
}

function updateGame() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Snake movement and boundary collision logic
  snake.x += snake.dx;
  snake.y += snake.dy;
  snake.x = snake.x >= canvas.width ? 0 : snake.x < 0 ? canvas.width - grid : snake.x;
  snake.y = snake.y >= canvas.height ? 0 : snake.y < 0 ? canvas.height - grid : snake.y;

  // Track snake cells and remove tail
  snake.cells.unshift({x: snake.x, y: snake.y});
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // Draw apple
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  // Draw snake
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    context.fillRect(cell.x, cell.y, grid-1, grid-1);
    // Check for apple consumption
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }
    // Check for collisions with self
    if (index !== 0 && cell.x === snake.cells[0].x && cell.y === snake.cells[0].y) {
      startGame(); // Restart the game if collision detected
    }
  });
}

document.getElementById('startButton').addEventListener('click', startGame);

document.getElementById('pauseButton').addEventListener('click', function() {
  if (requestAnimationFrameId) {
    cancelAnimationFrame(requestAnimationFrameId);
    requestAnimationFrameId = null;
    document.getElementById('pauseButton').style.display = 'none';
    document.getElementById('resumeButton').style.display = 'inline';
  }
});

document.getElementById('resumeButton').addEventListener('click', function() {
  if (!requestAnimationFrameId) {
    startGame(); // Resume the game from the current state
  }
});

document.addEventListener('keydown', function(e) {
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});
