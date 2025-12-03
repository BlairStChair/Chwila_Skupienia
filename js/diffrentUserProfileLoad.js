document.addEventListener("DOMContentLoaded", () => {
const avatar = document.querySelector(".avatar");
const avatarImg = document.querySelector("#avatarImg")
const username = document.querySelector(".username");

const urlPar = new URLSearchParams(window.location.search);
const userUID = urlPar.get("uid");

const auth = firebase.auth();
const db = firebase.firestore();

async function loadDiffrentUserProfile(){
  const userDoc = await db.collection("users").doc(userUID).get();
  const userData = userDoc.data();

  username.textContent = userData.displayName;
  avatarImg.src = userData.photoURL || "../assets/img/user-solid.svg";
};

loadDiffrentUserProfile();

});
