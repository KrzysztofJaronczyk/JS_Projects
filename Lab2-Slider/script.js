const pauseBtn = document.querySelector('#sliderPauseButton');
const sliderLeftBtn = document.querySelector('#sliderLeftButton');
const sliderRightBtn = document.querySelector('#sliderRightButton');
const slides = document.querySelectorAll('.slide');

let slideIndex = 0;

pauseBtn.addEventListener('click', () => {
    console.log('pause');
});

sliderRightBtn.addEventListener('click', () => {
    console.log('slide right');

    slides[slideIndex].classList.add('animation');
});

sliderLeftBtn.addEventListener('click', () => {
    console.log('slide left');
});

// jednorazowe wykonanie kodu po określonym czasie
const timeoutRef = setTimeout(() => {
	main.innerHTML = 'Msg from setTimeout'
}, 2000)

// wykonywanie kodu co określony czas
let licznik = 0
const intervalRef = setInterval(() => {
	main.innerHTML = `Msg from setInterval: ${licznik++}`
}, 4000)

// kasujemy setInterval
// clearInterval(intervalRef)

// kasujemy setTimeout
// clearTimeout(intervalRef)

// window.requestAnimationFrame -use this if possible
