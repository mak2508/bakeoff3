// set up different letter groups
const group1 = ['a', 'b', 'c', 'd', 'e']
const group2 = ['f', 'g', 'h', 'i', 'j']
const group3 = ['k', 'l', 'm', 'n', 'o']
const group4 = ['p', 'q', 'r', 's', 't']
const group5 = ['u', 'v', 'w', 'x', 'y']
const group6 = ['z', '_', '`']
const letterGroups = [group1, group2, group3, group4, group5, group6]

const firstScreenButtons = []
const secondScreenButtons = []
const verticallyLong = true

// initial screen
function setupFirstScreen() {
  for (i=0; i<6; i++) {
    const button = createButton(''.join(letterGroups[i]))
    button.mousePressed(() => enterSecondScreen(letterGroups[i]))
    firstScreenButtons.push(button)
  }
  setButtonPositions(firstScreenButtons, true)
}

// screen with letter input buttons
function setupSecondScreen() {
  for (i=0; i<6; i++) {
    const button = createButton('')
    button.mousePressed(() => letterButtonHandler(button.html()))
    button.hide()
    secondScreenButtons.push(button)
  }
  // set up back button
  secondScreenButtons[5].html('back')

  // set size and positions
  setButtonPositions(secondScreenButtons, true)
}

function enterSecondScreen(letters) {
  for (i=0; i<6; i++) {
    firstScreenButtons[i].hide()
  }
  for (i=0; i<letters.length; i++) {
    secondScreenButtons[i].html(letters[i])
    secondScreenButtons[i].show()
  }
  secondScreenButtons[5].show() // back button
}

function exitSecondScreen() {
  for (i=0; i<6; i++) {
    secondScreenButtons[i].hide()
  }
  for (i=0; i<6; i++) {
    firstScreenButtons[i].show()
  }
}

function setButtonPositions(buttons, verticallyLong=true) {
  if (verticallyLong) {
    // vertically long
    buttons.forEach(button => button.size(sizeOfInputArea/3, sizeOfInputArea/2))
    buttons[0].position(width/2-sizeOfInputArea/2, height/2-sizeOfInputArea/2)
    buttons[1].position(width/2-sizeOfInputArea/6, height/2-sizeOfInputArea/2)
    buttons[2].position(width/2+sizeOfInputArea/6, height/2-sizeOfInputArea/2)
    buttons[3].position(width/2-sizeOfInputArea/2, height/2)
    buttons[4].position(width/2-sizeOfInputArea/6, height/2)
    buttons[5].position(width/2+sizeOfInputArea/6, height/2)
  } else {
    // horizontally long
    buttons.forEach(button => button.size(sizeOfInputArea/2, sizeOfInputArea/3))
    buttons[0].position(width/2-sizeOfInputArea/2, height/2-sizeOfInputArea/2)
    buttons[1].position(width/2, height/2-sizeOfInputArea/2)
    buttons[2].position(width/2-sizeOfInputArea/2, height/2-sizeOfInputArea/6)
    buttons[3].position(width/2, height/2-sizeOfInputArea/6)
    buttons[4].position(width/2-sizeOfInputArea/2, height/2+sizeOfInputArea/6)
    buttons[5].position(width/2, height/2+sizeOfInputArea/6)
  }
}

function setupButtons() {
  //my draw code that you should replace.
  leftButton = createButton('<=')
  leftButton.size(sizeOfInputArea/2, sizeOfInputArea/2)
  leftButton.position(width/2-sizeOfInputArea/2, height/2)
  leftButton.style('background-color', 'rgb(255,0,0)')
  leftButton.mousePressed(leftButtonHandler)
  leftButton.hide()

  rightButton = createButton('=>')
  rightButton.size(sizeOfInputArea/2, sizeOfInputArea/2)
  rightButton.position(width/2, height/2)
  rightButton.style('background-color', 'rgb(0,255,0)')
  rightButton.mousePressed(() => enterSecondScreen(group1))
  rightButton.hide()
  
  textButton = createButton(String.fromCharCode(currentLetter))
  textButton.size(sizeOfInputArea, sizeOfInputArea/2)
  textButton.position(width/2-sizeOfInputArea/2, height/2-sizeOfInputArea/2)
  textButton.mousePressed(() => letterButtonHandler(textButton.html()))
  textButton.hide()

  nextButton = createButton('NEXT >')
  nextButton.size(200, 200)
  nextButton.position(600,600)
  nextButton.style('background-color', 'rgb(255,0,0)')
  nextButton.mousePressed(nextButtonHandler)
  nextButton.hide()
}

function updateButtons() {
  leftButton.show()
  rightButton.show()
  textButton.show()
  textButton.html(String.fromCharCode(currentLetter))
  nextButton.show()
}

// Button Handlers
function textButtonHandler () {
  if (currentLetter=='_'.charCodeAt()) //if underscore, consider that a space bar
    currentTyped = currentTyped + " ";
  else if (currentLetter=='`'.charCodeAt() & currentTyped.length>0) //if `, treat that as a delete command
    currentTyped = currentTyped.substring(0, currentTyped.length-1);
  else if (currentLetter!='`'.charCodeAt()) //if not any of the above cases, add the current letter to the typed string
    currentTyped = currentTyped + String.fromCharCode(currentLetter);
}

function leftButtonHandler () {
  if (currentLetter<=95) //wrap around to z
    currentLetter = 'z'.charCodeAt();
  else
  currentLetter--;
}

function rightButtonHandler () {
  if (currentLetter>=122) //wrap back to space (aka underscore)
      currentLetter = '_'.charCodeAt();
  else
  currentLetter++;
}

function nextButtonHandler() {
  nextTrial(); //if so, advance to next trial
}

function letterButtonHandler(letter) {
  if (letter=='back')
    exitSecondScreen();
  else if (letter=='_') //if underscore, consider that a space bar
    currentTyped = currentTyped + " ";
  else if (letter=='`' & currentTyped.length>0) //if `, treat that as a delete command
    currentTyped = currentTyped.substring(0, currentTyped.length-1);
  else if (letter!='`') //if not any of the above cases, add the current letter to the typed string
    currentTyped = currentTyped + letter;
}