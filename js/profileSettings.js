document.addEventListener("DOMContentLoaded", () => {
const avatarFile = document.querySelector("#avatarFile");
const avatar = document.querySelector("#avatar")
const submitAvatar = document.querySelector("#submitAvatar");
const emailChangeField = document.querySelector("#emailChangeField");
const emailChangeConfirmBtn = document.querySelector("#emailChangeConfirmBtn");
const usernameChangeField = document.querySelector("#usernameChangeField");
const usernameChangeBtn = document.querySelector("#usernameChangeBtn");
const oldPasswordField = document.querySelector("#oldPasswordField");
const newPasswordField = document.querySelector("#newPasswordField");
const newPasswordConfirmField = document.querySelector("#newPasswordConfirmField");
const passwordChangeBtn = document.querySelector("#passwordChangeBtn");

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const db = firebase.firestore();

function validateEmail(emailInput){
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(emailInput);
};

async function loadAvatar(){
    const user = auth.currentUser;
    
    const userDoc = await db.collection("users").doc(user.uid).get();
    const userData = userDoc.data();

    avatar.src = userData?.photoURL || "../assets/img/defaultAvatar.png";
}


loadAvatar();

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

emailChangeConfirmBtn.addEventListener("click", async (e) => {
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

usernameChangeBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    let newUsername = usernameChangeField.value;
    console.log(newUsername);

    try{
        const user = auth.currentUser;
        if(!user){
            alert("Zaloguj się, aby zmienić nazwę użytkownika");
            return;
        }

    await user.updateProfile(newUsername);
    
    await db.collection("users").doc(user.uid).update({
                displayName: newUsername
            });

    alert("Nazwa użytkownika została zmieniona pomyślnie!");
    }catch(err){
            console.error("Błąd", err);
            alert("Wystąpił błąd podczas zmiany nazwy użytkownika!")
    }

    usernameChangeField.value= "";
});

passwordChangeBtn.addEventListener("click", async(e) => {
    e.preventDefault();

    const oldPasswordValue = oldPasswordField.value.trim();
    const newPasswordValue = newPasswordField.value.trim();
    const newPasswordConfirmValue = newPasswordConfirmField.value.trim();

    try{
        const user = auth.currentUser;
        if(!user){
            alert("Zaloguj się, aby zmienić hasło");
            return;
        }
        
        if (newPasswordValue !== newPasswordConfirmValue) {
            alert("Nowe hasła nie są takie same!");
            oldPasswordField.value = "";
            newPasswordField.value = "";
            newPasswordConfirmField.value = "";
            return;
        }

        const credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPasswordValue);

        await user.reauthenticateWithCredential(credential);
    
        await user.updatePassword(newPasswordValue);

        alert("Hasło zostało zmienione pomyślnie!");

        oldPasswordField.value = "";
        newPasswordField.value = "";
        newPasswordConfirmField.value = "";
    }catch(err){
            console.error("Błąd", err);
            alert("Wystąpił błąd podczas zmiany hasła!")
    }
});

});