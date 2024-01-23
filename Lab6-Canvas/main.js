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

let balls = []
let isGameRunning = false

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

function createBalls(count) {
	for (let i = 0; i < count; i++) {
		let radius = 10
		//never outside the canvas
		let x = Math.random() * (canvas.width - radius * 2) + radius
		let y = Math.random() * (canvas.height - radius * 2) + radius
		//-2 / 2
		let speedX = (Math.random() - 0.5) * 4
		let speedY = (Math.random() - 0.5) * 4
		balls.push(new Ball(x, y, radius, speedX, speedY))
	}
}

function drawLineBetweenBalls(ball1, ball2) {
	const distance = Math.sqrt((ball1.x - ball2.x) ** 2 + (ball1.y - ball2.y) ** 2)
	if (distance < parseInt(distInput.value)) {
		context.beginPath()
		context.moveTo(ball1.x, ball1.y)
		context.lineTo(ball2.x, ball2.y)
		context.stroke()
	}
}

function updateGame() {
	for (const ball of balls) {
		ball.update(canvas.width, canvas.height)
	}
}

function drawGame() {
	context.clearRect(0, 0, canvas.width, canvas.height)
	for (let i = 0; i < balls.length; i++) {
		balls[i].draw(context)
		for (let j = i + 1; j < balls.length; j++) {
			drawLineBetweenBalls(balls[i], balls[j])
		}
	}
}
let lastTime = 0

function gameLoop(timestamp) {
	if (!isGameRunning) return
	const deltaTime = timestamp - lastTime
	lastTime = timestamp
	const fps = Math.round(1000 / deltaTime)

	updateGame()
	drawGame()
	drawFPS(fps)
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

function resizeCanvas() {
	canvas.width = container.offsetWidth
	canvas.height = container.offsetHeight
}

function drawFPS(fps) {
	context.font = '20px Arial'
	context.fillText(`FPS: ${fps}`, 30, 30)
}

//listeners
startBtn.addEventListener('click', () => startGame())
resetBtn.addEventListener('click', () => resetGame())
window.addEventListener('resize', resizeCanvas)
