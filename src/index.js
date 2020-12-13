import "./styles.css";

const audioContext = new (window.webkitAudioContext || window.AudioContext)();
const baseDuration = 0.25;

// Connect all of our audio nodes to this gain node so their volume is lower.
const primaryGainControl = audioContext.createGain();
primaryGainControl.gain.setValueAtTime(0.05, 0);
primaryGainControl.connect(audioContext.destination);

const notes = getNotes();

const playButton = document.createElement("button");
playButton.innerText = "I'll Fly Away";
document.body.appendChild(playButton);
playButton.addEventListener("click", () => {
  const illFlyAway = [
    { note: "B4", duration: 2 },
    { note: "G4", duration: 2 },
    { note: "D4", duration: 2 },
    { note: "G4", duration: 2 },
    { note: "B4", duration: 1 },
    { note: "A4", duration: 1 },
    { note: "B4", duration: 1 },
    { note: "C5", duration: 1 },
    { note: "B4", duration: 2 },
    { note: "A4", duration: 2 },
    { note: "G4", duration: 6 },
    { note: "E4", duration: 2 },
    { note: "D4", duration: 2 },
    { note: "D4", duration: 2 },
    { note: "E4", duration: 2 },
    { note: "G4", duration: 2 },
    { note: "B4", duration: 2 },
    { note: "G4", duration: 2 },
    { note: "D4", duration: 2 },
    { note: "G4", duration: 2 },
    { note: "B4", duration: 1 },
    { note: "A4", duration: 1 },
    { note: "B4", duration: 1 },
    { note: "C5", duration: 1 },
    { note: "B4", duration: 2 },
    { note: "A4", duration: 2 },
    { note: "B4", duration: 6 },
    { note: "A4", duration: 2 },
    { note: "G4", duration: 6 },
    { note: ["G4", "B4", "D4"], duration: 6 }
  ];

  playNotes(illFlyAway);
});
document.body.appendChild(document.createElement("br"));
document.body.appendChild(document.createElement("br"));

const pianoKeys = {};

let sharpFlatChoice = "Sharps";
document.body.dataset.sharpFlatMode = sharpFlatChoice;
const sharpFlatSelect = document.createElement("select");
sharpFlatSelect.innerHTML =
  '<option label="Sharps" value="Sharps" selected=selected/>' +
  '<option label="Flats" value="Flats"/>';

sharpFlatSelect.addEventListener("change", (event) => {
  sharpFlatChoice = event.target.value;
  document.body.dataset.sharpFlatMode = sharpFlatChoice;
});
document.body.appendChild(sharpFlatSelect);
document.body.appendChild(document.createElement("br"));

const keyboard = document.createElement("div");
keyboard.style.position = "relative";
document.body.appendChild(keyboard);

const btnHeight = 20;
const btnWidth = 80;
let btnTop = 0;
notes.forEach(({ name, frequency, sharp, flat }, index) => {
  const noteButton = document.createElement("button");
  pianoKeys[name] = noteButton;
  noteButton.duration = baseDuration; // default
  noteButton.frequency = frequency;
  noteButton.innerText = name;
  if (sharp || flat) noteButton.classList.add(sharp ? "sharp" : "flat");
  noteButton.addEventListener("click", () => playButtonNote(noteButton));

  keyboard.appendChild(noteButton);

  let top = btnTop + btnHeight;
  let left = 0;
  let width = btnWidth;
  if (sharp || flat) {
    top -= 10;
    width = width / 2;
    left += width;
    noteButton.style.zIndex = 100;
  } else {
    btnTop += btnHeight;
  }
  noteButton.style.width = width + "px";
  noteButton.style.height = btnHeight + "px";
  noteButton.style.position = "absolute";
  noteButton.style.left = left + "px";
  noteButton.style.top = top + "px";
  noteButton.style.textAlign = "left";
});
document.body.appendChild(document.createElement("br"));
document.body.appendChild(document.createElement("br"));

function playButtonNote(button) {
  const { frequency, duration } = button;
  button.defaultColor = button.style.color;
  button.defaultBackgroundColor = button.style.backgroundColor;
  button.style.color = "white";
  button.style.backgroundColor = "blue";
  return playNoteByFrequency(frequency, duration).then(() => {
    // reset changes
    button.duration = baseDuration;
    button.style.color = button.defaultColor;
    button.style.backgroundColor = button.defaultBackgroundColor;
  });
}

function playNoteByFrequency(frequency, duration) {
  // Create an oscillator at the note's frequency
  const noteOscillator = audioContext.createOscillator();
  noteOscillator.type = "square"; //"sine";
  noteOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  noteOscillator.connect(primaryGainControl);
  noteOscillator.start();
  noteOscillator.stop(audioContext.currentTime + duration);
  return new Promise((resolve) => setTimeout(resolve, duration * 0.8 * 1000));
}

function playNoteByName(name, duration) {
  if (!duration) duration = 1;
  if (!Array.isArray(name)) name = [name];
  const currentDuration = duration * baseDuration;
  let lastPromise;
  name.forEach((nm) => {
    const button = pianoKeys[nm];
    button.duration = currentDuration;
    lastPromise = playButtonNote(button);
  });
  return lastPromise;
}

function playNotes(notes) {
  if (!notes || notes.length === 0) return;

  const first = notes.shift(); // removes the first note from notes and returns it
  const { note, duration } = first;
  playNoteByName(note, duration).then(() => {
    if (notes.length > 0) {
      playNotes(notes);
    }
  });
}

function getNotes() {
  const notes = [
    { name: "C0", frequency: 16.35 },
    { name: "C#0", frequency: 17.32 },
    { name: "Db0", frequency: 17.32 },
    { name: "D0", frequency: 18.35 },
    { name: "D#0", frequency: 19.45 },
    { name: "Eb0", frequency: 19.45 },
    { name: "E0", frequency: 20.6 },
    { name: "F0", frequency: 21.83 },
    { name: "F#0", frequency: 23.12 },
    { name: "Gb0", frequency: 23.12 },
    { name: "G0", frequency: 24.5 },
    { name: "G#0", frequency: 25.96 },
    { name: "Ab0", frequency: 25.96 },
    { name: "A0", frequency: 27.5 },
    { name: "A#0", frequency: 29.14 },
    { name: "Bb0", frequency: 29.14 },
    { name: "B0", frequency: 30.87 },
    { name: "C1", frequency: 32.7 },
    { name: "C#1", frequency: 34.65 },
    { name: "Db1", frequency: 34.65 },
    { name: "D1", frequency: 36.71 },
    { name: "D#1", frequency: 38.89 },
    { name: "Eb1", frequency: 38.89 },
    { name: "E1", frequency: 41.2 },
    { name: "F1", frequency: 43.65 },
    { name: "F#1", frequency: 46.25 },
    { name: "Gb1", frequency: 46.25 },
    { name: "G1", frequency: 49.0 },
    { name: "G#1", frequency: 51.91 },
    { name: "Ab1", frequency: 51.91 },
    { name: "A1", frequency: 55.0 },
    { name: "A#1", frequency: 58.27 },
    { name: "Bb1", frequency: 58.27 },
    { name: "B1", frequency: 61.74 },
    { name: "C2", frequency: 65.41 },
    { name: "C#2", frequency: 69.3 },
    { name: "Db2", frequency: 69.3 },
    { name: "D2", frequency: 73.42 },
    { name: "D#2", frequency: 77.78 },
    { name: "Eb2", frequency: 77.78 },
    { name: "E2", frequency: 82.41 },
    { name: "F2", frequency: 87.31 },
    { name: "F#2", frequency: 92.5 },
    { name: "Gb2", frequency: 92.5 },
    { name: "G2", frequency: 98.0 },
    { name: "G#2", frequency: 103.83 },
    { name: "Ab2", frequency: 103.83 },
    { name: "A2", frequency: 110.0 },
    { name: "A#2", frequency: 116.54 },
    { name: "Bb2", frequency: 116.54 },
    { name: "B2", frequency: 123.47 },
    { name: "C3", frequency: 130.81 },
    { name: "C#3", frequency: 138.59 },
    { name: "Db3", frequency: 138.59 },
    { name: "D3", frequency: 146.83 },
    { name: "D#3", frequency: 155.56 },
    { name: "Eb3", frequency: 155.56 },
    { name: "E3", frequency: 164.81 },
    { name: "F3", frequency: 174.61 },
    { name: "F#3", frequency: 185.0 },
    { name: "Gb3", frequency: 185.0 },
    { name: "G3", frequency: 196.0 },
    { name: "G#3", frequency: 207.65 },
    { name: "Ab3", frequency: 207.65 },
    { name: "A3", frequency: 220.0 },
    { name: "A#3", frequency: 233.08 },
    { name: "Bb3", frequency: 233.08 },
    { name: "B3", frequency: 246.94 },
    { name: "C4", frequency: 261.63 },
    { name: "C#4", frequency: 277.18 },
    { name: "Db4", frequency: 277.18 },
    { name: "D4", frequency: 293.66 },
    { name: "D#4", frequency: 311.13 },
    { name: "Eb4", frequency: 311.13 },
    { name: "E4", frequency: 329.63 },
    { name: "F4", frequency: 349.23 },
    { name: "F#4", frequency: 369.99 },
    { name: "Gb4", frequency: 369.99 },
    { name: "G4", frequency: 392.0 },
    { name: "G#4", frequency: 415.3 },
    { name: "Ab4", frequency: 415.3 },
    { name: "A4", frequency: 440.0 },
    { name: "A#4", frequency: 466.16 },
    { name: "Bb4", frequency: 466.16 },
    { name: "B4", frequency: 493.88 },
    { name: "C5", frequency: 523.25 },
    { name: "C#5", frequency: 554.37 },
    { name: "Db5", frequency: 554.37 },
    { name: "D5", frequency: 587.33 },
    { name: "D#5", frequency: 622.25 },
    { name: "Eb5", frequency: 622.25 },
    { name: "E5", frequency: 659.25 },
    { name: "F5", frequency: 698.46 },
    { name: "F#5", frequency: 739.99 },
    { name: "Gb5", frequency: 739.99 },
    { name: "G5", frequency: 783.99 },
    { name: "G#5", frequency: 830.61 },
    { name: "Ab5", frequency: 830.61 },
    { name: "A5", frequency: 880.0 },
    { name: "A#5", frequency: 932.33 },
    { name: "Bb5", frequency: 932.33 },
    { name: "B5", frequency: 987.77 },
    { name: "C6", frequency: 1046.5 },
    { name: "C#6", frequency: 1108.73 },
    { name: "Db6", frequency: 1108.73 },
    { name: "D6", frequency: 1174.66 },
    { name: "D#6", frequency: 1244.51 },
    { name: "Eb6", frequency: 1244.51 },
    { name: "E6", frequency: 1318.51 },
    { name: "F6", frequency: 1396.91 },
    { name: "F#6", frequency: 1479.98 },
    { name: "Gb6", frequency: 1479.98 },
    { name: "G6", frequency: 1567.98 },
    { name: "G#6", frequency: 1661.22 },
    { name: "Ab6", frequency: 1661.22 },
    { name: "A6", frequency: 1760.0 },
    { name: "A#6", frequency: 1864.66 },
    { name: "Bb6", frequency: 1864.66 },
    { name: "B6", frequency: 1975.53 },
    { name: "C7", frequency: 2093.0 },
    { name: "C#7", frequency: 2217.46 },
    { name: "Db7", frequency: 2217.46 },
    { name: "D7", frequency: 2349.32 },
    { name: "D#7", frequency: 2489.02 },
    { name: "Eb7", frequency: 2489.02 },
    { name: "E7", frequency: 2637.02 },
    { name: "F7", frequency: 2793.83 },
    { name: "F#7", frequency: 2959.96 },
    { name: "Gb7", frequency: 2959.96 },
    { name: "G7", frequency: 3135.96 },
    { name: "G#7", frequency: 3322.44 },
    { name: "Ab7", frequency: 3322.44 },
    { name: "A7", frequency: 3520.0 },
    { name: "A#7", frequency: 3729.31 },
    { name: "Bb7", frequency: 3729.31 },
    { name: "B7", frequency: 3951.07 },
    { name: "C8", frequency: 4186.01 },
    { name: "C#8", frequency: 4434.92 },
    { name: "Db8", frequency: 4434.92 },
    { name: "D8", frequency: 4698.63 },
    { name: "D#8", frequency: 4978.03 },
    { name: "Eb8", frequency: 4978.03 },
    { name: "E8", frequency: 5274.04 },
    { name: "F8", frequency: 5587.65 },
    { name: "F#8", frequency: 5919.91 },
    { name: "Gb8", frequency: 5919.91 },
    { name: "G8", frequency: 6271.93 },
    { name: "G#8", frequency: 6644.88 },
    { name: "Ab8", frequency: 6644.88 },
    { name: "A8", frequency: 7040.0 },
    { name: "A#8", frequency: 7458.62 },
    { name: "Bb8", frequency: 7458.62 },
    { name: "B8", frequency: 7902.13 }
  ];

  notes.forEach((note) => {
    note.sharp = note.name.includes("#");
    note.flat = note.name.includes("b");
  });

  return notes;
}
