document.addEventListener("DOMContentLoaded", () => {
const username = document.querySelector(".username");

const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(async (user) => {
    //pobiera z bazy danych nazwę użytkownika i ogólnie inne informacje
    const name = await db.collection("users").doc(user.uid).get();
    const userData = name.data();

    const userName = name.data();

    username.textContent = userName.displayName;

    //pobiera z bazy profilowe a jak ktoś go nie ma to daje default awatar
    const avatarImg = document.querySelector(".userProfile .avatar img");
    if (userData.photoURL) {
        avatarImg.src = userData.photoURL;
    } else {
        avatarImg.src = "../assets/img/user-solid.svg"; 
    }

    let stats = await getUserStats(userData.uid);

    console.log("Statystyki znajomego:", stats);
    //generuje statystyki
    createChart(stats);
});
});

