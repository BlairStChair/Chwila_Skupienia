document.addEventListener("DOMContentLoaded", () => {
const passwordAfterReset = document.querySelector(".passwordAfterReset");
const passwordAfterResetConfirm = document.querySelector(".passwordAfterResetConfirm");
const passwordResetBtn = document.querySelector(".passwordResetBtn");
const passwordResetForm = document.querySelector("form");

const auth = firebase.auth();

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');      
const oobCode = params.get('oobCode');

if(!oobCode){
    info.textContent = 'Brak kodu resetu w URL — strona nie może kontynuować.';
    return;
}

const diffrentPasswordsAlert = document.createElement("p");
diffrentPasswordsAlert.className = "error";
diffrentPasswordsAlert.textContent = "Hasła nie są takie same"
diffrentPasswordsAlert.style.color = "red";

const oldPasswordAlert = document.createElement("p");
oldPasswordAlert.className = "error";
oldPasswordAlert.textContent = "Hasło musi być inne od starego!"
oldPasswordAlert.style.color = "red";

auth.verifyPasswordResetCode(oobCode)
    .then((email) => {
      const usersEmail = email;

      console.log(usersEmail);
    })
    .catch((err) => {
      console.error('Błąd weryfikacji kodu:', err);
    });

passwordResetBtn.addEventListener("click", async(e) => {
    e.preventDefault();

    const newPasswordValue = passwordAfterReset.value.trim();
    const newPasswordConfirmValue = passwordAfterResetConfirm.value.trim();

    try{
        const user = auth.currentUser;
        if(!user){
            alert("Zaloguj się, aby zmienić hasło");
            return;
        }

        if(newPasswordValue !== newPasswordConfirmValue){
            passwordResetForm.appendChild(diffrentPasswordsAlert);
            
            passwordAfterReset.value = "";
            passwordAfterResetConfirm.value = "";
            return;
        }

        if(newPasswordValue )

        await auth.confirmPasswordReset(oobCode, newPasswordValue);
        alert("Hasło zmieniono pomyślnie");
        setTimeout(() => { window.location.href = '../pages/loginPage.html'; }, 2000);
    }catch(err){
            console.error("Błąd", err);
    }
});
});