document.addEventListener("DOMContentLoaded", () => {
const passwordAfterReset = document.querySelector(".passwordAfterReset");
const passwordAfterResetConfirm = document.querySelector(".passwordAfterResetConfirm");
const passwordResetBtn = document.querySelector(".passwordResetBtn");


const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');      
const oobCode = params.get('oobCode');

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


    }catch(err){
            console.error("Błąd", err);
            alert("Wystąpił błąd podczas resetowania hasła!")
    }
});
});