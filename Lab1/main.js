const container = document.getElementById('container')
const result = document.getElementById('result')
const addFieldButton = document.querySelector('button')
const resetButton = document.getElementById('reset')

resetButton.addEventListener('click', () => {
	location.reload()
})

//add and delete fields
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

		countNumbers()
	})
})

//if any value has changed
document.addEventListener('change', () => {
	countNumbers()
})

function countNumbers(numbers = document.querySelectorAll('input'), result = document.getElementById('result')) {
	const numbersArray = []
	numbers.forEach(number => {
		if (number.value) {
			numbersArray.push(parseInt(number.value))
			number.style.backgroundColor = 'white'

			const suma = numbersArray.reduce((a, b) => a + b, 0)
			const srednia = suma / numbersArray.length
			const min = Math.min(...numbersArray)
			const max = Math.max(...numbersArray)
			result.innerHTML = ''
			const wynik = document.createElement('p')
			wynik.innerHTML = `Suma: ${suma} Średnia: ${srednia} Min: ${min} Max: ${max}`
			result.appendChild(wynik)
		} else {
			number.style.backgroundColor = 'red'
		}
	})
}
