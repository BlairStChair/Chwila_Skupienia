document.addEventListener("DOMContentLoaded", () => {
const username = document.querySelector(".username");

const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(async (user) => {
    const name = await db.collection("users").doc(user.uid).get();
    const userData = name.data();

    const userName = name.data();

    username.textContent = userName.displayName;

    const avatarImg = document.querySelector(".userProfile .avatar img");
    if (userData.photoURL) {
        avatarImg.src = userData.photoURL;
    } else {
        avatarImg.src = "../assets/img/user-solid.svg"; 
    }
});
});

