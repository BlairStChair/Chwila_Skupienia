document.addEventListener("DOMContentLoaded", () => {
const musicPlayer = document.querySelector(".musicPlayer");
const songInfo = document.querySelector(".songInfo");
const songTitle = document.querySelector(".songTitle");
const audio = document.querySelector(".audio");
const previousSong = document.querySelector(".previousSong");
const playStop = document.querySelector(".playStop");
const playSong = document.querySelector(".playSong");
const pauseSong = document.querySelector(".pauseSong");
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

function playSongFunction(){
    playSong.style.visibility = "hidden";
    pauseSong.style.visibility = "visible"; 

    audio.play();
}

function pauseSongFunction(){
    pauseSong.style.visibility = "hidden"; 
    playSong.style.visibility = "visible";

    audio.pause();
}

function previousSongFunction(){
    songIndex--;

    if(songIndex <= 0){
        songIndex = songsArray.length - 1;
    }

    loadSong(songsArray[songIndex])

    playSongFunction();
}

function nextSongFunction(){
    songIndex++;

    if(songIndex >= songsArray.length){
        songIndex = 0;
    }
    
    loadSong(songsArray[songIndex])

    playSongFunction();   
}

let clickCount = 1;

playStop.addEventListener("click", () => {
    

    if(clickCount % 2 !== 0){
        playSongFunction();
    }else{
        pauseSongFunction();
    }

    clickCount++;
});

previousSong.addEventListener("click", previousSongFunction);
nextSong.addEventListener("click", nextSongFunction);

});