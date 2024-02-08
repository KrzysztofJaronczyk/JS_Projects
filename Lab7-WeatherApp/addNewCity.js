function addNewCity() {
	let totalCities = document.querySelectorAll('.container').length
	if (totalCities < 10) {
		const container = document.createElement('div')
		container.classList.add('container')
		container.setAttribute('id', `city-${totalCities}`)

		const topSection = document.createElement('div')
		topSection.classList.add('top')

		const closeButton = document.createElement('i')
		closeButton.classList.add('fa-regular', 'fa-circle-xmark')

		const mainInfo = document.createElement('div')
		mainInfo.classList.add('main-info')

		const cityInfoDiv = document.createElement('div')

		const cityName = document.createElement('h3')
		cityName.classList.add('city-name')

		const input = document.createElement('input')
		input.type = 'text'
		input.placeholder = 'Enter city name...'

		const warning = document.createElement('p')
		warning.classList.add('warning')

		const photo = document.createElement('img')
		photo.src = './img/unknown.png'
		photo.alt = 'Picture of actual weather'
		photo.classList.add('photo')

		cityInfoDiv.appendChild(cityName)
		cityInfoDiv.appendChild(input)
		cityInfoDiv.appendChild(warning)

		mainInfo.appendChild(cityInfoDiv)
		mainInfo.appendChild(photo)

		topSection.appendChild(closeButton)
		topSection.appendChild(mainInfo)

		const bottomSection = document.createElement('div')
		bottomSection.classList.add('bottom')

		const headings = document.createElement('div')
		headings.classList.add('headings')
		headings.innerHTML = `
            <p>Weather:</p>
            <p>Temp.:</p>
            <p>Humidity:</p>
        `

		const weatherInfo = document.createElement('div')
		weatherInfo.classList.add('weather-info')
		weatherInfo.innerHTML = `
            <p class="weather"></p>
            <p class="temperature"></p>
            <p class="humidity"></p>
        `

		bottomSection.appendChild(headings)
		bottomSection.appendChild(weatherInfo)

		container.appendChild(topSection)
		container.appendChild(bottomSection)

		wrapper.appendChild(container)
	} else {
		alert('You have reached the maximum number of cities')
	}
}

function displayCity(cityData) {
	const container = document.createElement('div')
	container.classList.add('container')
	if (cityData.id) {
		container.setAttribute('data-id', cityData.id)
	} else {
		container.setAttribute('data-id', Date.now())
	}

	container.innerHTML = `
        <div class="top">
            <i class="fa-regular fa-circle-xmark"></i>
            <div class="main-info">
                <div>
                    <h3 class="city-name">${cityData.city || ''}</h3>
                    <input type="text" placeholder="Enter city name...">
                    <p class="warning"></p>
                </div>
                <img src="${cityData.icon || './img/unknown.png'}" alt="Weather icon" class="photo">
            </div>
        </div>
        <div class="bottom">
            <div class="headings">
                <p>Weather:</p>
                <p>Temp.:</p>
                <p>Humidity:</p>
            </div>
            <div class="weather-info">
                <p class="weather">${cityData.weather || ''}</p>
                <p class="temperature">${cityData.temp ? cityData.temp + '°C' : ''}</p>
                <p class="humidity">${cityData.humidity ? cityData.humidity + '%' : ''}</p>
            </div>
        </div>
    `

	wrapper.appendChild(container)
}

function loadSavedCities() {
	savedCities.forEach(city => displayCity(city))
}
