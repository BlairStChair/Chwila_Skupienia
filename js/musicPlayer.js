document.addEventListener("DOMContentLoaded", () => {
const musicPlayer = document.querySelector(".musicPlayer");
const songTitle = document.querySelector(".songTitle");
const durationProgress = document.querySelector(".durationProgress");
const progressBar = document.querySelector(".progressBar");
const audio = document.querySelector(".audio");
const previousSong = document.querySelector(".previousSong");
const playStop = document.querySelector(".playStop");
const nextSong = document.querySelector(".nextSong");

let songsArray = [
    "lofi background music",
    "lofi lofi song",
    "lofi rain lofi music",
    "rainy lofi city lofic music"
]

let songIndex = 0;

loadSong(songsArray[songIndex]);

function loadSong(song){
    songTitle.textContent = song;
audio.src = `../assets/songs/${song}.mp3`; 
}



});