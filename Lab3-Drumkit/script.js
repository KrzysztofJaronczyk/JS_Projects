const KeyToSound = {
	a: document.querySelector('#s1'),
	s: document.querySelector('#s2'),
	d: document.querySelector('#s3'),
	f: document.querySelector('#s4'),
	g: document.querySelector('#s5'),
	h: document.querySelector('#s6'),
	j: document.querySelector('#s7'),
	k: document.querySelector('#s8'),
	l: document.querySelector('#s9'),
	q: document.querySelector('#s10'),
	w: document.querySelector('#s11'),
	e: document.querySelector('#s12'),
	r: document.querySelector('#s13'),
	t: document.querySelector('#s14'),
	y: document.querySelector('#s15'),
	u: document.querySelector('#s16'),
	i: document.querySelector('#s17'),
	o: document.querySelector('#s18'),
	p: document.querySelector('#s19'),
	z: document.querySelector('#s20'),
	x: document.querySelector('#s21'),
	c: document.querySelector('#s22'),
	v: document.querySelector('#s23'),
	b: document.querySelector('#s24'),
	n: document.querySelector('#s25'),
	m: document.querySelector('#s26'),
	
}

// Create an array to store recording data for each channel
const recordingData = []

// Create an array to store selected channels
const selectedChannels = []

// Recording and Playback
let isRecording = false
let isPlaying = false

document.addEventListener('keypress', function (e) {
	if (isRecording) {
		recordChannelData(e.key, Date.now())
		console.log('Started recording at: ', recordingData)
	}
	playSound(e.key)
})

function playSound(key) {
	const audioTag = KeyToSound[key]
	if (audioTag) {
		audioTag.currentTime = 0
		audioTag.play()
	}
}

// Record and Playback Buttons
const recordBtns = document.querySelectorAll('.canal svg[id^="record-btn"]')
const playBtns = document.querySelectorAll('.canal svg[id^="play-btn"]')

recordBtns.forEach((btn, index) => {
	btn.addEventListener('click', () => {
		if (isRecording) {
			stopRecording()
			btn.style.fill = 'none'
		} else {
			startRecording(index)
			btn.style.fill = 'red'
		}
	})
})

playBtns.forEach((btn, index) => {
	btn.addEventListener('click', () => {
		if (!isPlaying && recordingData[index].length > 0) {
			stopRecording()
			//clear style
			recordBtns[index].style.fill = 'none'
			startPlayback(index)

			btn.style.fill = 'green'
			//Clear style when playback is done
			setTimeout(() => {
				btn.style.fill = 'none'
			}, recordingData[index][recordingData[index].length - 1][1] - recordingData[index][0][1] + 500)
		}
	})
})

function startRecording(channelIndex) {
	isRecording = true
	isPlaying = false // Stop playback if it's in progress
	recordingData[channelIndex] = [] // Clear previous recording
}

function stopRecording() {
	isRecording = false
}

function recordChannelData(key, timestamp) {
	recordingData.forEach((channel, index) => {
		if (isRecording && index === recordingData.length - 1) {
			channel.push([key, timestamp])
		}
	})
}

function startPlayback(channelIndex) {
	if (recordingData[channelIndex] && recordingData[channelIndex].length > 0) {
		let startTime = recordingData[channelIndex][0][1]
		recordingData[channelIndex].forEach(sound => {
			const delay = sound[1] - startTime
			setTimeout(() => {
				playSound(sound[0])
			}, delay)
		})
	}
}

// Play All Channels Button
const playAllButton = document.getElementById('play-all')
playAllButton.addEventListener('click', () => {
	// Play button on all channels, including the new ones
	playBtns.forEach((btn, index) => {
		startPlayback(index)
	})

	// For the new channels, start playback as well
	const newChannelCount = canals.children.length - playBtns.length
	for (let i = 0; i < newChannelCount; i++) {
		const newChannelIndex = playBtns.length + i
		startPlayback(newChannelIndex)
		const newChannelPlayButton = document.querySelector(`#play-btn${newChannelIndex + 1}`)
	}
})

// Checkbox event listeners to track selected channels
//check canals
const canals = document.getElementById('canals')
canals.addEventListener('change', e => {
	const checkbox = e.target
	const canal = checkbox.parentElement
	const canalId = parseInt(canal.id)
	if (checkbox.checked) {
		selectedChannels.push(canalId)
	} else {
		selectedChannels.splice(selectedChannels.indexOf(canalId), 1)
	}
	console.log(selectedChannels)
})

const playSelectedButton = document.getElementById('play-selected')
playSelectedButton.addEventListener('click', () => {
	// Play selected channels
	playBtns.forEach((btn, index) => {
		if (selectedChannels.includes(index + 1) && recordingData[index].length > 0) {
			startPlayback(index)
			btn.style.fill = 'green'
			setTimeout(() => {
				btn.style.fill = 'none'
			}, recordingData[index][recordingData[index].length - 1][1] - recordingData[index][0][1] + 500)
		}
	})

	// For the new channels, start playback as well
	const newChannelCount = canals.children.length - playBtns.length
	for (let i = 0; i < newChannelCount; i++) {
		const newChannelIndex = playBtns.length + i
		if (selectedChannels.includes(newChannelIndex + 1) && recordingData[newChannelIndex].length > 0) {
			const newChannelRecordButton = document.querySelector(`#record-btn${newChannelIndex + 1}`)
			newChannelRecordButton.style.fill = 'none'
			startPlayback(newChannelIndex)
			const newChannelPlayButton = document.querySelector(`#play-btn${newChannelIndex + 1}`)
			newChannelPlayButton.style.fill = 'green'
			setTimeout(() => {
				newChannelPlayButton.style.fill = 'none'
			}, recordingData[newChannelIndex][recordingData[newChannelIndex].length - 1][1] - recordingData[newChannelIndex][0][1] + 500)
		}
	}
})

function setupChannelListeners(channelIndex) {
	// Recording Button
	const recordButton = document.querySelector(`#record-btn${channelIndex}`)
	recordButton.addEventListener('click', () => {
		if (isRecording) {
			stopRecording()
			recordButton.style.fill = 'none'
		} else {
			startRecording(channelIndex - 1) // Subtract 1 to match the array index
			recordButton.style.fill = 'red'
		}
	})

	// Playback Button
	const playButton = document.querySelector(`#play-btn${channelIndex}`)
	playButton.addEventListener('click', () => {
		if (!isPlaying && recordingData[channelIndex - 1].length > 0) {
			startPlayback(channelIndex - 1) // Subtract 1 to match the array index
			playButton.style.fill = 'green'

			// Clear style when playback is done
			setTimeout(() => {
				playButton.style.fill = 'none'
			}, recordingData[channelIndex - 1][recordingData[channelIndex - 1].length - 1][1] - recordingData[channelIndex - 1][0][1] + 500)
		}
	})
}
