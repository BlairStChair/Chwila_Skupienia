document.addEventListener("DOMContentLoaded", () => {
const avatarFile = document.querySelector("#avatarFile");
const avatar = document.querySelector("#avatar")
const submitAvatar = document.querySelector("#submitAvatar");

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const db = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref(); 

avatarFile.addEventListener("change", () => {
    avatar.src = URL.createObjectURL(avatarFile.files[0]);
})

submitAvatar.addEventListener("click", async (e) => {
    e.preventDefault();

    try{
        let isUserLogged = auth.currentUser;
        if(!isUserLogged){
            alert("Zaloguj się, aby zmienić zdjęcie profilowe");
            return;
        }

        storageRef = storage.ref().child(`avatars/${user.uid}.jpg`);
        await storageRef.put(avatarFile.files[0]);

        let avatarURL = await storageRef.getDowloadURL();

        await db.collection("users").doc(user.uid).update({
            photoURL: avatarURL
        });

        alert("Zdjęcie profilowe zostało zmienione pomyślnie!");
        } catch(err){
            console.error("Błąd", err);
            alert("Wystąpił błąd podczas zmiany zdjęcia profilowego!")
        }
});
});