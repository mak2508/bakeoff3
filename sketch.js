let DPIofYourDeviceScreen = 150; //you will need to measure or look up the DPI or PPI of your device/browser to make sure you get the right scale!!
let sizeOfInputArea = DPIofYourDeviceScreen*1.0; //aka, 1.0 inches square!

let totalTrialNum = 2; //the total number of phrases to be tested - set this low for testing. Might be ~10 for the real bakeoff!
let currTrialNum = 0; // the current trial number (indexes into trials array above)
let startTime = 0; // time starts when the first letter is entered
let finishTime = 0; // records the time of when the final trial ends
let lastTime = 0; //the timestamp of when the last trial was completed
let lettersEnteredTotal = 0; //a running total of the number of letters the user has entered (need this for final WPM computation)
let lettersExpectedTotal = 0; //a running total of the number of letters expected (correct phrases)
let errorsTotal = 0; //a running total of the number of errors (when hitting next)
let currentPhrase = ""; //the current target phrase
let currentTyped = ""; //what the user has typed so far

//Variables for my silly implementation. You can delete this:
let currentLetter = 'a'.charCodeAt();

let dpiSet = 0
function setDPI() {
  DPIofYourDeviceScreen = parseInt(input.value())
  sizeOfInputArea = DPIofYourDeviceScreen*1.0
  dpiSet = 1
  input.hide()
  inputButton.hide()

  setupNextButton()
  setupFirstScreen()
  setupSecondScreen()
}

function setup() {
  createCanvas(400, 600); //Sets the size of the app. You should modify this to your device's native size. Many phones today are 1080 wide by 1920 tall.
  noStroke(); //my code doesn't use any strokes.
  
  //randomize the phrase order
  for (i=0; i<phrases.length; i++)
  {
  r = Math.floor(random(0, phrases.length));
  temp = phrases[i];
  phrases[i] = phrases[r];
  phrases[r] = temp;
   }

  console.log('testing setup entry')

  // code to set dpi
  input = createInput()
  input.position(20, height/2);
  input.style('font-size', '18px')
  inputButton = createButton('submit');
  inputButton.position(input.x + input.width, height/2 + 50);
  inputButton.mousePressed(setDPI);

}

function draw() {
  background(255); //clear background
  if (dpiSet != 0 && dpiSet < 10) {
    dpiSet += 1
  } else if (dpiSet >= 10) {
      //check to see if the user finished. You can't change the score computation.
    if (finishTime!=0)
    {
      hideWatch()
      
      fill(0);
      textAlign(CENTER);
      text("Trials complete!",150,200); //output
      text("Total time taken: " + (finishTime - startTime),150,220); //output
      text("Total letters entered: " + lettersEnteredTotal,150,240); //output
      text("Total letters expected: " + lettersExpectedTotal,150,260); //output
      text("Total errors entered: " + errorsTotal,150,280); //output
      wpm = (lettersEnteredTotal/5)/((finishTime - startTime)/60000); //FYI - 60K is number of milliseconds in minute
      text("Raw WPM: " + wpm,150,300); //output
      freebieErrors = lettersExpectedTotal*.05; //no penalty if errors are under 5% of chars
      text("Freebie errors: " + nf(freebieErrors,1,3),150,320); //output
      penalty = max(errorsTotal-freebieErrors, 0) * 0.5;
      text("Penalty: " + penalty,150,340);
      text("WPM w/ penalty: " + (wpm-penalty),150,360); //yes, minus, because higher WPM is better

      return;
    }

    //check to see if the user hasn't started yet
    if (startTime==0 && !mouseIsPressed)
    {
      fill(128);
      textAlign(CENTER);
      text("Site updated: v3.2.3", 200, 130);
      text("Click to start time!", 200, 150); //display this message until the user clicks!
    }

    if (startTime==0 && mouseIsPressed)
    {
      nextTrial(); //start the trials!
      showWatch()
    }

    //draw 1" watch area
    fill(100);
    rect(width/2-sizeOfInputArea/2, height/2-sizeOfInputArea/2, sizeOfInputArea, sizeOfInputArea); //input area should be 1" by 1"

    //if start time does not equal zero, it means we must be in the trials
    if (startTime!=0)
    {
      //you can very slightly adjust the position of the target/entered phrases and next button
      textAlign(LEFT); //align the text left
      fill(128);
      text("Phrase " + (currTrialNum+1) + " of " + totalTrialNum, 70, 50); //draw the trial count
      fill(128);
      text("Target:   " + currentPhrase, 70, 100); //draw the target string
      text("Entered:  " + currentTyped + "_", 70, 140); //draw what the user has entered thus far 

      drawWatch()
    }
  }
}

function touchMoved() {
  return false
}

let leftSidePress = false
let rightSidePress = false
function mousePressed() {
  if (mouseInLeftWatch()) {
    leftSidePress = true
  }
  if (mouseInRightWatch()) {
    rightSidePress = true
  }
}

let started = false // used to avoid registering first click
function mouseReleased() {
  if (!started) {
    started = true
    return
  }

  if (rightSidePress && mouseX < width/2) {
    if (inFirstScreen) {
      letterButtonHandler('`') // Backspace
    }
  }
  else if (leftSidePress && mouseX > width/2) {
    if (inFirstScreen) {
      letterButtonHandler('_') // Space
    } else {
      exitSecondScreen()
    }
  }
  else {
    Button.checkButtonPress()
  }
  leftSidePress = false
  rightSidePress = false
}

function nextTrial()
{
  if (currTrialNum >= totalTrialNum) //check to see if experiment is done
    return; //if so, just return

  if (startTime!=0 && finishTime==0) //in the middle of trials
  {
    console.log("==================");
    console.log("Phrase " + (currTrialNum+1) + " of " + totalTrialNum); //output
    console.log("Target phrase: " + currentPhrase); //output
    console.log("Phrase length: " + currentPhrase.length); //output
    console.log("User typed: " + currentTyped); //output
    console.log("User typed length: " + currentTyped.length); //output
    console.log("Number of errors: " + computeLevenshteinDistance(currentTyped.trim(), currentPhrase.trim())); //trim whitespace and compute errors
    console.log("Time taken on this trial: " + (millis()-lastTime)); //output
    console.log("Time taken since beginning: " + (millis()-startTime)); //output
    console.log("==================");
    lettersExpectedTotal+=currentPhrase.length;
    lettersEnteredTotal+=currentTyped.length;
    errorsTotal+=computeLevenshteinDistance(currentTyped.trim(), currentPhrase.trim());
  }

  //probably shouldn't need to modify any of this output / penalty code.
  if (currTrialNum == totalTrialNum-1) //check to see if experiment just finished
  {
    finishTime = millis();
    console.log("==================");
    console.log("Trials complete!"); //output
    console.log("Total time taken: " + (finishTime - startTime)); //output
    console.log("Total letters entered: " + lettersEnteredTotal); //output
    console.log("Total letters expected: " + lettersExpectedTotal); //output
    console.log("Total errors entered: " + errorsTotal); //output
    wpm = (lettersEnteredTotal/5)/((finishTime - startTime)/60000); //FYI - 60K is number of milliseconds in minute
    console.log("Raw WPM: " + wpm); //output
    freebieErrors = lettersExpectedTotal*.05; //no penalty if errors are under 5% of chars
    console.log("Freebie errors: " + nf(freebieErrors,1,3)); //output
    penalty = Math.max(errorsTotal-freebieErrors, 0) * 0.5;
    console.log("Penalty: " + penalty,0,3);
    console.log("WPM w/ penalty: " + (wpm-penalty)); //yes, minus, becuase higher WPM is better
    console.log("==================");
    currTrialNum++; //increment by one so this message only appears once when all trials are done
    return;
  }

  if (startTime==0) //first trial starting now
  {
    console.log("Trials beginning! Starting timer..."); //output we're done
    startTime = millis(); //start the timer!
  } 
  else
  {
    currTrialNum++; //increment trial number
  }

  lastTime = millis(); //record the time of when this trial ended
  currentTyped = ""; //clear what is currently typed preparing for next trial
  currentPhrase = phrases[currTrialNum]; // load the next phrase!
  //currentPhrase = "abc"; // uncomment this to override the test phrase (useful for debugging)
}
