document.addEventListener("DOMContentLoaded", () => {
const newUserEmail = document.querySelector(".newUserEmail");
const newUserName = document.querySelector(".newUserName");
const newUserPassword = document.querySelector(".newUserPassword");
const newUserPasswordConfirm = document.querySelector(".newUserPasswordConfirm");
const registrationForm = document.querySelector("form");

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const db = firebase.firestore();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const invalidEmail = document.createElement("p");
invalidEmail.className = "error";
invalidEmail.textContent = "Format adresu e-mail jest niepoprawny"
invalidEmail.style.color = "red";

const invalidPassword = document.createElement("p");
invalidPassword.className = "error";
invalidPassword.textContent = "Hasła są różne"
invalidPassword.style.color = "red";

console.log("Auth z window:", window.auth);
console.log("Czy window.auth to obiekt:", typeof window.auth);

async function writeUsername(user) {
  try {
    await db.collection("users").doc(user.uid).set({
      displayName: newUserName.value,
      email: user.email,
      uid: user.uid
    });
    console.log("Sukces", user.uid);
  } catch (err) {
    console.error("Błąd", err);
  }
}

registrationForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const newEmailValue = newUserEmail.value;
    const newUserNameValue = newUserName.value;
    const newPasswordValue = newUserPassword.value;
    const newPasswordConfirmValue = newUserPasswordConfirm.value;

    console.log(newEmailValue);
    console.log(newUserNameValue);
    console.log(newPasswordValue);

    if(!emailPattern.test(newEmailValue)){
      registrationForm.appendChild(invalidEmail);
    }else{

    if (newPasswordValue !== newPasswordConfirmValue) {
    if (!registrationForm.contains(invalidPassword)) {
        registrationForm.appendChild(invalidPassword);
    }
    return;
} else {
    if (registrationForm.contains(invalidPassword)) {
        registrationForm.removeChild(invalidPassword);
    }
}
}
    
  try{
   
console.log("Rejestruję użytkownika...");
    // Signed up 
    const userCredential = await auth.createUserWithEmailAndPassword(newEmailValue, newPasswordValue);
    const user = userCredential.user;

    console.log(userCredential);
    console.log(user);

    await writeUsername(user);
    
    console.log("Zarejestrowano:", user);
            alert("Rejestracja przebiegła pomyślnie!");
            window.location.href = "loginPage.html";
  }
  catch (error) {
            console.error("Błąd rejestracji:", error.message);
            alert("Coś jest nie tak.");
        }
   
});
});