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
    "lofi-background-music-314199",
    "lofi-lofi-song-345371",
    "lofi-rain-lofi-music-332732",
    "rainy-lofi-city-lofi-music-332746"
]

let songIndex = 0;

loadSong(songsArray[songIndex]);

function loadSong(song){
    songTitle.textContent = song;
audio.src = `../assets/songs/${song}.mp3`; 
}



});