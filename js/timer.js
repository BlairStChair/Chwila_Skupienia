const timer = document.querySelector(".timer");
const addTime = document.querySelector(".addTime");
const subtractTime = document.querySelector(".subtractTime");
const startTimer = document.querySelector(".startTimer");
const stopTimer = document.querySelector(".stopTimer");
const resetTimer = document.querySelector(".resetTimer");
const FifteenMinutes = document.querySelector("#FifteenMinutes");;
const ThirtyMinutes = document.querySelector("#ThirtyMinutes");
const FortyFiveMinutes = document.querySelector("#FortyFiveMinutes");

//IDŹ DO STARTTIMER I NAPRAW

var timeInSeconds = 1500;
var timeInMinutes = 25;
let shortBreak = 0;
let shortBreakSeconds = 0;
let longBreak = 0;
let longBreakSeconds = 0;
let currentShortBreakTime = shortBreakSeconds;
let currentLongBreakTime = longBreakSeconds;

let sessionsCounter = 0;
let buttonsDisabled = false;

let savedTime = 1500;
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

let totalMinutes = 0;

async function countMinutes(addedMinutes){
    totalMinutes = totalMinutes + addedMinutes;
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
    countMinutes(timeInMinutes);

    console.log("Ile minut się naliczyło: ", totalMinutes);

    shortBreakSeconds = Math.floor(originalSessionTime / 5);
    console.log(shortBreakSeconds);

    currentShortBreakTime = shortBreakSeconds;

    mode = "shortBreak";
    updateDisplay();

    // //test
    // await drawStudyTip();
    // tipContentText.textContent = drawedTip;
    // tipContentDiv.style.display = "block";

    shortBreakInterval = setInterval(() => {

        if(shortBreakSeconds > 0){
            currentShortBreakTime--;
            shortBreakSeconds = currentShortBreakTime;
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
    countMinutes(timeInMinutes);

    console.log("Ile minut się naliczyło: ", totalMinutes);

    longBreakSeconds = Math.floor((originalSessionTime * 4) / 5);
    console.log(longBreakSeconds);

    currentLongBreakTime = longBreakSeconds;

    mode = "longBreak";
    updateDisplay();

    await drawStudyTip();
    tipContentText.textContent = drawedTip;
    tipContentDiv.style.display = "block";

    longBreakInterval = setInterval(() => {
        if(longBreakSeconds > 0){
            currentLongBreakTime--;
            longBreakSeconds = currentLongBreakTime;
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
    if(timeInSeconds <= 60){
        timeInSeconds = 60;
        startTimer.disabled = true;
        stopTimer.disabled = true;
        resetTimer.disabled = true;
        subtractTime.disabled = true;
        buttonsDisabled = true;
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
    if(intervalID !== null || shortBreakInterval !== null || longBreakInterval !== null){
        return;
    }
    addTime.disabled = true;
    subtractTime.disabled = true;

//     if (timeInSeconds <= 0) {
//         timeInSeconds = originalSessionTime;
//     }

//     savedTime = timeInSeconds;
//     originalSessionTime = timeInSeconds;
//     startSession();

    //MUSZE TO ZMIENIC BO PSUJE TO PUSZCZENIE TIMERA
    if(intervalID){
        if (timeInSeconds <= 0) timeInSeconds = originalSessionTime;
        savedTime = timeInSeconds;
        originalSessionTime = timeInSeconds;
        startSession();
    }

    else if(currentMode === "shortBreak"){
        if (shortBreakSeconds <= 0) shortBreakSeconds = originalShortBreakTime;
        savedTime = shortBreakSeconds;
        startShortBreak();
    }

    else if(currentMode === "longBreak"){
        if (longBreakSeconds <= 0) longBreakSeconds = originalLongBreakTime;
        savedTime = longBreakSeconds;
        startLongBreak();
    }
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
        savedTime = currentShortBreakTime;
    }
    if(longBreakInterval){
        clearInterval(longBreakInterval);
        longBreakInterval = null;
        savedTime = currentLongBreakTime;
    }

    

    console.log("Zapisany czas: " + savedTime);
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

    timeInSeconds = originalSessionTime;
    updateDisplay();

    tipContentDiv.style.display = "none";
});

FifteenMinutes.addEventListener("click", ()=> {
    subtractTime.disabled = false;
    startTimer.disabled = false;
    stopTimer.disabled = false;
    resetTimer.disabled = false;

    timeInSeconds = 900;
    savedTime = timeInSeconds;
    originalSessionTime = timeInSeconds;
    updateDisplay();
});

ThirtyMinutes.addEventListener("click", ()=> {
    subtractTime.disabled = false;
    startTimer.disabled = false;
    stopTimer.disabled = false;
    resetTimer.disabled = false;

    timeInSeconds = 1800;
    savedTime = timeInSeconds;
    originalSessionTime = timeInSeconds;
    updateDisplay();
});

FortyFiveMinutes.addEventListener("click", ()=> {
    subtractTime.disabled = false;
    startTimer.disabled = false;
    stopTimer.disabled = false;
    resetTimer.disabled = false;

    timeInSeconds = 2700;
    savedTime = timeInSeconds;
    originalSessionTime = timeInSeconds;
    updateDisplay();
});
