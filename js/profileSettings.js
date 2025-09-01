const avatarFile = document.querySelector("#avatarFile");
const avatar = document.querySelector("#avatar")
const submitAvatar = document.querySelector("#submitAvatar");

const auth = firebase.auth();
const db = firebase.firestore();

avatarFile.addEventListener("change", () => {
    avatar.src = URL.createObjectURL(avatarFile.file[0]);
})

submitAvatar.addEventListener("click", async () => {
    let isUserLogged = auth.currentUser;
    if(!isUserLogged){
        alert("Zaloguj się, aby zmienić zdjęcie profilowe");
        return;
    }

    await storageRef.put(file);
    let avatarURL = await storageRef.getDowloadURL();

    await db.collection("users").doc(user.uid).update({
        photoURL: getDownloadURL
    });

    alert("Zdjęcie profilowe zostało zmienione pomyślnie!");
});