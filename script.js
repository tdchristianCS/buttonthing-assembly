const notes = [];
const canvas1 = $("#canvas-layer-1");
const canvas2 = $("#canvas-layer-2");
const ctx1 = canvas1[0].getContext("2d");
const ctx2 = canvas2[0].getContext("2d");
var score = 0;
var beatIndex = 0;
var beat = 1;
var laneOneNoteNumber = 1;
var laneTwoNoteNumber = 1;
var laneThreeNoteNumber = 1;
var laneFourNoteNumber = 1;
var laneOneClickNumber = 1;
var laneTwoClickNumber = 1;
var laneThreeClickNumber = 1;
var laneFourClickNumber = 1;
var breakLoop = false;

Tone.Transport.bpm.value = bpm * 4;

var generateNotes = new Tone.Loop(generateNote, "4n").start(0);

function generateNote() {
  row = Math.floor((beatMap[beatIndex] - (beatMap[beatIndex] % 10)) / 10);
  while (row == beat) {
    column = beatMap[beatIndex] % 10;
    if (column == 1) {
      notes.push(new Note(laneOneNoteNumber, 1));
      laneOneNoteNumber++;
    } else if (column == 2) {
      notes.push(new Note(laneTwoNoteNumber, 2));
      laneTwoNoteNumber++;
    } else if (column == 3) {
      notes.push(new Note(laneThreeNoteNumber, 3));
      laneThreeNoteNumber++;
    } else if (column == 4) {
      notes.push(new Note(laneFourNoteNumber, 4));
      laneFourNoteNumber++;
    }
    beatIndex++;
    row = Math.floor((beatMap[beatIndex] - (beatMap[beatIndex] % 10)) / 10);
  }
  beat++;
}

function draw() {
  ctx1.fillStyle = "rgb(0, 0, 0)";
  ctx1.fillRect(0, 480, 1105, 40);
  drawD();
  drawF();
  drawJ();
  drawK();
}

class Note {
  constructor(noteNumber, lane) {
    if (lane == 1) {
      this.x = 5;
      this.laneOneBeatNumber = noteNumber;
    } else if (lane == 2) {
      this.x = 280;
      this.laneTwoBeatNumber = noteNumber;
    } else if (lane == 3) {
      this.x = 555;
      this.laneThreeBeatNumber = noteNumber;
    } else if (lane == 4) {
      this.x = 830;
      this.laneFourBeatNumber = noteNumber;
    }
    this.y = -30;
    this.width = 270;
    this.height = 30;
    this.visible = true;
    this.lane = lane;
  }
  draw() {
    if (this.visible == true) {
      ctx2.fillStyle = "rgb(150, 0, 150)";
      ctx2.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  update() {
    ctx2.clearRect(this.x, this.y, this.width, this.height);
    this.y += 10;
    if (this.y >= 650 && this.visible == true) {
      if (this.lane == 1) {
        this.laneOneClear(this.laneOneBeatNumber);
      }
      if (this.lane == 2) {
        this.laneTwoClear(this.laneTwoBeatNumber);
      }
      if (this.lane == 3) {
        this.laneThreeClear(this.laneThreeBeatNumber);
      }
      if (this.lane == 4) {
        this.laneFourClear(this.laneFourBeatNumber);
      }
    }
    this.draw();
  }
  laneOneClear(clickNumber) {
    if (this.laneOneBeatNumber == clickNumber) {
      this.visible = false;
      ctx2.clearRect(this.x, this.y, this.width, this.height);
      laneOneClickNumber++;
      breakLoop = true;
    }
  }
  laneTwoClear(clickNumber) {
    if (this.laneTwoBeatNumber == clickNumber) {
      this.visible = false;
      ctx2.clearRect(this.x, this.y, this.width, this.height);
      laneTwoClickNumber++;
    }
  }
  laneThreeClear(clickNumber) {
    if (this.laneThreeBeatNumber == clickNumber) {
      this.visible = false;
      ctx2.clearRect(this.x, this.y, this.width, this.height);
      laneThreeClickNumber++;
    }
  }
  laneFourClear(clickNumber) {
    if (this.laneFourBeatNumber == clickNumber) {
      this.visible = false;
      ctx2.clearRect(this.x, this.y, this.width, this.height);
      laneFourClickNumber++;
      
    }
  }
}

function updateNote() {
  notes.forEach((Note) => Note.update());
}

function animate() {
  updateNote();
  requestAnimationFrame(animate);
}

function drawClickD() {
  ctx1.fillStyle = "rgb(256, 160, 256)";
  ctx1.fillRect(5, 485, 270, 30);
  setTimeout(drawD, 60);
}
function drawClickF() {
  ctx1.fillStyle = "rgb(256, 160, 256)";
  ctx1.fillRect(280, 485, 270, 30);
  setTimeout(drawF, 60);
}
function drawClickJ() {
  ctx1.fillStyle = "rgb(256, 160, 256)";
  ctx1.fillRect(555, 485, 270, 30);
  setTimeout(drawJ, 60);
}
function drawClickK() {
  ctx1.fillStyle = "rgb(256, 160, 256)";
  ctx1.fillRect(830, 485, 270, 30);
  setTimeout(drawK, 60);
}
function drawD() {
  ctx1.fillStyle = "rgb(256, 200, 256)";
  ctx1.fillRect(5, 485, 270, 30);
}
function drawF() {
  ctx1.fillStyle = "rgb(256, 200, 256)";
  ctx1.fillRect(280, 485, 270, 30);
}
function drawJ() {
  ctx1.fillStyle = "rgb(256, 200, 256)";
  ctx1.fillRect(555, 485, 270, 30);
}
function drawK() {
  ctx1.fillStyle = "rgb(256, 200, 256)";
  ctx1.fillRect(830, 485, 270, 30);
}

window.onload = (event) => {
  draw();
  animate();
};

window.addEventListener("keydown", checkButtonClick, false);

function checkButtonClick(e) {
  if (e.code == "KeyD") {
    drawClickD();
    for (let item of notes) {
      item.laneOneClear(laneOneClickNumber);
      if (breakLoop = true) {
        console.log("break")
        break;
      }
    }
    breakLoop = false;
  }
  if (e.code == "KeyF") {
    drawClickF();
    notes.forEach((Note) => Note.laneTwoClear(laneTwoClickNumber));
  }
  if (e.code == "KeyJ") {
    drawClickJ();
    notes.forEach((Note) => Note.laneThreeClear(laneThreeClickNumber));
  }
  if (e.code == "KeyK") {
    drawClickK();
    notes.forEach((Note) => Note.laneFourClear(laneFourClickNumber));
  }
  if (e.code == "Enter") {
    Tone.Transport.start();
  }
  if (e.code == "Escape") {
    Tone.Transport.stop();
  }
}

