// set up different letter groups
const group1 = ['a', 'e', 'i', 'o', 'u', 'y']
const group2 = ['b', 'c', 'd', 'f', 'g']
const group3 = ['h', 'j', 'k', 'l', 'm']
const group4 = ['n', 'p', 'q', 'r', 's']
const group5 = ['t', 'v', 'w', 'x', 'z']

const letterGroups = [group1, group2, group3, group4, group5]

const firstScreenButtons = []
const secondScreenButtons = []

let nextButton;

let inFirstScreen = true

// -- Button Setup --
// initial screen
function setupFirstScreen() {
  for (i=0; i<5; i++) {
    const button = new Button({
      text: letterGroups[i].join(''),
      callback: () => enterSecondScreen([...button.text])
    })
    firstScreenButtons.push(button)
  }
  setFirstButtonPositions(firstScreenButtons)
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

  // set size and positions
  setSecondButtonPositions(secondScreenButtons)
}

function setupNextButton() {
  nextButton = new Button({
    text: 'NEXT >',
    size: [100, 100],
    position: [width*3/4-100,height*3/4],
    color: [255, 0, 0],
    callback: nextButtonHandler
  })
}

// -- Button state change --
function enterSecondScreen(letters) {
  for (i=0; i<secondScreenButtons.length; i++) {
    secondScreenButtons[i].updateText('')
    secondScreenButtons[i].show()
  }
  for (i=0; i<letters.length; i++) {
    secondScreenButtons[i].updateText(letters[i])
  }
  for (i=0; i<firstScreenButtons.length; i++) {
    firstScreenButtons[i].hide()
  }
  inFirstScreen = false
}

function exitSecondScreen() {
  for (i=0; i<secondScreenButtons.length; i++) {
    secondScreenButtons[i].hide()
  }
  for (i=0; i<firstScreenButtons.length ; i++) {
    firstScreenButtons[i].show()
  }
  inFirstScreen = true
}

// -- Trial Stage Change --
function showWatch() {
  nextButton.show()
  for (i=0; i<firstScreenButtons.length; i++) {
    firstScreenButtons[i].show()
  }
}

function drawWatch() {
  nextButton.draw()
  firstScreenButtons.forEach(button => button.draw())
  secondScreenButtons.forEach(button => button.draw())
}

function hideWatch() {
  for (i=0; i<secondScreenButtons.length; i++) {
    secondScreenButtons[i].hide()
  }
  for (i=0; i<firstScreenButtons.length; i++) {
    firstScreenButtons[i].hide()
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
function setFirstButtonPositions(buttons) {
  buttons.forEach(button => button.updateSize(sizeOfInputArea/2, sizeOfInputArea/3))
  buttons[0].updateSize(sizeOfInputArea, sizeOfInputArea/3)
  buttons[0].updatePosition(width/2-sizeOfInputArea/2, height/2-sizeOfInputArea/2)
  buttons[1].updatePosition(width/2-sizeOfInputArea/2, height/2-sizeOfInputArea/6)
  buttons[2].updatePosition(width/2, height/2-sizeOfInputArea/6)
  buttons[3].updatePosition(width/2-sizeOfInputArea/2, height/2+sizeOfInputArea/6)
  buttons[4].updatePosition(width/2, height/2+sizeOfInputArea/6)
}

function setSecondButtonPositions(buttons) {
  buttons.forEach(button => button.updateSize(sizeOfInputArea/2, sizeOfInputArea/3))
  buttons[0].updatePosition(width/2-sizeOfInputArea/2, height/2-sizeOfInputArea/2)
  buttons[1].updatePosition(width/2, height/2-sizeOfInputArea/2)
  buttons[2].updatePosition(width/2-sizeOfInputArea/2, height/2-sizeOfInputArea/6)
  buttons[3].updatePosition(width/2, height/2-sizeOfInputArea/6)
  buttons[4].updatePosition(width/2-sizeOfInputArea/2, height/2+sizeOfInputArea/6)
  buttons[5].updatePosition(width/2, height/2+sizeOfInputArea/6)
}

function mouseInLeftWatch() {
  return didMouseClick(width/2-sizeOfInputArea/2, height/2-sizeOfInputArea/2,
                       sizeOfInputArea/2, sizeOfInputArea)
}

function mouseInRightWatch() {
  return didMouseClick(width/2, height/2-sizeOfInputArea/2,
                       sizeOfInputArea/2, sizeOfInputArea)
}
