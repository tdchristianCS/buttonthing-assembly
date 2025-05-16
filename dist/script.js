const currentSong = fight_song;
// Collection of the notes that fall
const notes = [];

// Canvas for graphics (similar to a window in Pygame)
const canvas1 = $("#canvas-layer-1");
const canvas2 = $("#canvas-layer-2");

const noteColor = "rgb(140, 255, 244)";
const buttonColor = "rgb(66, 251, 155)";
const buttonClickColor = "rgb(219, 255, 241)";
const lineColor = "rgb(0, 0, 0)";

const notesPerBeat = currentSong.notesPerBeat;

// Each canvas has a "drawing context" (similar to a Surface in pygame)
const ctx1 = canvas1[0].getContext("2d");
const ctx2 = canvas2[0].getContext("2d");

// graphical constants
const noteOffsetX = 5;
const noteWidth = 270;

// App variables. We use var to make them global.
// If they were const, they'd be global but couldn't change
var combo = 0;
var score = 0;
var beatIndex = 0;
var beat = 1;
var comboMultiplier = 1;
const beatBase = 10;

// NoteNumbers are unique IDs for each note, independent by column
// e.g. 3 consecutive notes in column 1 will be numbered 1, 2, 3
var laneNoteNumbers = [1, 1, 1, 1];

var laneClickNumbers = [1, 1, 1, 1];

// Timing/speed/FPS values
let frames_per_second = 30;
let previousTime = performance.now();
let frameInterval = 1000 / frames_per_second;
var deltaTimeOffset = 1;
let deltaTime = 0;

// Tone...
Tone.Transport.bpm.value = currentSong.bpm * notesPerBeat;
document.getElementById("score-display").innerHTML = 'Score = 0 | Combo x0'

function showHelp() {
  $('#help').removeClass('hide');
  $('#game').addClass('hide');
}

function hideHelp() {
  $('#help').addClass('hide');
  $('#game').removeClass('hide');
}

$('#help-button').click(showHelp);
$('#back-button').click(hideHelp);

var generateNotes = new Tone.Loop(generateNote, "4n").start(2);

var audioPlayer = new Audio(currentSong.audioFile);

function playNote() {
  var noteTap = new Audio("../Assets/sound_effects/note_tap.mp3");
  noteTap.play();
}

Tone.Transport.schedule((time) => {
  audioPlayer.play();
}, currentSong.offset);


// I coded this part flawlessly in 5 minutes and now I have no idea what this does
function generateNote() {

  // All columns of order > 1 are the row (beat) #
  row = Math.floor((currentSong.beatMap[beatIndex] - (currentSong.beatMap[beatIndex] % beatBase)) / beatBase);
  while (row == beat) {

    // Get the ones column of the beat; this is equivalent to the lane
    // Always 1, 2, 3, 4
    column = currentSong.beatMap[beatIndex] % beatBase;

    // Create and push a new note in the appropriate column, incrementing the note count in that column
    notes.push(new Note(laneNoteNumbers[column - 1], column));
    if (column == 1){
    }
    laneNoteNumbers[column - 1]++;
    beatIndex++;
    row = Math.floor((currentSong.beatMap[beatIndex] - (currentSong.beatMap[beatIndex] % beatBase)) / beatBase);
  }
  beat++;
}

function draw() {
  drawBackground();
  drawButtons();
}

class Note {
  noteNumber;
  lane;
  x;
  y;
  width;
  height;
  visible;
  laneBeatNumbers;

  //create notes, each lane is independent from each other
  constructor(noteNumber, lane) {
    this.laneBeatNumbers = [0, 0, 0, 0];
    this.laneBeatNumbers[lane - 1] = noteNumber;

    this.y = -30;
    this.width = 270;
    this.height = 30;
    this.visible = true;
    this.lane = lane;
    this.x = this.getX();

  }

  getX() {
    return noteOffsetX + ((noteOffsetX + noteWidth) * (this.lane - 1));
  }

  /*
  called in update, draws note according to new y value when called
  */
  draw() {
    if (!this.visible) { return; }
    ctx2.fillStyle = noteColor;
    ctx2.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    //increases y value and calls draw function
    ctx2.clearRect(this.x, this.y - 10, this.width, this.height + 10);
    this.y += 25 * deltaTimeOffset;
    //clears note if it falls off screen
    if ((this.y >= 650) && this.visible) {
      this.clearLane();
    }
    this.draw();
  }
  clearLane() {
    this.visible = false;
    ctx2.clearRect(this.x, this.y, this.width, this.height);
    if (combo >= 100) {
      comboMultiplier = 3
    }
    else if (combo >= 20) {
      comboMultiplier = 2
    }
    if (this.y < 485 + 75 && this.y > 485 - 75) {
      score += 10 * comboMultiplier;
      combo ++;
    } else if (this.y < 485 + 115 && this.y > 485 - 115) {
      score += 5;
      combo = 0;
    } else {
      combo = 0;
    }
    laneClickNumbers[this.lane - 1]++;

  }
}

function updateNotes() {
  notes.forEach((Note) => Note.update());
}

function animate(currentTime) {
  deltaTime = currentTime - previousTime;
  deltaTimeOffset = deltaTime / frameInterval;
  updateNotes();
  previousTime = currentTime;
  requestAnimationFrame(animate);
}

function drawClickD() {
  ctx1.fillStyle = buttonClickColor;
  ctx1.fillRect(5, 485, 270, 30);
  setTimeout(drawD, 60);
}
function drawClickF() {
  ctx1.fillStyle = buttonClickColor;
  ctx1.fillRect(280, 485, 270, 30);
  setTimeout(drawF, 60);
}
function drawClickJ() {
  ctx1.fillStyle = buttonClickColor;
  ctx1.fillRect(555, 485, 270, 30);
  setTimeout(drawJ, 60);
}
function drawClickK() {
  ctx1.fillStyle = buttonClickColor;
  ctx1.fillRect(830, 485, 270, 30);
  setTimeout(drawK, 60);
}

function drawBackground() {
  ctx1.fillStyle = lineColor;
  ctx1.fillRect(0, 480, 1105, 40);
  ctx1.fillRect(275, 0, 5, 650);
  ctx1.fillRect(550, 0, 5, 650);
  ctx1.fillRect(825, 0, 5, 650);
}

function drawButtons() {
  drawD();
  drawF();
  drawJ();
  drawK();
}

function drawD() {
  ctx1.fillStyle = buttonColor;
  ctx1.fillRect(5, 485, 270, 30);
}
function drawF() {
  ctx1.fillStyle = buttonColor;
  ctx1.fillRect(280, 485, 270, 30);
}
function drawJ() {
  ctx1.fillStyle = buttonColor;
  ctx1.fillRect(555, 485, 270, 30);
}
function drawK() {
  ctx1.fillStyle = buttonColor;
  ctx1.fillRect(830, 485, 270, 30);
}

window.onload = (event) => {
  draw();
  animate();
}

window.addEventListener("keydown", checkButtonClick, false);

function checkButtonClick(e) {
  let noteToLanes = {
    "KeyD": [1, drawClickD],
    "KeyF": [2, drawClickF],
    "KeyJ": [3, drawClickJ],
    "KeyK": [4, drawClickK],
  };
  

  if (Object.keys(noteToLanes).includes(e.code)) {
    let dataSet = noteToLanes[e.code];
    let lane = dataSet[0];
    let drawClick = dataSet[1];  
    let breakLoop = false;
    drawClick();
    playNote();
    for (let note of notes) {
      if ((note.laneBeatNumbers[lane - 1] === laneClickNumbers[lane - 1]) && !breakLoop && (note.y > 300)) {
        note.clearLane();
        breakLoop = true;
      }
    }
  }  

  if (e.code == "Enter") {
    Tone.Transport.start();
  }
  if (e.code == "Escape") {
    Tone.Transport.stop();
  }

  document.getElementById('score-display').innerHTML = 'Score = ' + score + ' | Combo x' + combo;
}
