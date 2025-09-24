const timer = document.querySelector(".timer");
const addTime = document.querySelector(".addTime");
const subtractTime = document.querySelector(".subtractTime");
const startTimer = document.querySelector(".startTimer");
const stopTimer = document.querySelector(".stopTimer");
const resetTimer = document.querySelector(".resetTimer");

var timeInSeconds = 1500;
var timeInMinutes = 25;
let shortBreak = 0;
let shortBreakSeconds = 0;
let longBreak = 0;
let longBreakSeconds = 0;

let sessionsCounter = 0;

let savedTime = 0;
let intervalID = null;
let shortBreakInterval = null;
let longBreakInterval = null;

let mode = "session";

const displayTime = document.createElement("p");
timer.appendChild(displayTime);

let tipPool = [];
let drawedTip = "";

let tipContentDiv = document.createElement("div");
tipContentDiv.className = "tipContentDiv";
let tipContentText = document.createElement("p");
tipContentText.className = "tipContentText";
timer.appendChild(tipContentDiv);

function updateDisplay() {
    let minutes;
    let seconds;
    
    if(mode == "session"){
        minutes = Math.floor(timeInSeconds / 60);
        seconds = timeInSeconds % 60;
    }else if(mode == "shortBreak"){
        minutes = Math.floor(shortBreakSeconds / 60);
        seconds = shortBreakSeconds % 60;
    }else if(mode == "longBreak"){
        minutes = Math.floor(longBreakSeconds / 60);
        seconds = longBreakSeconds % 60;
    }

    if(minutes < 10){
        displayTime.textContent = `0${minutes}:${seconds.toString().padStart(2, "0")}`;
    }else{
        displayTime.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
}

async function startShortBreak() {
    shortBreakSeconds = Math.floor(savedTime / 5);
    console.log(shortBreakSeconds);

    mode = "shortBreak";
    updateDisplay();

    if (tipContentDiv.contains(tipContentText)) {
        tipContentDiv.removeChild(tipContentText);
    }

    //test
    await drawStudyTip();
    tipContentText.textContent = drawedTip;
    tipContentDiv.appendChild(tipContentText);

    shortBreakInterval = setInterval(() => {

        if(shortBreakSeconds > 0){
            shortBreakSeconds = shortBreakSeconds - 1;
            updateDisplay();
            console.log(shortBreakSeconds);
        }else{
            clearInterval(shortBreakInterval);
            shortBreakInterval = null;
            timeInSeconds = savedTime;
            updateDisplay();

            if (tipContentDiv.contains(tipContentText)) {
                tipContentDiv.removeChild(tipContentText);
            }

            startSession();
            }
    }, 1000);
}

function startLongBreak() {
    longBreakSeconds = Math.floor((savedTime * 4) / 5);
    console.log(longBreakSeconds);

    mode = "longBreak";
    updateDisplay();

    drawStudyTip();
    tipContentText.textContent = drawedTip;

    longBreakInterval = setInterval(() => {
        if(longBreakSeconds > 0){
            longBreakSeconds = longBreakSeconds - 1;
            updateDisplay();
            console.log(longBreakSeconds);
        }else{
            clearInterval(longBreakInterval);
            longBreakInterval = null;
            sessionsCounter = 0;
            timeInSeconds = savedTime;
            updateDisplay();
            startSession();
        }
    }, 1000);
}

function startSession() {
    mode = "session";
    updateDisplay();

    intervalID = setInterval(() => {
        if(timeInSeconds > 0){
            mode = "session";
            timeInSeconds = timeInSeconds - 1;
            updateDisplay();
            console.log(timeInSeconds);
            
        }else{
            clearInterval(intervalID);
            intervalID = null;
            sessionsCounter++;
            console.log("liczba sesji:" + sessionsCounter);

            if(sessionsCounter < 4){
                startShortBreak();
            }else{
                startLongBreak();
            }
        }
    }, 1000);
}

async function loadStudyTipsJson(){
    const json = await fetch("../data/studyTips.json");
    tipPool = await json.json();

    console.log(tipPool);
}

async function drawStudyTip(){
    await loadStudyTipsJson();

    const tipIndex = Math.floor(Math.random() * tipPool.length);

    drawedTip = tipPool[tipIndex]

    console.log(drawedTip);
}

updateDisplay();

addTime.addEventListener("click", () => {
    timeInSeconds = timeInSeconds + 60;
    savedTime = timeInSeconds;
    updateDisplay();

    startTimer.disabled = false;
    stopTimer.disabled = false;
    resetTimer.disabled = false;
    subtractTime.disabled = false;

    console.log("time in seconds:" + timeInSeconds);
    console.log("short break:" + shortBreak);
    console.log("long break:" + longBreak);
});

subtractTime.addEventListener("click", () => {
    timeInMinutes = timeInMinutes - 1;
    console.log("minuty:" + timeInMinutes);
    if(timeInMinutes <= 0){
        timeInSeconds = 0;
        startTimer.disabled = true;
        stopTimer.disabled = true;
        resetTimer.disabled = true;
        subtractTime.disabled = true;
    }else{
        timeInSeconds = timeInSeconds - 60;
        savedTime = timeInSeconds;
        updateDisplay();

        startTimer.disabled = false;
        stopTimer.disabled = false;
        resetTimer.disabled = false;

        console.log("time in seconds:" + timeInSeconds);
        console.log("short break:" + shortBreak);
        console.log("long break:" + longBreak);
    }
});

startTimer.addEventListener("click", () => {
    if (intervalID || shortBreakInterval || longBreakInterval) return;
    
    addTime.disabled = true;
    subtractTime.disabled = true;

    savedTime = timeInSeconds;
    startSession();
});

stopTimer.addEventListener("click", () => {
    addTime.disabled = true;
    subtractTime.disabled = true;

    clearInterval(intervalID);
    intervalID = null;
});

resetTimer.addEventListener("click", () => {
    addTime.disabled = false;
    subtractTime.disabled = false;

    clearInterval(intervalID);
    intervalID = null;
    timeInSeconds = savedTime;
    updateDisplay();
});
