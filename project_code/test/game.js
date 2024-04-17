var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 16;
var requestAnimationFrameId = null;
var frameCounter = 0;  // Frame counter to control update frequency

// Initialize snake and apple to be globally accessible
var snake = {
  x: 160,
  y: 160,
  dx: grid, // moving right
  dy: 0,
  cells: [],
  maxCells: 4
};
var apple = {
  x: 320,
  y: 320
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function startGame() {
  if (requestAnimationFrameId) {
    cancelAnimationFrame(requestAnimationFrameId);
  }

  // Reset snake and apple positions and properties for game restart
  snake.x = 160;
  snake.y = 160;
  snake.dx = grid;
  snake.dy = 0;
  snake.cells = [];
  snake.maxCells = 4;
  apple.x = getRandomInt(0, 25) * grid;
  apple.y = getRandomInt(0, 25) * grid;

  function loop() {
    requestAnimationFrameId = requestAnimationFrame(loop);
    if (++frameCounter >= 10) {  // Update snake position every 10 frames
      updateGame();
      frameCounter = 0;  // Reset counter after update
    }
  }

  loop();
  document.getElementById('pauseButton').style.display = 'inline';
  document.getElementById('resumeButton').style.display = 'none';
}

function updateGame() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // move snake
  snake.x += snake.dx;
  snake.y += snake.dy;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // keep track of where snake has been
  snake.cells.unshift({x: snake.x, y: snake.y});
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // draw apple
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  // draw snake
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    context.fillRect(cell.x, cell.y, grid-1, grid-1);

    // snake eating apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // check collision with all cells after this one
    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        startGame();  // Restart the game if snake collides with itself
        return; // Exit the current animation frame loop to prevent further execution after restart
      }
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
    function resumeLoop() {
      requestAnimationFrameId = requestAnimationFrame(resumeLoop);
      if (++frameCounter >= 10) {
        updateGame();
        frameCounter = 0;
      }
    }
    resumeLoop();
    document.getElementById('resumeButton').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'inline';
  }
});

document.addEventListener('keydown', function(e) {
  // Prevent snake from backtracking on itself, and allow changing direction only if it's not currently moving in the opposite direction
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
