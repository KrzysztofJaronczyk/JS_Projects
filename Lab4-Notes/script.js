const addBtn = document.querySelector('.add')
const refreshBtn = document.querySelector('.refresh')

const saveBtn = document.querySelector('.save')
const cancelBtn = document.querySelector('.cancel')
const deleteAllBtn = document.querySelector('.delete-all')

const noteArea = document.querySelector('.note-area')
const pinnedArea = document.querySelector('.pinned-area')

const notePanel = document.querySelector('.note-panel')
const category = document.querySelector('#category')
const textarea = document.querySelector('#text')
const mainTitle = document.querySelector('#title')
const date = document.querySelector('.date')
const tagsInput = document.querySelector('#tags')
const searchInput = document.querySelector('#search')

const error = document.querySelector('.error')

let selectedValue
let cardId = 1
let editMode = null

const openPanel = () => {
	notePanel.style.display = 'flex'
}

const closePanel = () => {
	notePanel.style.display = 'none'
	error.style.visibility = 'hidden'
	textarea.value = ''
	category.selectedIndex = 0
	mainTitle.value = ''
	tagsInput.value = ''
	editMode = null
}

const addNote = () => {
	if (textarea.value !== '' && category.selectedIndex !== 0 && mainTitle.value !== '') {
		const tags = tagsInput.value.split(',').map(tag => tag.trim())
		if (editMode !== null) {
			const noteToEdit = document.getElementById(editMode)
			noteToEdit.querySelector('.note-main-title').innerText = mainTitle.value
			noteToEdit.querySelector('.note-title').innerText = selectedValue
			noteToEdit.querySelector('.note-body').innerText = textarea.value
			noteToEdit.querySelector('.tags').innerText = tags.join(', ')
			noteToEdit.querySelector('.date').innerText = new Date().toLocaleString()
			checkColor(noteToEdit)
			editMode = null
			saveToLocalStorage()
		} else {
			createNote(tags)
		}
		closePanel()
	} else {
		error.style.visibility = 'visible'
	}
}

const createNote = tags => {
	const newNote = document.createElement('div')
	newNote.classList.add('note')
	newNote.setAttribute('id', cardId)
	cardId++
	newNote.innerHTML = `
        <div class="note-header">
            <div class="note-main-title">${mainTitle.value}</div>
            <button class="delete-note" onclick="deleteNote(${newNote.id})">
                <i class="fas fa-times icon"></i>
            </button>
            <button class="edit-note" onclick="loadNote(${newNote.id})">
                <i class="fas fa-edit icon"></i>
            </button>
            <button class="pin-note" onclick="pinNote(${newNote.id})">
                <i class="fas fa-thumbtack icon"></i>
            </button>
        </div>
        <div class="note-body">
            ${textarea.value}
        </div>
        <div class="note-header">
            <div class="note-title">${selectedValue}</div>
        </div>
        <div class="tags">${tags.join(', ')}</div>
        <div class="date">${new Date().toLocaleString()}</div>
    `
	checkColor(newNote)

	if (newNote.classList.contains('pinned')) {
		pinnedArea.appendChild(newNote)
	} else {
		noteArea.appendChild(newNote)
	}

	saveToLocalStorage()
}

const loadNote = id => {
	const noteToEdit = document.getElementById(id)
	openPanel()
	mainTitle.value = noteToEdit.querySelector('.note-main-title').innerText
	textarea.value = noteToEdit.querySelector('.note-body').innerText
	const noteTitle = noteToEdit.querySelector('.note-title').innerText

	for (let i = 0; i < category.options.length; i++) {
		if (category.options[i].text === noteTitle) {
			category.selectedIndex = i
			break
		}
	}

	tagsInput.value = noteToEdit.querySelector('.tags').innerText
	editMode = id
}

const pinNote = id => {
	const noteToPin = document.getElementById(id)
	const isPinned = noteToPin.classList.toggle('pinned')

	if (isPinned) {
		pinnedArea.appendChild(noteToPin)
	} else {
		noteArea.appendChild(noteToPin)
	}

	saveToLocalStorage()
}

const saveToLocalStorage = () => {
	const pinnedNotes = []
	const regularNotes = []

	document.querySelectorAll('.note').forEach(note => {
		const noteObj = {
			id: note.id,
			mainTitle: note.querySelector('.note-main-title').innerText,
			title: note.querySelector('.note-title').innerText,
			content: note.querySelector('.note-body').innerText,
			tags: note.querySelector('.tags').innerText,
			color: note.style.backgroundColor,
			pin: note.classList.contains('pinned'),
			date: note.querySelector('.date').innerText,
			createdAt: new Date().toISOString(),
		}

		if (noteObj.pin) {
			pinnedNotes.push(noteObj)
		} else {
			regularNotes.push(noteObj)
		}
	})

	localStorage.setItem('pinnedNotes', JSON.stringify(pinnedNotes))
	localStorage.setItem('regularNotes', JSON.stringify(regularNotes))
}

const loadFromLocalStorage = () => {
	const storedPinnedNotes = localStorage.getItem('pinnedNotes')
	const storedRegularNotes = localStorage.getItem('regularNotes')

	loadNotesFromStorage(storedPinnedNotes, pinnedArea)
	loadNotesFromStorage(storedRegularNotes, noteArea)
}

const loadNotesFromStorage = (storedNotes, targetArea) => {
	if (storedNotes) {
		const notes = JSON.parse(storedNotes)
		notes.forEach(note => {
			const newNote = createNoteElement(note)
			targetArea.appendChild(newNote)
		})
	}
}

const createNoteElement = noteObj => {
	const newNote = document.createElement('div')
	newNote.classList.add('note')
	newNote.setAttribute('id', noteObj.id)
	newNote.style.backgroundColor = noteObj.color
	newNote.innerHTML = `
        <div class="note-header">
            <div class="note-main-title">${noteObj.mainTitle}</div>
            <button class="delete-note" onclick="deleteNote(${noteObj.id})">
                <i class="fas fa-times icon"></i>
            </button>
            <button class="edit-note" onclick="loadNote(${noteObj.id})">
                <i class="fas fa-edit icon"></i>
            </button>
            <button class="pin-note" onclick="pinNote(${noteObj.id})">
                <i class="fas fa-thumbtack icon"></i>
            </button>
        </div>
        <div class="note-body">
            ${noteObj.content}
        </div>
        <div class="note-header">
            <div class="note-title">${noteObj.title}</div>
        </div>
        <div class="tags" onclick="filterNotesByTag('${noteObj.tags}')">${noteObj.tags}</div>
        <div class="date">${noteObj.date}</div>
    `

	if (noteObj.pin) {
		newNote.classList.add('pinned')
	}

	return newNote
}

const filterNotesByTag = tag => {
	const allNotes = document.querySelectorAll('.note')
	allNotes.forEach(note => {
		if (note.querySelector('.tags').innerText.toLowerCase() === tag.toLowerCase()) {
			note.style.display = 'block'
		} else {
			note.style.display = 'none'
		}
	})
}

const selectValue = () => {
	selectedValue = category.options[category.selectedIndex].text
}

const checkColor = note => {
	switch (selectedValue) {
		case 'Work':
			note.style.backgroundColor = 'green'
			break
		case 'Free Time':
			note.style.backgroundColor = 'red'
			break
		case 'Study':
			note.style.backgroundColor = 'rgb(255, 243, 0)'
			break
		case 'Other':
			note.style.backgroundColor = 'orange'
			break
		default:
			note.style.backgroundColor = 'white'
			break
	}
}

const deleteNote = id => {
	const noteToDelete = document.getElementById(id)
	noteToDelete.parentNode.removeChild(noteToDelete)
	saveToLocalStorage()
}

const deleteAllNotes = () => {
	noteArea.innerHTML = ''
	pinnedArea.innerHTML = ''
	saveToLocalStorage()
	location.reload()
}

const searchNotes = query => {
	const allNotes = document.querySelectorAll('.note')
	allNotes.forEach(note => {
		if (
			note.innerText.toLowerCase().includes(query.toLowerCase()) ||
			note.querySelector('.tags').innerText.toLowerCase().includes(query.toLowerCase())
		) {
			note.style.display = 'block'
		} else {
			note.style.display = 'none'
		}
	})
}

refreshBtn.addEventListener('click', () => {
	location.reload()
})

addBtn.addEventListener('click', openPanel)
cancelBtn.addEventListener('click', closePanel)
saveBtn.addEventListener('click', addNote)
deleteAllBtn.addEventListener('click', deleteAllNotes)
window.addEventListener('load', loadFromLocalStorage)
searchInput.addEventListener('input', () => {
	const searchQuery = searchInput.value.trim()
	searchNotes(searchQuery)
})
