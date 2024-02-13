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

let savedCities = JSON.parse(localStorage.getItem('savedCities')) || []

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

			// Create a weather data object including lat and lon
			const weatherData = {
				city: res.data.name,
				temp: Math.floor(temp),
				humidity: hum,
				weather: status.main,
				icon: checkWeatherIcon(status.main),
				lastUpdated: Date.now(), // Timestamp of the update
			}

			// Add to savedCities and save to localStorage
			savedCities.push(weatherData)
			localStorage.setItem('savedCities', JSON.stringify(savedCities))
		})
		.catch(() => {
			const warning = inputElement.nextElementSibling
			warning.textContent = 'Enter the correct city name'
		})
}

function fetchHourlyForecast(cityName) {
	console.log(cityName)
	const oneCallAPI = `https:/api.openweathermap.org/data/2.5/forecast?q=${cityName}&${API_KEY}`
	console.log(oneCallAPI)

	axios
		.get(oneCallAPI)
		.then(response => {
			console.log(`Hourly forecast for ${cityName}:`, response.data)
			const weatherData = prepareDataForChart(response.data)
			renderWeatherChart(weatherData)
		})
		.catch(error => {
			console.error('Error fetching hourly forecast:', error)
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

function updateWeatherForSavedCities() {
	savedCities.forEach((city, index) => {
		const URL = `${API_LINK}${city.city}${API_KEY}${API_UNITS}`
		axios
			.get(URL)
			.then(res => {
				const { temp, humidity } = res.data.main
				const status = Object.assign({}, ...res.data.weather)

				// Update city data in the array
				savedCities[index] = {
					...city,
					temp: Math.floor(temp),
					humidity,
					weather: status.main,
					icon: checkWeatherIcon(status.main),
					lastUpdated: Date.now(),
				}

				// Immediately update localStorage after each city's data is updated
				localStorage.setItem('savedCities', JSON.stringify(savedCities))

				// Update UI for each city
				displayCity(savedCities[index])
			})
			.catch(error => {
				console.error(`Error updating weather for ${city.city}:`, error)
			})
	})
}

setInterval(updateWeatherForSavedCities, 300000) // 5 min

refreshBtn.addEventListener('click', () => {
	location.reload()
})

wrapper.addEventListener('click', e => {
	if (e.target.classList.contains('fa-circle-xmark')) {
		const container = e.target.closest('.container')
		const cityName = container.querySelector('.city-name').textContent

		// Remove city from savedCities and update localStorage
		savedCities = savedCities.filter(city => city.city !== cityName)
		localStorage.setItem('savedCities', JSON.stringify(savedCities))

		container.remove()
	}
})

deleteAllBtn.addEventListener('click', () => {
	wrapper.innerHTML = ''
	savedCities = []
	localStorage.setItem('savedCities', JSON.stringify(savedCities))
})

addBtn.addEventListener('click', addNewCity)

wrapper.addEventListener('keyup', e => {
	if (e.key === 'Enter') {
		getWeather(e)
	}
})

function loadSavedCities() {
	const storedCities = JSON.parse(localStorage.getItem('savedCities')) || []
	const currentTime = Date.now()

	storedCities.forEach(city => {
		const timeSinceLastUpdate = currentTime - city.lastUpdated
		if (timeSinceLastUpdate <= 300000) {
			displayCity(city)
		} else {
			updateWeatherForCity(city.city)
		}
	})
}

function updateWeatherForCity(cityName) {
	const URL = `${API_LINK}${cityName}${API_KEY}${API_UNITS}`
	axios
		.get(URL)
		.then(res => {
			const { temp, humidity } = res.data.main
			const status = Object.assign({}, ...res.data.weather)

			const updatedCityData = {
				city: cityName,
				temp: Math.floor(temp),
				humidity,
				weather: status.main,
				icon: checkWeatherIcon(status.main),
				lastUpdated: Date.now(),
			}

			const cityIndex = savedCities.findIndex(city => city.city === cityName)
			if (cityIndex > -1) {
				savedCities[cityIndex] = updatedCityData
			} else {
				savedCities.push(updatedCityData)
			}

			displayCity(updatedCityData)

			localStorage.setItem('savedCities', JSON.stringify(savedCities))
		})
		.catch(error => {
			console.error(`Error updating weather for ${cityName}:`, error)
		})
}

function prepareDataForChart(jsonData) {
	const requiredEntries = jsonData.list.slice(0, 4) // 12 hours
	const labels = requiredEntries.map(entry =>
		new Date(entry.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	)
	// Convert temperature from Kelvin to Celsius
	const temperatures = requiredEntries.map(entry => (entry.main.temp - 273.15).toFixed(2))

	return { labels, temperatures }
}

function renderWeatherChart({ labels, temperatures }) {
	const ctx = document.getElementById('weatherChart').getContext('2d')
	new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					label: 'Temperature (°C)',
					data: temperatures,
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					borderColor: 'rgba(255, 99, 132, 1)',
					borderWidth: 1,
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: false,
					suggestedMin: -10,
					suggestedMax: 40,
					ticks: {
						callback: function (value, index, values) {
							return `${value}°C`
						},
					},
				},
			},
		},
	})
}

document.addEventListener('DOMContentLoaded', loadSavedCities)
