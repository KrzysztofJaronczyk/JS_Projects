class Ball {
    
}

let balls = [];
let animationFrameId;
let isGameRunning = false;

const container = document.querySelector('.container');
const canvas = document.createElement('canvas');
canvas.width = container.offsetWidth;
canvas.height = container.offsetHeight;
container.appendChild(canvas);

const context = canvas.getContext('2d');

const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const numBallsInput = document.getElementById('numBalls');
const distInput = document.getElementById('dist');

function createBalls(count) {
    // Tworzenie określonej liczby kulek
}

function updateGame() {
    // Aktualizacja pozycji kulek i sprawdzanie kolizji
}

function drawGame() {
    // Rysowanie kulek i linii między nimi
}

function gameLoop() {
    if (!isGameRunning) return;
    requestAnimationFrame(gameLoop);
    // Logika pętli gry: updateGame i drawGame
}

function startGame() {
    balls = [];
    createBalls(parseInt(numBallsInput.value));
    isGameRunning = true;
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    isGameRunning = false;
    balls = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
}

startBtn.addEventListener('click', () => startGame());
resetBtn.addEventListener('click', () => resetGame());