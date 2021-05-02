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

let nextButton;

// -- Button Setup --
// initial screen
function setupFirstScreen() {
  for (i=0; i<6; i++) {
    const button = new Button({
      text: letterGroups[i].join(''),
      callback: () => enterSecondScreen([...button.text])
    })
    firstScreenButtons.push(button)
  }
  setButtonPositions(firstScreenButtons, verticallyLong)
}

// screen with letter input buttons
function setupSecondScreen() {
  for (i=0; i<6; i++) {
    const button = new Button({ 
      text: '',
      callback: () => letterButtonHandler(button.text)
    })
    secondScreenButtons.push(button)
  }
  // set up back button
  secondScreenButtons[5].updateText('back')

  // set size and positions
  setButtonPositions(secondScreenButtons, verticallyLong)
}

function setupNextButton() {
  nextButton = new Button({
    text: 'NEXT >',
    size: [200, 200],
    position: [600,600],
    color: [255, 0, 0],
    callback: nextButtonHandler
  })
}

// -- Button state change --
function enterSecondScreen(letters) {
  for (i=0; i<letters.length; i++) {
    secondScreenButtons[i].updateText(letters[i])
    secondScreenButtons[i].show()
  }
  for (i=0; i<6; i++) {
    firstScreenButtons[i].hide()
  }
  // group6 case
  for (i=letters.length; i<5; i++) {
    secondScreenButtons[i].updateText('')
    secondScreenButtons[i].show()
  }
  secondScreenButtons[5].show() // back button
}

function exitSecondScreen() {
  for (i=0; i<6; i++) {
    secondScreenButtons[i].hide()
    firstScreenButtons[i].show()
  }
}

// -- Trial Stage Change --
function showWatch() {
  nextButton.show()
  for (i=0; i<6; i++) {
    firstScreenButtons[i].show()
  }
}

function drawWatch() {
  nextButton.draw()
  firstScreenButtons.forEach(button => button.draw())
  secondScreenButtons.forEach(button => button.draw())
}

function hideWatch() {
  for (i=0; i<6; i++) {
    firstScreenButtons[i].hide()
    secondScreenButtons[i].hide()
  }
  nextButton.hide()
}

// -- Handlers --
function nextButtonHandler() {
  nextTrial(); //if so, advance to next trial
}

function letterButtonHandler(letter) {
  if (letter=='')
    return
  else if (letter=='back')
    exitSecondScreen()
  else if (letter=='_') //if underscore, consider that a space bar
    currentTyped = currentTyped + " ";
  else if (letter=='`' & currentTyped.length>0) {//if `, treat that as a delete command
    currentTyped = currentTyped.substring(0, currentTyped.length-1);
    return;
  }
  else if (letter!='`') //if not any of the above cases, add the current letter to the typed string
    currentTyped = currentTyped + letter;
  exitSecondScreen()
}

// -- Utility --
function setButtonPositions(buttons, verticallyLong=true) {
  if (verticallyLong) {
    // vertically long
    buttons.forEach(button => button.updateSize(sizeOfInputArea/3, sizeOfInputArea/2))
    buttons[0].updatePosition(width/2-sizeOfInputArea/2, height/2-sizeOfInputArea/2)
    buttons[1].updatePosition(width/2-sizeOfInputArea/6, height/2-sizeOfInputArea/2)
    buttons[2].updatePosition(width/2+sizeOfInputArea/6, height/2-sizeOfInputArea/2)
    buttons[3].updatePosition(width/2-sizeOfInputArea/2, height/2)
    buttons[4].updatePosition(width/2-sizeOfInputArea/6, height/2)
    buttons[5].updatePosition(width/2+sizeOfInputArea/6, height/2)
  } else {
    // horizontally long
    buttons.forEach(button => button.updateSize(sizeOfInputArea/2, sizeOfInputArea/3))
    buttons[0].updatePosition(width/2-sizeOfInputArea/2, height/2-sizeOfInputArea/2)
    buttons[1].updatePosition(width/2, height/2-sizeOfInputArea/2)
    buttons[2].updatePosition(width/2-sizeOfInputArea/2, height/2-sizeOfInputArea/6)
    buttons[3].updatePosition(width/2, height/2-sizeOfInputArea/6)
    buttons[4].updatePosition(width/2-sizeOfInputArea/2, height/2+sizeOfInputArea/6)
    buttons[5].updatePosition(width/2, height/2+sizeOfInputArea/6)
  }
}
