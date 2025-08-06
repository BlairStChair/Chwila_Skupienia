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

let sessionsCounter = 0;

let savedTime = 0;
let intervalID = null;
let shortBreakInterval = null;

const displayTime = document.createElement("p");
timer.appendChild(displayTime);

function updateDisplay() {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    if(minutes < 10){
        displayTime.textContent = `0${minutes}:${seconds.toString().padStart(2, "0")}`;
    }else{
        displayTime.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
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
    console.log("starttest");

    let shortBreakSeconds = Math.floor(timeInSeconds / 5);
    let longBreakSeconds = Math.floor((timeInSeconds * 4) / 5);

    addTime.disabled = true;
    subtractTime.disabled = true;

    if (intervalID || shortBreakInterval) return;

    if(sessionsCounter < 4){
    intervalID = setInterval(() => {
    
        if(timeInSeconds > 0){
            timeInSeconds = timeInSeconds - 1;
            updateDisplay();
            console.log(timeInSeconds);
            
        }else{
            clearInterval(intervalID);
            intervalID = null;
            sessionsCounter++;
            console.log("liczba sesji:" + sessionsCounter);

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
                }
            }, 1000);
        }
    },1000);
    }
});

stopTimer.addEventListener("click", () => {
    console.log("stoptest");

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
