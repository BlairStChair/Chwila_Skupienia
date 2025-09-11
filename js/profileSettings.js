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

function validateEmail(emailInput){
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(emailInput);
};

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

emailChangeConfirmBtn.addEventListener("click", async (e) =>{
    e.preventDefault();

    let newEmail = emailChangeField.value;
    console.log(newEmail);

    console.log(validateEmail(newEmail));

    if(validateEmail(newEmail)){
    try{
    const user = auth.currentUser;
        if(!user){
            alert("Zaloguj się, aby zmienić adres email");
            return;
        }

    await user.updateEmail(newEmail);
    
    await db.collection("users").doc(user.uid).update({
                email: newEmail
            });

    alert("Adres email został zmieniony pomyślnie!");
    }catch(err){
            console.error("Błąd", err);
            alert("Wystąpił błąd podczas zmiany adresu email!")
        }
    }else{
        alert("Format adresu email jest niepoprawny!");
    }

    emailChangeField.value= "";
});

});