const container = document.getElementById('container')
const result = document.getElementById('result')

const addFieldButton = document.querySelector('button')
const resetButton = document.getElementById('reset')

resetButton.addEventListener('click', () => {
	location.reload()
})

addFieldButton.addEventListener('click', () => {
	const containerDiv = document.createElement('div')
	const newField = document.createElement('input')
	const deleteButton = document.createElement('button')
	const number = container.children.length + 1

	deleteButton.innerHTML = 'Usuń'
	deleteButton.id = 'Delete' + number
	newField.type = 'number'
	newField.id = number
	newField.placeholder = 'Wpisz liczbę'
	//add new fields in 1 line
	containerDiv.appendChild(newField)
	containerDiv.appendChild(deleteButton)

	container.appendChild(containerDiv)

	deleteButton.addEventListener('click', () => {
		newField.remove()
		deleteButton.remove()
		//count numbers
		const numbers = []
		document.querySelectorAll('input').forEach(input => {
			if (input.value) {
				numbers.push(parseInt(input.value))
				input.style.backgroundColor = 'white'

				const suma = numbers.reduce((a, b) => a + b, 0)
				const srednia = suma / numbers.length
				const min = Math.min(...numbers)
				const max = Math.max(...numbers)
				result.innerHTML = ''
				const wynik = document.createElement('p')
				wynik.innerHTML = `Suma: ${suma} Średnia: ${srednia} Min: ${min} Max: ${max}`
				result.appendChild(wynik)
			} else {
				input.style.backgroundColor = 'red'
			}
		})
	})
})

//if liczba value has changed
document.addEventListener('change', () => {
	const numbers = []
	document.querySelectorAll('input').forEach(input => {
		if (input.value) {
			numbers.push(parseInt(input.value))
			input.style.backgroundColor = 'white'

			const suma = numbers.reduce((a, b) => a + b, 0)
			const srednia = suma / numbers.length
			const min = Math.min(...numbers)
			const max = Math.max(...numbers)
			result.innerHTML = ''
			const wynik = document.createElement('p')
			wynik.innerHTML = `Suma: ${suma} Średnia: ${srednia} Min: ${min} Max: ${max}`
			result.appendChild(wynik)
		} else {
			input.style.backgroundColor = 'red'
		}
	})
	// const suma = parseInt(liczba1.value) + parseInt(liczba2.value) + parseInt(liczba3.value)
	// const srednia = suma / 3
	// const min = Math.min(liczba1.value, liczba2.value, liczba3.value)
	// const max = Math.max(liczba1.value, liczba2.value, liczba3.value)
	// result.innerHTML = ''

	// const wynik = document.createElement('p')
	// result.innerHTML = `Suma: ${suma} Średnia: ${srednia} Min: ${min} Max: ${max}`
	// container.appendChild(wynik)
})
