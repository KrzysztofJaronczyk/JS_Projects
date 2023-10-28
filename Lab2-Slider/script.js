const slider = document.querySelector('.slider')
const slides = document.querySelector('.slides')
const dots = document.querySelectorAll('.dot')
const slideWidth = 600
let currentSlide = 0
let autoSlideInterval

function animateSlides() {
	const offset = -currentSlide * slideWidth
	slides.style.transform = `translateX(${offset}px)`
}

function changeSlide(n) {
	currentSlide += n
	if (currentSlide < 0) currentSlide = 5
	if (currentSlide > 5) currentSlide = 0
	animateSlides()
	updateDots()
	clearInterval(autoSlideInterval)
	autoSlideInterval = setInterval(autoSlide, 3000)
}

function gotoSlide(n) {
	currentSlide = n
	animateSlides()
	updateDots()
	clearInterval(autoSlideInterval)
	autoSlideInterval = setInterval(autoSlide, 3000)
}

function updateDots() {
	for (let i = 0; i < dots.length; i++) {
		if (i === currentSlide) {
			dots[i].classList.add('active')
		} else {
			dots[i].classList.remove('active')
		}
	}
}

function autoSlide() {
	changeSlide(1)
}

function toggleAutoSlide() {
	if (autoSlideInterval) {
		clearInterval(autoSlideInterval)
		autoSlideInterval = null
	} else {
		autoSlideInterval = setInterval(autoSlide, 3000)
	}
}

// Show the initial slide, update the dots, and start auto animation
animateSlides()
updateDots()
autoSlideInterval = setInterval(autoSlide, 3000)
