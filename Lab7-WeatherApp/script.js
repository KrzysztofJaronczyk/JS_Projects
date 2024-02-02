const input = document.querySelector('input')
const button = document.querySelector('button')
const cityName = document.querySelector('.city-name')
const warning = document.querySelector('.warning')
const photo = document.querySelector('.photo')
const weather = document.querySelector('.weather')
const temperature = document.querySelector('.temperature')
const humidity = document.querySelector('.humidity')

const API_LINK = 'https://api.openweathermap.org/data/2.5/weather?q='
const API_KEY = '&appid=14296e27415e5e7f9c5595a6105bb271'
const API_UNITS = '&units=metric'

const getWeather = () => {
	const city = input.value
	const URL = API_LINK + city + API_KEY + API_UNITS

	axios
		.get(URL)
		.then(res => {
			// console.log(res.data)
			const temp = res.data.main.temp
			const hum = res.data.main.humidity
			// console.log(res.data.weather[0])
			const status = Object.assign({}, ...res.data.weather)
			// console.log(status.main)
			checkWeatherIcon(status.main)
			warning.textContent = ''
			input.value = ''
			cityName.textContent = res.data.name

			temperature.textContent = Math.floor(temp) + '°C'
			humidity.textContent = hum + '%'
			weather.textContent = status.main
			photo.src = checkWeatherIcon(status.main)
		})
		.catch(() => (warning.textContent = 'Enter the correct city name'))
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

button.addEventListener('click', getWeather)
input.addEventListener('keyup', e => {
	if (e.key === 'Enter') getWeather()
})
