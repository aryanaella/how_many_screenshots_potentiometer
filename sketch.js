let connectBtn;
let slider;
let myVal = 0;

let capture;
let compressedGraphics;
let compressionFactor = 1;
let compressions = 0;
let portConnected = false;
let imageSaved = false;

let recogniseBtn;
let cnv;
let hold;
let posterization;

let textRow = 50;


function setup() {
  compressedGraphics = createGraphics(320, 240);

  cnv = createCanvas(800, 1000);

  connectBtn = createButton('START');
  connectBtn.position(200, 200);
  connectBtn.style('font-size', '30px');
  connectBtn.style('background-color', 'yellow');
  connectBtn.mousePressed(connectBtnClick);

  recogniseBtn = createButton("I can't recognise myself!")
  recogniseBtn.position(410, 5);
  recogniseBtn.style('font-size', '30px');
  recogniseBtn.style('background-color', 'red');
  recogniseBtn.hide();
  recogniseBtn.mousePressed(saveImage);

  saveButton = createButton('save image');
  saveButton.position(120, 680);
  saveButton.style('font-size', '30px');
  saveButton.style('background-color', 'pink')
  saveButton.hide();
  saveButton.mousePressed(downloadImage);

  capture = createCapture(VIDEO, {flipped:true});
  capture.size(320, 240);
  capture.hide();

  slider = createSlider(0, 1100, 1);
  slider.position(20, 15);
  slider.size(350);
  slider.hide();

  hold = createImage(320, 240);
}

function draw() {
  myVal = slider.value();
  
  compressionFactor = map(myVal, 0, 1100, 0.15, 0.01);
  compressions = map(myVal, 0, 1100, 0, 100);

  let posterization = map(myVal, 0, 1100, 15, 1.5);
  
  let compressedWidth = capture.width * compressionFactor;
  let compressedHeight = capture.height * compressionFactor;
  
  // compressedGraphics = createGraphics(compressedWidth, compressedHeight);
  compressedGraphics.resizeCanvas(compressedWidth, compressedHeight);
  compressedGraphics.image(capture, 0, 0, compressedGraphics.width, compressedGraphics.height);
  compressedGraphics.filter(POSTERIZE, posterization);
  
  if(portConnected) {
  image(compressedGraphics, 0, 50, 400, 300);
  recogniseBtn.show();
  slider.show();
  }

  image(hold, 0, 349, 400, 300);
}

function saveImage() {
  if(imageSaved) {
    textRow += 50;
    if(textRow >= 1000) {
      textRow = 50;
      background(255);
    }
  }
  imageSaved = true;
  saveButton.show();
  hold = compressedGraphics.get(0, 0, compressedGraphics.width, compressedGraphics.height);
  console.log('Screenshot taken');
  textSize(20);
  text("you couldn't recognise yourself screenshotted " + compressions + " times", 410, textRow, 400);

  print(posterization);
}

function connectBtnClick() {
  portConnected = true;
  textSize(20);
  text('loading...', 150, 150);
  connectBtn.hide();
}

function downloadImage() {
  save(hold, 'screeshotted');
}
