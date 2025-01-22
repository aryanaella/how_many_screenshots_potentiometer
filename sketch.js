let port;
let connectBtn;
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

let textRow = 50;

function NavigationPreloadManager() {
  img = loadImage()
}

function setup() {
  compressedGraphics = createGraphics(320, 240);

  cnv = createCanvas(800, 1000);

  port = createSerial();
  connectBtn = createButton('Connect to Arduino');
  connectBtn.position(200, 200);
  connectBtn.style('font-size', '30px');
  connectBtn.style('background-color', 'yellow');
  connectBtn.mousePressed(connectBtnClick);

  recogniseBtn = createButton("I can't recognise myself!")
  recogniseBtn.position(410, 10);
  recogniseBtn.style('font-size', '30px');
  recogniseBtn.style('background-color', 'red');
  recogniseBtn.hide();
  recogniseBtn.mousePressed(saveImage);

  capture = createCapture(VIDEO, {flipped:true});
  capture.size(320, 240);
  capture.hide();

  hold = createImage(320, 240);
}

function draw() {
  let val = port.readUntil("\n");
  if (val.length > 0) {
    myVal = val;
    console.log(myVal);
  }

  compressionFactor = map(myVal, 0, 1100, 0.01, 0.15);
  compressions = map(myVal, 0, 1100, 100, 0);

  let posterization = map(myVal, 0, 1100, 2, 20);
  
  let compressedWidth = capture.width * compressionFactor;
  let compressedHeight = capture.height * compressionFactor;
  
  // compressedGraphics = createGraphics(compressedWidth, compressedHeight);
  compressedGraphics.resizeCanvas(compressedWidth, compressedHeight);
  compressedGraphics.image(capture, 0, 0, compressedGraphics.width, compressedGraphics.height);
  compressedGraphics.filter(POSTERIZE, posterization);
  
  if(portConnected) {
  image(compressedGraphics, 0, 0, 400, 300);
  recogniseBtn.show();
  }

  image(hold, 0, 300, 400, 300);
}

function saveImage() {
  if(imageSaved) {
    textRow += 50;
  }
  imageSaved = true;
  hold = compressedGraphics.get(0, 0, compressedGraphics.width, compressedGraphics.height);
  console.log('Screenshot taken');
  textSize(20);
  text("you couldn't recognise yourself screenshotted " + compressions + " times", 400, textRow, 400);

  print(posterization);
}

function connectBtnClick() {
  if (!port.opened()) {
    portConnected = true;
    port.open('Arduino', 600);
    connectBtn.hide();
  } else {
    port.close();
  }
  if (port.close()) {
    connectBtn.show();
  }
}
