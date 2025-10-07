document.addEventListener("DOMContentLoaded", () => {
const passwordAfterReset = document.querySelector(".passwordAfterReset");
const passwordAfterResetConfirm = document.querySelector(".passwordAfterResetConfirm");
const passwordResetBtn = document.querySelector(".passwordResetBtn");

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
        }
    }catch(err){
            console.error("Błąd", err);
            alert("Wystąpił błąd podczas resetowania hasła!")
    }
});
});