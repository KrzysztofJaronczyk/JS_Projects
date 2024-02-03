const input = document.querySelector('input')
const cityName = document.querySelector('.city-name')
const warning = document.querySelector('.warning')
const photo = document.querySelector('.photo')
const weather = document.querySelector('.weather')
const temperature = document.querySelector('.temperature')
const humidity = document.querySelector('.humidity')
const wrapper = document.querySelector('.wrapper')
const deleteBtn = document.querySelector('.fa-circle-xmark')

const addBtn = document.querySelector('.add')
const refreshBtn = document.querySelector('.refresh')
const deleteAllBtn = document.querySelector('.delete-all')

const API_LINK = 'https://api.openweathermap.org/data/2.5/weather?q='
const API_KEY = '&appid=14296e27415e5e7f9c5595a6105bb271'
const API_UNITS = '&units=metric'

const getWeather = e => {
	const inputElement = e.target
	const city = inputElement.value
	const URL = API_LINK + city + API_KEY + API_UNITS

	axios
		.get(URL)
		.then(res => {
			const container = inputElement.closest('.container')
			const cityName = container.querySelector('.city-name')
			const weather = container.querySelector('.weather')
			const temperature = container.querySelector('.temperature')
			const humidity = container.querySelector('.humidity')
			const photo = container.querySelector('.photo')
			const warning = container.querySelector('.warning')

			const temp = res.data.main.temp
			const hum = res.data.main.humidity
			const status = Object.assign({}, ...res.data.weather)

			cityName.textContent = res.data.name
			temperature.textContent = Math.floor(temp) + '°C'
			humidity.textContent = hum + '%'
			weather.textContent = status.main
			photo.src = checkWeatherIcon(status.main)
			warning.textContent = ''
			e.target.value = ''
		})
		.catch(() => {
			const warning = inputElement.nextElementSibling // Uprzednio zdefiniuj, gdzie dokładnie znajduje się element warning
			warning.textContent = 'Enter the correct city name'
		})
}

function checkWeatherIcon(weather) {
	switch (weather) {
		case 'Thunderstorm':
			return 'img/thunderstorm.png'
		case 'Drizzle':
			return 'img/drizzle.png'
		case 'Clear':
			return 'img/sun.png'
		case 'Rain':
			return 'img/rain.png'
		case 'Snow':
			return 'img/ice.png'
		case 'Clouds':
			return 'img/cloud.png'
		case 'Fog':
			return 'img/fog.png'
		default:
			return 'img/unknown.png'
	}
}

function addNewCity() {
	let totalCities = document.querySelectorAll('.container').length
	if (totalCities < 10) {
		wrapper.innerHTML += `
	<div class="container id=${totalCities}">
	<div class="top">
	<i class="fa-regular fa-circle-xmark"></i>
		<div class="main-info">
			<div>
				<h3 class="city-name"></h3>
				<input type="text" placeholder="Enter city name...">
				<p class="warning"></p>
			</div>
			<img src="./img/unknown.png" alt="Picture of actual weather" class="photo">
		</div>
	</div>
	<div class="bottom">
		<div class="headings">
			<p>Weather:</p>
			<p>Temp.:</p>
			<p>Humidity:</p>
		</div>
		<div class="weather-info">
			<p class="weather"></p>
			<p class="temperature"></p>
			<p class="humidity"></p>
		</div>
	</div>
</div>
	`
	} else {
		alert('You have reached the maximum number of cities')
	}
}

refreshBtn.addEventListener('click', () => {
	location.reload()
})

wrapper.addEventListener('click', e => {
	if (e.target.classList.contains('fa-circle-xmark')) {
		const container = e.target.closest('.container')
		container.remove()
	}
})

deleteAllBtn.addEventListener('click', () => {
	wrapper.innerHTML = ''
})

addBtn.addEventListener('click', addNewCity)

wrapper.addEventListener('keyup', e => {
	if (e.key === 'Enter') {
		getWeather(e)
	}
})

