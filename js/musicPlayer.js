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
    "Artur_Aravidi_Music - Midnight",
    "CFL_TurningPages - Winter Void",
    "chill_background - Deep Focus",
    "ChilltapeFM - Forest Memories ",
    "ChilltapeFM - Jazzy Focus",
    "ChilltapeFM - Sunny Stop",
    "EchoMoore - Lazy Days in Focus",
    "FASSounds - Satisfying",
    "LofCosmos - Focus Lofi",
    "NaturesEye - Slow Drift",
    "Tunetank - Lofi Relax"
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