import {tetrimino} from "./tetrimino.js";

const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const rows = 20;
const cols = 10;
const blockSize = 30;

let gameInterval;
let score = 0;
let isPaused = false;

let currentPiece, currentPosition;

// pick one random object from the tetrimino object
function generateRandomPiece() {
  const keys = Object.keys(tetrimino);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return tetrimino[randomKey];
}

function drawBlock(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
  ctx.strokeStyle = "#000";
  ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col] !== null) {
        drawBlock(col, row, board[row][col]);
      }
    }
  }
}

function drawPiece() {
  const {shape, color} = currentPiece;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        drawBlock(currentPosition.x + col, currentPosition.y + row, color);
      }
    }
  }
}

// Check if the current piece collides with anything on the board
function isCollision() {
  const {shape} = currentPiece;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        if (
          currentPosition.y + row >= rows ||
          currentPosition.x + col < 0 ||
          currentPosition.x + col >= cols ||
          board[currentPosition.y + row][currentPosition.x + col] !== null
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function cleanBoard() {
  board.forEach(row => row.fill(null));
}

// Move the piece down
function movePieceDown() {
  currentPosition.y++;
  if (isCollision()) {
    currentPosition.y--;
    placePiece();
    checkRows();
    currentPiece = generateRandomPiece();
    currentPosition = {x: Math.floor(cols / 2) - 1, y: 0};
    if (isCollision()) {
      clearInterval(gameInterval);
      alert('Game Over');
      cleanBoard();
      return;
    }
  }
  drawBoard();
  drawPiece();
}

// Place the piece on the board
function placePiece() {
  const {shape, color} = currentPiece;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        board[currentPosition.y + row][currentPosition.x + col] = color;
      }
    }
  }
}

// Check for full rows and clear them
function checkRows() {
  let rowsCleared = 0;
  for (let row = rows - 1; row >= 0; row--) {
    if (board[row].every(cell => cell !== null)) {
      board.splice(row, 1);
      board.unshift(Array(cols).fill(null));
      rowsCleared++;
      row++; // Recheck the same row after clearing
    }
  }
  if (rowsCleared > 0) {
    score += rowsCleared * 100;
    document.getElementById('score').innerText = `Score: ${score}`;
  }
}

const board = Array(rows).fill().map(() => Array(cols).fill(null));

function onStart() {
  clearInterval(gameInterval)
  cleanBoard()
  score = 0;
  document.getElementById('score').innerText = `Score: ${score}`;
  currentPiece = generateRandomPiece();
  currentPosition = {x: Math.floor(cols / 2) - 1, y: 0};
  gameInterval = setInterval(movePieceDown, 500);
}

function onPause() {
  isPaused = !isPaused;
  if (isPaused) {
    clearInterval(gameInterval);
  } else {
    gameInterval = setInterval(movePieceDown, 500);
  }
}

function movePieceLeft() {
  currentPosition.x--;
  if (isCollision()) {
    currentPosition.x++;
  } else {
    drawBoard();
    drawPiece();
  }
}

function movePieceRight() {
  currentPosition.x++;
  if (isCollision()) {
    currentPosition.x--;
  } else {
    drawBoard();
    drawPiece();
  }
}

function rotatePiece() {
  const {shape} = currentPiece;
  currentPiece.shape = shape[0].map((_, index) => shape.map(row => row[index])).reverse();
  if (isCollision()) {
    currentPiece.shape = shape;
  } else {
    drawBoard();
    drawPiece();
  }
}

function dropPiece() {
  while (!isCollision()) {
    currentPosition.y++;
  }
  currentPosition.y--;
  movePieceDown();
}

function controlsHandler(event) {
  switch (event.key) {
    case 'ArrowUp':
      rotatePiece();
      break;
    case 'ArrowRight':
      movePieceRight();
      break;
    case 'ArrowLeft':
      movePieceLeft();
      break;
    case 'ArrowDown':
      movePieceDown();
      break;
    case ' ':
      dropPiece();
      break;
  }
}

document.getElementById('start-btn').addEventListener('click', onStart);
document.getElementById('pause-btn').addEventListener('click', onPause);
document.addEventListener('keydown', controlsHandler);

// Initializing game
currentPiece = generateRandomPiece();
currentPosition = {x: Math.floor(cols / 2) - 1, y: 0};

