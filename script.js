// Canvas for graphics (similar to a window in Pygame)
const canvas1 = $("#canvas-layer-1");
const canvas2 = $("#canvas-layer-2");

// Each canvas has a "drawing context" (similar to a Surface in pygame)
const ctx1 = canvas1[0].getContext("2d");
const ctx2 = canvas2[0].getContext("2d");

// graphical constants
const canvasW = 1105;
const canvasH = 650;
const laneH = 480;
const laneW = 275;
const noteOffsetX = 5;
const noteOffsetY = 5;
const buttonY = laneH + noteOffsetY;
const buttonW = laneW - noteOffsetX;
const buttonH = 30;
const noteWidth = laneW - noteOffsetX;

// colors
const noteColor = "rgb(140, 255, 244)";
const buttonNormalColor = "rgb(66, 251, 155)";
const buttonClickColor = "rgb(219, 255, 241)";
const textNormalColor = "rgb(0, 0, 0)";
const textClickColor = "rgb(0, 0, 0)";
const lineColor = "rgb(0, 0, 0)";

// App variables. We use var to make them global.
// If they were const, they'd be global but couldn't change
var combo = 0;
var score = 0;
var beatIndex = 0;
var beat = 1;
var comboMultiplier = 1;
var beatBase = 10;
var notes = [];
var currentSong = "";
var state = 0; // 0 - stopped. 1 - playing.

// NoteNumbers are unique IDs for each note, independent by column
// e.g. 3 consecutive notes in column 1 will be numbered 1, 2, 3
var laneNoteNumbers = [1, 1, 1, 1];
var laneClickNumbers = [1, 1, 1, 1];

// Timing/speed/FPS values
let frames_per_second = 30;
let previousTime = performance.now();
let frameInterval = 1_000 / frames_per_second;
var deltaTimeOffset = 1;
let deltaTime = 0;

const updateScore = () => {
    let text = `Score = ${score} | Combo x${combo}`;
    document.getElementById("score-display").innerHTML = text;
}

function showHelp() {
    $('#helpWrap').removeClass('hide');
    $('#back-button').removeClass('hide');
    $('#canvasWrap').addClass('hide');
    $('#help-button').addClass('hide');
}

function hideHelp() {
    $('#helpWrap').addClass('hide');
    $('#back-button').addClass('hide');
    $('#canvasWrap').removeClass('hide');
    $('#help-button').removeClass('hide');
}

function playNote() {
    var noteTap = new Audio("../Assets/sound_effects/note_tap.mp3");
    noteTap.play();
}

// I coded this part flawlessly in 5 minutes and now I have no idea what this does
function generateNote() {

    // All columns of order > 1 are the row (beat) #
    row = Math.floor((currentSong.beatMap[beatIndex] - (currentSong.beatMap[beatIndex] % beatBase)) / beatBase);
    while (row === beat) {

        // Get the ones column of the beat; this is equivalent to the lane
        // Always 1, 2, 3, 4
        column = currentSong.beatMap[beatIndex] % beatBase;

        // Create and push a new note in the appropriate column, incrementing the note count in that column
        notes.push(new Note(laneNoteNumbers[column - 1], column));
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
        if (!this.visible) {
            return;
        }
        ctx2.fillStyle = noteColor;
        ctx2.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        //increases y value and calls draw function
        ctx2.clearRect(this.x, this.y - 10, this.width, this.height + 10);
        this.y += currentSong.noteSpeed * deltaTimeOffset;
        //clears note if it falls off screen
        if ((this.y >= 650) && this.visible) {
            this.clearLane();
        }
        this.draw();
    }

    clearLane() {
        this.visible = false;
        ctx2.clearRect(this.x, this.y, this.width, this.height);
        if (combo >= 50) {
            comboMultiplier = 3;
        } else if (combo >= 10) {
            comboMultiplier = 2;
        }
        if (this.y < 485 + 75 && this.y > 485 - 75) {
            score += 10 * comboMultiplier;
            combo++;
        } else if (this.y < 485 + 115 && this.y > 485 - 115) {
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

const noteToLanes = {
    "KeyD": [1, drawClickD],
    "KeyF": [2, drawClickF],
    "KeyJ": [3, drawClickJ],
    "KeyK": [4, drawClickK],
};

function drawBackground() {
    ctx1.fillStyle = lineColor;
    ctx1.fillRect(0, laneH, (laneW * 4) + noteOffsetX, 40);
    for (let i = 0; i < 3; i++) {
        ctx1.fillRect((i + 1) * laneW, 0, 5, 650);
    }
}

function drawButtons() {
    drawD();
    drawF();
    drawJ();
    drawK();
}

function drawButton(x, text, buttonColor, textColor) {
    ctx1.fillStyle = buttonColor;
    ctx1.fillRect(x, buttonY, buttonW, buttonH);

    ctx1.font = "30px Segoe UI";
    ctx1.fillStyle = textColor;
    ctx1.fillText(text, x + ((buttonW / 2) - 10), (buttonY + 25));
}

function drawNormalButton(x, text) {
    drawButton(x, text, buttonNormalColor, textNormalColor);
}

function drawClickButton(x, text, resumeCB) {
    drawButton(x, text, buttonClickColor, textClickColor);
    setTimeout(resumeCB, 60);
}

function drawD() {
    drawNormalButton(noteOffsetX + (laneW * 0), "D");
}

function drawF() {
    drawNormalButton(noteOffsetX + (laneW * 1), "F");
}

function drawJ() {
    drawNormalButton(noteOffsetX + (laneW * 2), "J");
}

function drawK() {
    drawNormalButton(noteOffsetX + (laneW * 3), "K");
}

function drawClickD() {
    drawClickButton(noteOffsetX + (laneW * 0), "D", drawD);
}

function drawClickF() {
    drawClickButton(noteOffsetX + (laneW * 1), "F", drawF);
}

function drawClickJ() {
    drawClickButton(noteOffsetX + (laneW * 2), "J", drawJ);
}

function drawClickK() {
    drawClickButton(noteOffsetX + (laneW * 3), "K", drawK);
}

function getMousePosOnCanvas(canvas, e) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function handleLaneClick (e) {
    if (state !== 1) {
        return;
    }

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

function start () {
    combo = 0;
    score = 0;
    beatIndex = 0;
    beat = 1;
    comboMultiplier = 1;
    beatBase = 10;
    notes = [];
    currentSong = "";

    state = 1;

    currentSong = songs[$('#song-select').find(":selected").val()];
    const notesPerBeat = currentSong.notesPerBeat;
    transport.bpm.value = currentSong.bpm * notesPerBeat;

    currentSongLoop = new Tone.Loop(generateNote, "4n").start(2);
    currentSongPlayer = new Audio(currentSong.audioFile);
    currentSongPlayer.currentTime = 0;

    transport.schedule((time) => {
        currentSongPlayer.play();
    }, currentSong.offset);

    transport.start();
    updateScore();
    updateButtonStates();
}

function stop() {
    console.log('Stopped at this score: ', score);

    state = 0;

    transport.stop();
    transport.cancel(); // kills scheduled events
    currentSongPlayer.pause();
    currentSongPlayer.currentTime = 0;

    ctx2.clearRect(0, 0, canvasW, canvasH);
    updateScore();
    updateButtonStates();
}

function updateButtonStates() {
    $('#btnStart').prop('disabled', state === 1);
    $('#btnStop').prop('disabled', state === 0);
    $('#btnHelp').prop('disabled', state === 1);
    $('#btnBack').prop('disabled', state === 1);
    $('#song-select').prop('disabled', state === 1);
}

function handleCanvasClick(e) {
    let pos = getMousePosOnCanvas(e.target, e);
    console.log(pos);
}

function handleKeydown(e) {
    if (Object.keys(noteToLanes).includes(e.code)) {
        handleLaneClick(e);
    }

    else if (e.code === "Enter") {
        start();
    }

    else if (e.code === "Escape") {
        stop();
    }

    updateScore();
}

function bind() {
    $(document).keydown(handleKeydown);
    // $('#canvas-layer-2').click(handleCanvasClick);
    $('#btnStart').click(start);
    $('#btnStop').click(stop);
    $('#btnHelp').click(showHelp);
    $('#btnBack').click(hideHelp);
}

function init() {
    bind();
    draw();
    animate();
    updateScore();
    updateButtonStates();
}

const transport = Tone.getTransport();
var currentSongLoop = null;
var currentSongPlayer = null;
$(document).ready(init);
