document.addEventListener("DOMContentLoaded", () => {
const newUserEmail = document.querySelector(".newUserEmail");
const newUserName = document.querySelector(".newUserName");
const newUserPassword = document.querySelector(".newUserPassword");
const newUserPasswordConfirm = document.querySelector(".newUserPasswordConfirm");
const registrationForm = document.querySelector("form");

const invalidPassword = document.createElement("p");
invalidPassword.textContent = "Hasla sa rozne!"
invalidPassword.style.color = "red";

console.log("Auth z window:", window.auth);
console.log("Czy window.auth to obiekt:", typeof window.auth);

registrationForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const newEmailValue = newUserEmail.value;
    const newUserNameValue = newUserName.value;
    const newPasswordValue = newUserPassword.value;
    const newPasswordConfirmValue = newUserPasswordConfirm.value;

    console.log(newEmailValue);
    console.log(newUserNameValue);
    console.log(newPasswordValue);

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
    
  try{
   
console.log("Rejestruję użytkownika...");
    // Signed up 
    const userCredential = await auth.createUserWithEmailAndPassword(newEmailValue, newPasswordValue);
    const user = userCredential.user;
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