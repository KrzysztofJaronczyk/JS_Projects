const container = document.getElementById('container')
const liczba1 = document.getElementById('1')
const liczba2 = document.getElementById('2')
const liczba3 = document.getElementById('3')
const liczba4 = document.getElementById('4')

const button = document.querySelector('button')

button.addEventListener('click', () => {
	const suma = parseInt(liczba1.value) + parseInt(liczba2.value) + parseInt(liczba3.value) + parseInt(liczba4.value)
	const srednia = suma / 4
	const min = Math.min(liczba1.value, liczba2.value, liczba3.value, liczba4.value)
	const max = Math.max(liczba1.value, liczba2.value, liczba3.value, liczba4.value)

	container.innerHTML = ''
	const wynik = document.createElement('p')
	wynik.innerHTML = `Suma: ${suma} Średnia: ${srednia} Min: ${min} Max: ${max}`
	container.appendChild(wynik)
})

//if liczba value has changed
document.addEventListener('change', () => {
	const suma = parseInt(liczba1.value) + parseInt(liczba2.value) + parseInt(liczba3.value) + parseInt(liczba4.value)
	const srednia = suma / 4
	const min = Math.min(liczba1.value, liczba2.value, liczba3.value, liczba4.value)
	const max = Math.max(liczba1.value, liczba2.value, liczba3.value, liczba4.value)
	container.innerHTML = ''

	const wynik = document.createElement('p')
	wynik.innerHTML = `Suma: ${suma} Średnia: ${srednia} Min: ${min} Max: ${max}`
	container.appendChild(wynik)
})
