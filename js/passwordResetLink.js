document.addEventListener("DOMContentLoaded", () => {
const passwordAfterReset = document.querySelector(".passwordAfterReset");
const passwordAfterResetConfirm = document.querySelector(".passwordAfterResetConfirm");
const passwordResetBtn = document.querySelector(".passwordResetBtn");

const auth = firebase.auth();
const db = firebase.firestore();

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');      
const oobCode = params.get('oobCode');

if(!oobCode){
    info.textContent = 'Brak kodu resetu w URL — strona nie może kontynuować.';
    return;
}

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
            alert("Zaloguj się, aby zmienić nazwę użytkownika");
            return;
        }

        if(newPasswordValue !== newPasswordConfirmValue){
            alert("Nowe hasła nie są takie same!");
            passwordAfterReset.value = "";
            passwordAfterResetConfirm.value = "";
            return;
        }

        await auth.confirmPasswordReset(oobCode, newPasswordValue);
        alert("Hasło zmieniono pomyślnie");
        setTimeout(() => { window.location.href = '/login.html'; }, 2000);
    }catch(err){
            console.error("Błąd", err);
            alert("Wystąpił błąd podczas resetowania hasła!")
    }
});
});