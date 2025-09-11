document.addEventListener("DOMContentLoaded", () => {
const avatarFile = document.querySelector("#avatarFile");
const avatar = document.querySelector("#avatar")
const submitAvatar = document.querySelector("#submitAvatar");
const emailChangeField = document.querySelector("#emailChangeField");
const emailChangeConfirmBtn = document.querySelector("#emailChangeConfirmBtn");

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const db = firebase.firestore();

avatarFile.addEventListener("change", () => {
    avatar.src = URL.createObjectURL(avatarFile.files[0]);
})

submitAvatar.addEventListener("click", async (e) => {
    e.preventDefault();

    try{
        const user = auth.currentUser;
        if(!user){
            alert("Zaloguj się, aby zmienić zdjęcie profilowe");
            return;
        }

        let file = avatarFile.files[0];
        let fileReader = new FileReader();

        fileReader.onloadend = async () => {
            let base64String = fileReader.result;

            await db.collection("users").doc(user.uid).update({
                photoURL: base64String
            });

            avatar.src = base64String;
        };

        alert("Zdjęcie profilowe zostało zmienione pomyślnie!");

        fileReader.readAsDataURL(file);
        } catch(err){
            console.error("Błąd", err);
            alert("Wystąpił błąd podczas zmiany zdjęcia profilowego!")
        }
});

emailChangeConfirmBtn.addEventListener("click", () =>{
    let newEmail = emailChangeField.value;
    console.log(newEmail);

    emailChangeField.value= "";
});

});