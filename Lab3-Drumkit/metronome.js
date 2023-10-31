//metronome
const metronome = document.getElementById('metronome');
//s19 and s23 are the metronome sounds
const s19 = document.getElementById('s19');
const s23 = document.getElementById('s23');

let metronomeSpeed = 1000;
let metronomeState = false;
let metronomeCounter = 0;
function metronomePlay() {
    if (metronomeState) {
        metronomeCounter++;
        
        if (metronomeCounter % 4 == 0) {
            s23.play();
        } else {
            s19.play();
        }
        setTimeout(metronomePlay, metronomeSpeed);
    }
}
//on click metronome
metronome.addEventListener('click', () => {
    metronomeState = !metronomeState;
    if (metronomeState) {
        metronomePlay();
        metronome.classList.add('metronome-active');
    } else {
        metronome.classList.remove('metronome-active');
    }
});