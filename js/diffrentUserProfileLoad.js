document.addEventListener("DOMContentLoaded", () => {
const avatarImg = document.querySelector("#avatarImg")
const username = document.querySelector(".username");

const urlPar = new URLSearchParams(window.location.search);
const userUID = urlPar.get("uid");

const db = firebase.firestore();

//pobiera informacje o użytkowniku, na którego profil wchodzimy
async function loadDiffrentUserProfile(){
  const userDoc = await db.collection("users").doc(userUID).get();
  const userData = userDoc.data();

  //wyświetla jego nazwę użytkownika i awatar ale jest warunek że jak nie ma profilowego to wyświetla to defaultowe
  username.textContent = userData.displayName;
  avatarImg.src = userData.photoURL || "../assets/img/user-solid.svg";

  let stats = await getUserStats(userUID);

  console.log("Statystyki znajomego:", stats);

  createChart(stats);
};

loadDiffrentUserProfile();
});