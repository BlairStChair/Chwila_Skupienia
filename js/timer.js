const timer = document.querySelector(".timer");
const addTime = document.querySelector(".addTime");
const subtractTime = document.querySelector(".subtractTime");
const startTimer = document.querySelector(".startTimer");
const stopTimer = document.querySelector(".stopTimer");
const resetTimer = document.querySelector(".resetTimer");

var timeInSeconds = 1500;
let savedTime = 0;
let intervalID = null;
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
    console.log(timeInSeconds);
});

subtractTime.addEventListener("click", () => {
    if(timeInSeconds <= 0){
        timeInSeconds = 0;
    }else{
        timeInSeconds = timeInSeconds - 60;
        savedTime = timeInSeconds;
        updateDisplay();
        console.log(timeInSeconds);   
    }
});

startTimer.addEventListener("click", () => {
    console.log("starttest");

    addTime.disabled = true;
    subtractTime.disabled = true;

    if(intervalID) return;

    intervalID = setInterval(() => {
        
        if(timeInSeconds > 0){
            timeInSeconds = timeInSeconds - 1;
            updateDisplay();
            console.log(timeInSeconds);
        }else{
            clearInterval(intervalID);
            intervalID = null;
        }
    }, 1000);
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
