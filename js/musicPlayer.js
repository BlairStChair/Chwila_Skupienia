document.addEventListener("DOMContentLoaded", () => {
    const musicPlayer = document.querySelector(".musicPlayer");
    const songInfo = document.querySelector(".songInfo");
    const songTitle = document.querySelector(".songTitle");
    const audio = document.querySelector(".audio");

    const previousSong = document.querySelector(".previousSong");
    const playStop = document.querySelector(".playStop");
    const nextSong = document.querySelector(".nextSong");

    const playSongIcon = document.querySelector(".playSong");
    const pauseSongIcon = document.querySelector(".pauseSong");

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
    ];

    let songIndex = 0;


    function loadSong(song) {
        songTitle.textContent = song;
        audio.src = `../assets/songs/${song}.mp3`;
    }

    loadSong(songsArray[songIndex]);


    function playSongFunction() {
        audio.play();
        playStop.classList.add("playing");
    }


    function pauseSongFunction() {
        audio.pause();
        playStop.classList.remove("playing");
    }


    function previousSongFunction() {
        songIndex--;

        if (songIndex < 0) {
            songIndex = songsArray.length - 1;
        }

        loadSong(songsArray[songIndex]);
        playSongFunction();
    }


    function nextSongFunction() {
        songIndex++;

        if (songIndex >= songsArray.length) {
            songIndex = 0;
        }

        loadSong(songsArray[songIndex]);
        playSongFunction();
    }


    playStop.addEventListener("click", () => {
        if (audio.paused) {
            playSongFunction();
        } else {
            pauseSongFunction();
        }
    });

    previousSong.addEventListener("click", previousSongFunction);
    nextSong.addEventListener("click", nextSongFunction);
});
