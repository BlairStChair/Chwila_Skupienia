document.addEventListener("DOMContentLoaded", () => {
const timer = document.querySelector(".timer");
const addTime = document.querySelector(".addTime");
const subtractTime = document.querySelector(".subtractTime");
const startTimer = document.querySelector(".startTimer");
const stopTimer = document.querySelector(".stopTimer");
const resetTimer = document.querySelector(".resetTimer");
const FifteenMinutes = document.querySelector("#FifteenMinutes");;
const ThirtyMinutes = document.querySelector("#ThirtyMinutes");
const FortyFiveMinutes = document.querySelector("#FortyFiveMinutes");

const auth = firebase.auth();
const db = firebase.firestore();

stopTimer.disabled = true;
resetTimer.disabled = true;

var timeInSeconds = 1500;
var timeInMinutes = 25;
let shortBreak = 0;
let shortBreakSeconds = 0;
let longBreak = 0;
let longBreakSeconds = 0;
let currentShortBreakTime = shortBreakSeconds;
let currentLongBreakTime = longBreakSeconds;

let sessionsCounter = 0;

let savedTime = 1500;
let originalSessionTime = 1500;
let intervalID = null;
let shortBreakInterval = null;
let longBreakInterval = null;

let mode = "session";
let buttonsDisabled = false;

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
    localStorage.setItem("todaySavedMinutes", totalMinutes);
    console.log(localStorage.getItem("todaySavedMinutes"));
}

async function loadSavedTime(){
    let saved = localStorage.getItem("todaySavedMinutes");
    if(saved){
        totalMinutes = Number(saved);
    }
    console.log("Wczytany czas: " + localStorage.getItem("todaySavedMinutes"));
}

loadSavedTime();

async function sendSavedTimeToFirebase(newMinutes){
    auth.onAuthStateChanged(async (user) => {
    let uid = user.uid;

    let todayDate = new Date().toISOString().split("T")[0];

    let docRef = db.collection("sessionsInfo").doc(uid).collection("stats").doc(todayDate);
    let docSnap = await docRef.get();

    let currentMinutes = 0;
    if(docSnap.exists){
        currentMinutes = docSnap.data().minutes || 0;
    }

    let minutesToAdd = newMinutes - currentMinutes;

    if(minutesToAdd > 0){
        await docRef.set({
            minutes: firebase.firestore.FieldValue.increment(minutesToAdd),
            date: todayDate
        }, {merge: true});

        console.log("Dodany czas do firestore: " + minutesToAdd);
    }else{
        console.log("Nie ma nic do dodania");
    }
    });
}

async function loadStudyTipsJson(){
    const json = await fetch("../data/studyTips.json");
    tipPool = await json.json();
}

async function drawStudyTip(){
    const tipIndex = Math.floor(Math.random() * tipPool.length);

    drawedTip = tipPool[tipIndex]    
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
    if(savedTime != 0 && savedTime < Math.floor(originalSessionTime / 5)){
        shortBreakSeconds = savedTime;
    }else{
        shortBreakSeconds = Math.floor(originalSessionTime / 5);
    }

    countMinutes(originalSessionTime / 60);

    currentShortBreakTime = shortBreakSeconds;

    mode = "shortBreak";
    updateDisplay();

    shortBreakInterval = setInterval(() => {

        if(shortBreakSeconds > 0){
            currentShortBreakTime--;
            shortBreakSeconds = currentShortBreakTime;
            updateDisplay();
        }else{
            clearInterval(shortBreakInterval);
            shortBreakInterval = null;
            timeInSeconds = savedTime;

            tipContentDiv.style.display = "none";
            timeInSeconds = originalSessionTime;
            startSession();
            }
    }, 1000);
}

async function startLongBreak() {
    countMinutes(timeInSeconds / 60);

    if(savedTime != 0 && savedTime < Math.floor((originalSessionTime * 4) / 5)){
        longBreakSeconds = savedTime;
    }else{
        longBreakSeconds = Math.floor((originalSessionTime * 4) / 5);
    }

    countMinutes(originalSessionTime / 60);

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
        }else{
            clearInterval(longBreakInterval);
            longBreakInterval = null;
            sessionsCounter = 0;
            timeInSeconds = savedTime;

            tipContentDiv.style.display = "none";
            timeInSeconds = originalSessionTime;
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
    subtractTime.disabled = false;
});

subtractTime.addEventListener("click", () => {
    timeInMinutes = timeInMinutes - 1;

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
    }
});

startTimer.addEventListener("click", () => {
    stopTimer.disabled = false;
    resetTimer.disabled = false;

    if(intervalID !== null || shortBreakInterval !== null || longBreakInterval !== null){
        return;
    }
    addTime.disabled = true;
    subtractTime.disabled = true;

    if(mode === "session"){
        if (timeInSeconds <= 0) {
        timeInSeconds = originalSessionTime;
        }

        startSession();
    }

    else if(mode === "shortBreak"){
        startShortBreak();
    }

    else if(mode === "longBreak"){
        startLongBreak();
    }
});

stopTimer.addEventListener("click", () => {
    addTime.disabled = true;
    subtractTime.disabled = true;

    if(intervalID){
        clearInterval(intervalID);
        intervalID = null;
        savedTime = timeInSeconds;
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

    intervalID = null;
    shortBreakInterval = null
    longBreakInterval = null

    mode = "session";
    timeInSeconds = originalSessionTime;
    savedTime = 0;

    shortBreakSeconds = Math.floor(originalSessionTime / 5);
    longBreakSeconds = Math.floor((originalSessionTime * 4) / 5);
    currentShortBreakTime = shortBreakSeconds;
    currentLongBreakTime = longBreakSeconds;

    updateDisplay();

    tipContentDiv.style.display = "none";
});

FifteenMinutes.addEventListener("click", ()=> {
    subtractTime.disabled = false;
    startTimer.disabled = false;
    
    timeInSeconds = 900;
    savedTime = timeInSeconds;
    originalSessionTime = timeInSeconds;
    updateDisplay();
});

ThirtyMinutes.addEventListener("click", ()=> {
    subtractTime.disabled = false;
    startTimer.disabled = false;

    timeInSeconds = 1800;
    savedTime = timeInSeconds;
    originalSessionTime = timeInSeconds;
    updateDisplay();
});

FortyFiveMinutes.addEventListener("click", ()=> {
    subtractTime.disabled = false;
    startTimer.disabled = false;

    timeInSeconds = 2700;
    savedTime = timeInSeconds;
    originalSessionTime = timeInSeconds;
    updateDisplay();
});

sendSavedTimeToFirebase(totalMinutes);
});
