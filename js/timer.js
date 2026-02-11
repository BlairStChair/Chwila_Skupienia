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

//funkcja do sumowania minut spędzonych na pracy: po każdej zakończonej sesji minione w niej minuty są dodawane do sumy danego dnia
async function countMinutes(addedMinutes){
    totalMinutes = totalMinutes + addedMinutes;
    //używam lokalnego przechowywania tej sumy, że się nie usunęła jak się przeładuje stronę albo przejdzie do innej zakładki
    localStorage.setItem("todaySavedMinutes", totalMinutes);
    console.log(localStorage.getItem("todaySavedMinutes"));
}

//jak użytkownik wyjdzie i wejdzie do minutnika to funkcja pobiera sumę minut z lokalnego storage
async function loadSavedTime(){
    let saved = localStorage.getItem("todaySavedMinutes");
    if(saved){
        totalMinutes = Number(saved);
    }
    console.log("Wczytany czas: " + localStorage.getItem("todaySavedMinutes"));
}
//wywołuje to już na początku kodu, żeby wczytał czas od razu po wejściu na stronę
loadSavedTime();

//funkcja przesyła sumę minut do firebase
async function sendSavedTimeToFirebase(newMinutes){
    auth.onAuthStateChanged(async (user) => {
    let uid = user.uid;

    //pobiera dzisiejszą datę, która będzie nazwą rekordu w kolekcji sessions i formatuje ją do formatu ISO bo tak stwierdziłam, że zapisuje datę
    let todayDate = new Date().toISOString().split("T")[0];

    //pobiera tworzy rekord z dziejszą datą
    let docRef = db.collection("sessionsInfo").doc(uid).collection("stats").doc(todayDate);
    let docSnap = await docRef.get();

    let currentMinutes = 0;
    //jeśli rekord z danego dnia już istnieje to dodaje sumę naliczoną obecnie do tej zapisanej w rekordzie
    if(docSnap.exists){
        currentMinutes = docSnap.data().minutes || 0;
    }

    let minutesToAdd = newMinutes - currentMinutes;
    //jak dla danego dnia jeszcze nic nie jest zapisane to dodaje do niego dane jaka jest data i jaka jest suma minut
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

//ładowanie porad z pliku json
async function loadStudyTipsJson(){
    const json = await fetch("../data/studyTips.json");
    tipPool = await json.json();
}

//losowe wybranie porady
async function drawStudyTip(){
    const tipIndex = Math.floor(Math.random() * tipPool.length);

    drawedTip = tipPool[tipIndex]    
}

loadStudyTipsJson().then(() => {
    console.log("Tips loaded successfully");
}).catch(error => {
    console.error("Failed to load tips:", error);
});

//funkcja do wyświetlania czasu
function updateDisplay(){
    let minutes;
    let seconds;
    
    //podział czasu na minuty i sekundy do wyświetlenia na zegarku
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

    //jak czas jest krótszy niż 10 minut np. 2 minuty to dodaje z przodu tej liczby 0, żeby się ładnie wyświetliło i było np. 02:01
    if(minutes < 10){
        displayTime.textContent = `0${minutes}:${seconds.toString().padStart(2, "0")}`;
    }else{
        displayTime.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
}

//funkcja, która oblicza długość krótkiej przerwy, która trwa 1/5 czasu sesji
async function startShortBreak(){
    if(savedTime != 0 && savedTime < Math.floor(originalSessionTime / 5)){
        shortBreakSeconds = savedTime;
    }else{
        shortBreakSeconds = Math.floor(originalSessionTime / 5);
    }

    countMinutes(originalSessionTime / 60);

    currentShortBreakTime = shortBreakSeconds;

    mode = "shortBreak";
    updateDisplay();

    //do testów potem usunąć
    await drawStudyTip();
    tipContentText.textContent = drawedTip;
    tipContentDiv.style.display = "block";

    //tutaj dzieje się interwał, który zmienia co sekundę czas na zegarku, żeby z każdą sekundą malał o sekundę
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
    //wartość 1000 oznacza 1 sekundę
    }, 1000);
}

//to samo tylko obsługa długiej przerwy, która trwa 4/5 czasu trwania sesji
async function startLongBreak(){
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

//funkcja obsługuje trwanie sesji i przerw
function startSession(){
    tipContentDiv.style.display = "none";

    mode = "session";
    updateDisplay();

    intervalID = setInterval(() => {
        if(timeInSeconds > 0){
            //jak czas się odlicza tu czas to trwa sesja skupienia
            mode = "session";
            timeInSeconds = timeInSeconds - 1;
            updateDisplay();
        }else{
            clearInterval(intervalID);
            intervalID = null;
            //obliczanie liczby ukończonych sesji
            sessionsCounter++;
            console.log("liczba sesji:" + sessionsCounter);
            //jak minęło do 3 sesji to po zakończeniu sesji zaczyna się krótka przerwa
            if(sessionsCounter < 4){
                startShortBreak();
            }else{
                //jak już miną 4 sesje to odpala się długa przerwa
                startLongBreak();
            }
        }
    }, 1000);
}

updateDisplay();

//dodanie po minucie przyciskiem
addTime.addEventListener("click", () => {
    timeInSeconds = timeInSeconds + 60;
    savedTime = timeInSeconds;
    originalSessionTime = timeInSeconds;
    updateDisplay();

    startTimer.disabled = false;
    subtractTime.disabled = false;
});

//skrócenie czasu
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

//przycisk, który rozpoczyna działanie zegarka
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

//zatrzymanie minutnika
stopTimer.addEventListener("click", () => {
    addTime.disabled = true;
    subtractTime.disabled = true;

    //tutaj sprawdza czy jest sesja czy któraś z przerw i zapisuje czas, na którym zatrzymało się minutnik, żeby był zachowany przy ponownym wciśnięciu start, aby kontynuować
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

//całkowite zresetowanie naliczonych sesji i odliczonego czasu
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

//tutaj zrobiłam presety dla 15, 30 i 45 minut
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
//wysłanie sumy naliczonych minut do firebase
sendSavedTimeToFirebase(totalMinutes);
});
