document.addEventListener("DOMContentLoaded", () => {
const username = document.querySelector(".username");

const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(async (user) => {
    const name = await db.collection("users").doc(user.uid).get();

    const userName = name.data();

    username.textContent = userName.displayName;
});
});