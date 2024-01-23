class Ball {
	constructor(x, y, radius, speedX, speedY) {
		this.x = x
		this.y = y
		this.radius = radius
		this.speedX = speedX
		this.speedY = speedY
	}

	draw(context) {
		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
		context.fill()
	}

	update(width, height) {
		//change of position
		this.x += this.speedX
		this.y += this.speedY

        //edges
        if (this.x - this.radius < 0 || this.x + this.radius > width) {
			this.speedX = -this.speedX
		}
		if (this.y - this.radius < 0 || this.y + this.radius > height) {
			this.speedY = -this.speedY
		}
	}
}

let balls = []
let isGameRunning = false

const container = document.querySelector('.container')
const canvas = document.createElement('canvas')
canvas.width = container.offsetWidth
canvas.height = container.offsetHeight
container.appendChild(canvas)

const context = canvas.getContext('2d')

const startBtn = document.getElementById('startBtn')
const resetBtn = document.getElementById('resetBtn')
const numBallsInput = document.getElementById('numBalls')
const distInput = document.getElementById('dist')

function createBalls(count) {
	for (let i = 0; i < count; i++) {
		let radius = 10
		let x = Math.random() * (canvas.width - radius * 2) + radius
		let y = Math.random() * (canvas.height - radius * 2) + radius
		let speedX = (Math.random() - 0.5) * 4
		let speedY = (Math.random() - 0.5) * 4
		balls.push(new Ball(x, y, radius, speedX, speedY))
	}
}

function updateGame() {
	for (const ball of balls) {
		ball.update(canvas.width, canvas.height)
	}
}

function drawGame() {
	context.clearRect(0, 0, canvas.width, canvas.height)
	for (const ball of balls) {
		ball.draw(context)
	}
}

//optional. why not?
function gameLoop() {
	if (!isGameRunning) return
	updateGame()
	drawGame()
	requestAnimationFrame(gameLoop)
}

function startGame() {
	isGameRunning = true
	createBalls(parseInt(numBallsInput.value))
	requestAnimationFrame(gameLoop)
}

function resetGame() {
	isGameRunning = false
	balls = []
	context.clearRect(0, 0, canvas.width, canvas.height)
}



startBtn.addEventListener('click', () => startGame())
resetBtn.addEventListener('click', () => resetGame())
