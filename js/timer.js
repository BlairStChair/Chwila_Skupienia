const timer = document.querySelector(".timer");
const addTime = document.querySelector(".addTime");
const subtractTime = document.querySelector(".subtractTime");
const startTimer = document.querySelector(".startTimer");
const stopTimer = document.querySelector(".stopTimer");
const resetTimer = document.querySelector(".resetTimer");
const FifteenMinutes = document.querySelector("#FifteenMinutes");;
const ThirtyMinutes = document.querySelector("#ThirtyMinutes");
const FortyFiveMinutes = document.querySelector("#FortyFiveMinutes");

var timeInSeconds = 1500;
var timeInMinutes = 25;
let shortBreak = 0;
let shortBreakSeconds = 0;
let longBreak = 0;
let longBreakSeconds = 0;

let sessionsCounter = 0;

let savedTime = 0;
let originalSessionTime = 1500;
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
tipContentDiv.appendChild(tipContentText);
timer.appendChild(tipContentDiv);

loadStudyTipsJson().then(() => {
    console.log("Tips loaded successfully");
}).catch(error => {
    console.error("Failed to load tips:", error);
});

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
    shortBreakSeconds = Math.floor(originalSessionTime / 5);
    console.log(shortBreakSeconds);

    mode = "shortBreak";
    updateDisplay();

    //test
    await drawStudyTip();
    tipContentText.textContent = drawedTip;
    tipContentDiv.style.display = "block";

    shortBreakInterval = setInterval(() => {

        if(shortBreakSeconds > 0){
            shortBreakSeconds = shortBreakSeconds - 1;
            updateDisplay();
            console.log(shortBreakSeconds);
        }else{
            clearInterval(shortBreakInterval);
            shortBreakInterval = null;
            timeInSeconds = savedTime;

            tipContentDiv.style.display = "none";

            updateDisplay();
            startSession();
            }
    }, 1000);
}

async function startLongBreak() {
    longBreakSeconds = Math.floor((originalSessionTime * 4) / 5);
    console.log(longBreakSeconds);

    mode = "longBreak";
    updateDisplay();

    await drawStudyTip();
    tipContentText.textContent = drawedTip;
    tipContentDiv.style.display = "block";

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

            tipContentDiv.style.display = "none";

            updateDisplay();
            startSession();
        }
    }, 1000);
}

function startSession() {
    tipContentDiv.style.display = "none";

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
    const tipIndex = Math.floor(Math.random() * tipPool.length);

    drawedTip = tipPool[tipIndex]

    console.log(drawedTip);
    
}

updateDisplay();

addTime.addEventListener("click", () => {
    timeInSeconds = timeInSeconds + 60;
    savedTime = timeInSeconds;
    originalSessionTime = timeInSeconds;
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
        originalSessionTime = timeInSeconds;
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
    originalSessionTime = timeInSeconds;
    startSession();
});

stopTimer.addEventListener("click", () => {
    addTime.disabled = true;
    subtractTime.disabled = true;

    if(intervalID){
        clearInterval(intervalID);
        intervalID = null;
    }
    if(shortBreakInterval){
        clearInterval(shortBreakInterval);
        shortBreakInterval = null;
    }
    if(longBreakInterval){
        clearInterval(longBreakInterval);
        longBreakInterval = null;
    }
});

resetTimer.addEventListener("click", () => {
    addTime.disabled = false;
    subtractTime.disabled = false;

    if(intervalID){
        clearInterval(intervalID);
        intervalID = null;
    } 

    if(shortBreakInterval){
        clearInterval(shortBreakInterval);
        shortBreakInterval = null;
    } 

    if(longBreakInterval){
        clearInterval(longBreakInterval);
        longBreakInterval = null;
    }

    timeInSeconds = savedTime;
    updateDisplay();

    tipContentDiv.style.display = "none";
});
