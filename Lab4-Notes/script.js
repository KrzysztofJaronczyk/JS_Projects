const addBtn = document.querySelector('.add')
const saveBtn = document.querySelector('.save')
const cancelBtn = document.querySelector('.cancel')
const deleteBtns = document.getElementsByClassName('.delete-note')
const deleteAllBtn = document.querySelector('.delete-all')

const noteArea = document.querySelector('.note-area')
const notePanel = document.querySelector('.note-panel')
const category = document.querySelector('#category')
const textarea = document.querySelector('#text')
const error = document.querySelector('.error')
let selectedValue

let cardId = 0

const openPanel = () => {
	notePanel.style.display = 'flex'
}

const closePanel = () => {
	notePanel.style.display = 'none'
	error.style.visibility = 'hidden'
	textarea.value = ''
	category.selectedIndex = 0
}

const addNote = () => {
	if (textarea.value !== '' && category.value !== '0') {
		createNote()
		closePanel()
	} else {
		error.style.visibility = 'visible'
	}
}

const createNote = () => {
	const newNote = document.createElement('div')
	newNote.classList.add('note')
	newNote.setAttribute('id', cardId)
	noteArea.appendChild(newNote)
	cardId++
	newNote.innerHTML = ` <div class="note-header">
	<div class="note-title">${selectedValue}</div>
	<button class="delete-note">
		<i class="fas fa-times icon"></i>
	</button>
</div>
<div class="note-body">
	${textarea.value}
</div>`
}

const selectValue = () => {
	selectedValue = category.options[category.selectedIndex].text
	// console.log(selectedValue)
}

addBtn.addEventListener('click', openPanel)
cancelBtn.addEventListener('click', closePanel)
saveBtn.addEventListener('click', addNote)
