let currentFillColor;
let currentStrokeColor;
let mode = null; // 'draw', 'write', or null
let inputBox = null;

let answerBoxes = [];
let selectedBox = null;
let drawing = false; // whether currently drawing

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(241, 241, 181);

  currentFillColor = color(0);
  currentStrokeColor = color(255);
}

function draw() {
  background(241, 241, 181);

  // title, caption
  fill(170, 41, 46);
  textAlign(CENTER, TOP);
  textSize(25);
  text("HORTA: Carrier Bag / Public Library / Live Archive", width / 2, 60);

  textSize(20);
  text("A collection of stories of people's intimate, cultural and social relationships to food", width / 2, 100);

  // explanation
  textAlign(LEFT, TOP);
  textSize(16);
  text("Answer any amount of the following questions. To do so, create an answer box by clicking on the colored square correspondant to the question you are answering and then click again anywhere on the canvas to place your box.", 15, 160);
  text("To answer, you are welcome to use ", 15, 190);

  // questions
  textSize(15);
  text("What is your earliest memory related to food?", 55, 250);
  text("What is a food you are proud of? (It can be a recipe, something you learned from a dear one, a dish you really enjoy from your culture...)?", 55, 290);
  text("What is a food you like sharing with others? Cooking for others, cooking with others, eating with others?", 55, 330);
  text("What is a food you like sharing with yourself?", 55, 370);
  text("What is some food knowledge - a way of cooking, a way of picking, a way of eating - that you have learned informally?", 55, 410);

  // color selectors
  answerBoxSelection(30, 255, 255, 182, 193);
  answerBoxSelection(30, 295, 144, 238, 144);
  answerBoxSelection(30, 335, 255, 192, 103);
  answerBoxSelection(30, 375, 143, 217, 251);
  answerBoxSelection(30, 415, 177, 156, 217);

  // draw all boxes
  for (let box of answerBoxes) {
    drawAnswerBox(box);
  }

  // buttons
  drawButton(325, 197.5, "drawing", mode === "draw");
  drawButton(435, 197.5, "writing", mode === "write");

  // handle drawing
  if (mode === "draw" && drawing && selectedBox) {
    if (mouseInsideBox(selectedBox, mouseX, mouseY)) {
      let path = selectedBox.paths[selectedBox.paths.length - 1];
      path.push({ x: mouseX, y: mouseY });
    }
  }
}

function mousePressed() {
  // Check mode buttons
  if (overButton(325, 197.5, 100, 25)) {
    toggleMode("draw");
    return;
  } else if (overButton(435, 197.5, 100, 25)) {
    toggleMode("write");
    return;
  }

  // Check color selectors
  if (mouseX >= 15 && mouseX <= 45 && mouseY >= 240 && mouseY <= 270) {
    currentFillColor = color(255, 182, 193);
    return;
  } else if (mouseX >= 15 && mouseX <= 45 && mouseY >= 280 && mouseY <= 310) {
    currentFillColor = color(144, 238, 144);
    return;
  } else if (mouseX >= 15 && mouseX <= 45 && mouseY >= 320 && mouseY <= 350) {
    currentFillColor = color(255, 192, 103);
    return;
  } else if (mouseX >= 15 && mouseX <= 45 && mouseY >= 360 && mouseY <= 390) {
    currentFillColor = color(143, 217, 251);
    return;
  } else if (mouseX >= 15 && mouseX <= 45 && mouseY >= 400 && mouseY <= 430) {
    currentFillColor = color(177, 156, 217);
    return;
  }

  // Check if clicked inside any existing answer box
  let clickedBox = null;
  for (let box of answerBoxes) {
    if (mouseInsideBox(box, mouseX, mouseY)) {
      clickedBox = box;
      break;
    }
  }

  // remove textarea if it exists (though we don’t use it anymore)
  if (inputBox) {
    if (selectedBox) selectedBox.text = inputBox.value();
    inputBox.remove();
    inputBox = null;
  }

  if (clickedBox) {
    selectedBox = clickedBox;

    // If in draw mode, start a new path
    if (mode === "draw") {
      drawing = true;
      selectedBox.paths.push([]);
    }
  } else {
    // Create new box
    let newBox = {
      x: mouseX,
      y: mouseY,
      w: 100,
      h: 100,
      fillColor: currentFillColor,
      paths: [],
      text: ""
    };
    answerBoxes.push(newBox);
    selectedBox = newBox;

    if (mode === "draw") {
      drawing = true;
      selectedBox.paths.push([]);
    }
  }
}

function mouseReleased() {
  drawing = false;
}

function keyTyped() {
  // Typing directly inside selected box
  if (mode === "write" && selectedBox) {
    // ignore special keys like backspace
    if (key.length === 1) {
      selectedBox.text += key;
    }
  }
}

function keyPressed() {
  // Handle backspace
  if (mode === "write" && selectedBox && keyCode === BACKSPACE) {
    selectedBox.text = selectedBox.text.slice(0, -1);
  }
}

function mouseInsideBox(box, x, y) {
  return (
    x > box.x - box.w / 2 &&
    x < box.x + box.w / 2 &&
    y > box.y - box.h / 2 &&
    y < box.y + box.h / 2
  );
}

function toggleMode(newMode) {
  if (mode === newMode) {
    mode = null;
  } else {
    mode = newMode;
  }
  if (inputBox) {
    if (selectedBox) selectedBox.text = inputBox.value();
    inputBox.remove();
    inputBox = null;
  }
}

function drawAnswerBox(box) {
  rectMode(CENTER);

  // Selected box stroke (like second code)
  if (box === selectedBox) {
    stroke(170, 41, 46);
    strokeWeight(2);
  } else {
    noStroke();
  }

  fill(box.fillColor);
  rect(box.x, box.y, box.w, box.h);

  // Draw stored paths (drawings)
  noFill();
  stroke(170, 41, 46);
  strokeWeight(2);
  for (let path of box.paths) {
    beginShape();
    for (let pt of path) {
      vertex(pt.x, pt.y);
    }
    endShape();
  }

  // Draw text
  noStroke();
  fill(170, 41, 46);
  textAlign(CENTER, TOP);
  textSize(10);
  text(box.text, box.x, box.y, box.w, box.h);
}

function answerBoxSelection(x, y, r, g, b) {
  noStroke();
  fill(r, g, b);
  rectMode(CENTER);
  rect(x, y, 30, 30);
}

function drawButton(x, y, label, active) {
  rectMode(CENTER);
  stroke(170, 41, 46);
  strokeWeight(1);
  fill(active ? color(170, 41, 46, 50) : color(255));
  rect(x, y, 100, 25, 6);

  noStroke();
  fill(170, 41, 46);
  textAlign(CENTER, CENTER);
  textSize(14);
  text(label, x, y);
}

function overButton(x, y, w, h) {
  return mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2;
}
