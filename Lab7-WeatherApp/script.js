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
let myChart = null

const getWeather = e => {
	const inputElement = e.target
	const city = inputElement.value.trim()
	const URL = API_LINK + city + API_KEY + API_UNITS

	axios
		.get(URL)
		.then(res => {
			const temp = res.data.main.temp
			const hum = res.data.main.humidity
			const status = Object.assign({}, ...res.data.weather)

			const weatherData = {
				city: res.data.name,
				temp: Math.floor(temp),
				humidity: hum,
				weather: status.main,
				icon: checkWeatherIcon(status.main),
				lastUpdated: Date.now(),
			}

			const container = inputElement.closest('.container')
			const cityNameElement = container.querySelector('.city-name')
			const previousCityName = cityNameElement.textContent

			updateCityWeatherUI(container, weatherData)
			updateSavedCitiesArray(previousCityName, weatherData)

			inputElement.value = ''
		})
		.catch(() => {
			const warning = inputElement.nextElementSibling
			warning.textContent = 'Enter the correct city name'
		})
}

function updateCityWeatherUI(container, weatherData) {
	const cityName = container.querySelector('.city-name')
	const weather = container.querySelector('.weather')
	const temperature = container.querySelector('.temperature')
	const humidity = container.querySelector('.humidity')
	const photo = container.querySelector('.photo')

	cityName.textContent = weatherData.city
	temperature.textContent = `${weatherData.temp}°C`
	humidity.textContent = `${weatherData.humidity}%`
	weather.textContent = weatherData.weather
	photo.src = weatherData.icon
}

function updateSavedCitiesArray(previousCityName, newWeatherData) {
	const cityIndex = savedCities.findIndex(city => city.city === previousCityName)

	if (cityIndex !== -1) {
		// City exists, update its data
		savedCities[cityIndex] = newWeatherData
	} else {
		// New city, add to the array
		savedCities.push(newWeatherData)
	}

	localStorage.setItem('savedCities', JSON.stringify(savedCities))
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

		savedCities = savedCities.filter(city => city.city !== cityName)
		localStorage.setItem('savedCities', JSON.stringify(savedCities))
		container.remove()

		if (myChart) {
			myChart.destroy()
			myChart = null
		}
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
	const temperatures = requiredEntries.map(entry => (entry.main.temp - 273.15).toFixed(2)) // Kelvin to Celsius
	const humidity = requiredEntries.map(entry => entry.main.humidity)

	return { labels, temperatures, humidity }
}

function renderWeatherChart({ labels, temperatures, humidity }) {
	const canvas = document.getElementById('weatherChart')
	const ctx = canvas.getContext('2d')

	if (myChart) {
		myChart.destroy()
	}
	const newCanvas = canvas.cloneNode(true)
	canvas.parentNode.replaceChild(newCanvas, canvas)

	myChart = new Chart(newCanvas.getContext('2d'), {
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					label: 'Temperature (°C)',
					data: temperatures,
					borderColor: 'rgba(255, 99, 132, 1)',
					borderWidth: 1,
					yAxisID: 'y',
				},
				{
					label: 'Humidity (%)',
					data: humidity,
					borderColor: 'rgba(54, 162, 235, 1)',
					borderWidth: 1,
					yAxisID: 'y1',
				},
			],
		},
		options: {
			scales: {
				y: {
					type: 'linear',
					display: true,
					position: 'left',
					ticks: {
						color: 'white',
					},
					grid: {
						color: 'rgba(255, 255, 255, 0.1)',
					},
				},
				y1: {
					type: 'linear',
					display: true,
					position: 'right',
					ticks: {
						color: 'white',
					},
					grid: {
						drawOnChartArea: false,
					},
				},
				x: {
					ticks: {
						color: 'white',
					},
					grid: {
						color: 'rgba(255, 255, 255, 0.1)',
					},
				},
			},
			plugins: {
				legend: {
					labels: {
						color: 'white',
					},
				},
			},
		},
	})

	newCanvas.style.display = 'block'

	newCanvas.addEventListener('click', () => {
		newCanvas.style.display = 'none'
		myChart.destroy()
		myChart = null
	})
}

document.addEventListener('DOMContentLoaded', loadSavedCities)
