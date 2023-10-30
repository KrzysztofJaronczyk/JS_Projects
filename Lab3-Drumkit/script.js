const KeyToSound = {
    'a': document.querySelector('#s1'),
    's': document.querySelector('#s2'),
    'd': document.querySelector('#s3'),
    'f': document.querySelector('#s4'),
    'g': document.querySelector('#s5'),
    'h': document.querySelector('#s6'),
    'j': document.querySelector('#s7'),
    'k': document.querySelector('#s8'),
    'l': document.querySelector('#s9')
}

// Create an array to store recording data for each channel
const recordingData = [];

// Create an array to store selected channels
const selectedChannels = [];

// Recording and Playback
let isRecording = false;
let isPlaying = false;

document.addEventListener('keypress', function (e) {
    if (isRecording) {
        recordChannelData(e.key, Date.now());
        console.log(recordingData);
    }
    playSound(e.key);
});

function playSound(key) {
    const audioTag = KeyToSound[key];
    if (audioTag) {
        audioTag.currentTime = 0;
        audioTag.play();
    }
}

// Record and Playback Buttons
const recordBtns = document.querySelectorAll('.canal svg[id^="record-btn"]');
const playBtns = document.querySelectorAll('.canal svg[id^="play-btn"]');

recordBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        if (isRecording) {
            stopRecording();
            btn.style.fill = 'none';
        } else {
            startRecording(index);
            btn.style.fill = 'red';
        }
    });
});

playBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        if (!isPlaying && recordingData[index].length > 0) {
            startPlayback(index);
            btn.style.fill = 'green';
        }
    });
});

function startRecording(channelIndex) {
    isRecording = true;
    isPlaying = false; // Stop playback if it's in progress
    recordingData[channelIndex] = []; // Clear previous recording
}

function stopRecording() {
    isRecording = false;
}

function recordChannelData(key, timestamp) {
    recordingData.forEach((channel, index) => {
        if (isRecording && index === recordingData.length - 1) {
            channel.push([key, timestamp]);
        }
    });
}

function startPlayback(channelIndex) {
    if (recordingData[channelIndex] && recordingData[channelIndex].length > 0) {
        let startTime = recordingData[channelIndex][0][1];
        recordingData[channelIndex].forEach((sound) => {
            const delay = sound[1] - startTime;
            setTimeout(() => {
                playSound(sound[0]);
            }, delay);
        });
    }
}

// Play Selected Channels Button
const playSelectedButton = document.getElementById('play-selected');
playSelectedButton.addEventListener('click', () => {
    console.log(selectedChannels);
    // Play all selected channels
    selectedChannels.forEach((channelIndex) => {
        startPlayback(channelIndex);
        playBtns[channelIndex].style.fill = 'green';
    });
});

// Play All Channels Button
const playAllButton = document.getElementById('play-all');
playAllButton.addEventListener('click', () => {
    // Play all channels
    playBtns.forEach((btn, index) => {
        if (recordingData[index].length > 0) {
            startPlayback(index);
            btn.style.fill = 'green';
        }
    });
});

// Checkbox event listeners to track selected channels
const checkboxes = document.querySelectorAll('.canal input[type="checkbox"]');
checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', (event) => {
        if (event.target.checked) {
            selectedChannels.push(index);
        } else {
            const selectedIndex = selectedChannels.indexOf(index);
            if (selectedIndex > -1) {
                selectedChannels.splice(selectedIndex, 1);
            }
        }
    });
});
