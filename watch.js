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
const verticallyLong = false

// initial screen
function setupFirstScreen() {
  for (i=0; i<6; i++) {
    const button = createButton(letterGroups[i].join(''))
    console.log(letterGroups[i])
    button.mousePressed(() => enterSecondScreen([...button.html()]))
    button.hide()
    firstScreenButtons.push(button)
  }
  setButtonPositions(firstScreenButtons, verticallyLong)
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
  setButtonPositions(secondScreenButtons, verticallyLong)
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

function setupNextButton() {
  nextButton = createButton('NEXT >')
  nextButton.size(200, 200)
  nextButton.position(600,600)
  nextButton.style('background-color', 'rgb(255,0,0)')
  nextButton.mousePressed(nextButtonHandler)
  nextButton.hide()
}

function showWatch() {
  nextButton.show()
  for (i=0; i<6; i++) {
    firstScreenButtons[i].show()
  }
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