const timerContainer = document.querySelector(".timer");
const addTime = document.querySelector(".addTime");
const subtractTime = document.querySelector(".subtractTime");
const startTimer = document.querySelector(".startTimer");
const stopTimer = document.querySelector(".stopTimer");
const resetTimer = document.querySelector(".resetTimer");

var timeInSeconds = 60;

addTime.addEventListener("click", () => {
    timeInSeconds = timeInSeconds + 60;
    console.log(timeInSeconds);
});

subtractTime.addEventListener("click", () => {
    if(timeInSeconds <= 0){
        timeInSeconds = 0;
    }else{
        timeInSeconds = timeInSeconds - 60;
        console.log(timeInSeconds);   
    }
});
