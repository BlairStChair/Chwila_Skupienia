const userEmail = document.querySelector(".userEmail");
const remindPasswordForm = document.querySelector("form");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const invalidEmailAlert = document.createElement("p");
invalidEmailAlert.className = "error";
invalidEmailAlert.textContent = "Format adresu e-mail jest niepoprawny"
invalidEmailAlert.style.color = "red";

const invalidEmail = document.createElement("p");
invalidEmail.textContent = "Konto z podanym adresem e-mail nie istnieje!"
invalidEmail.style.color = "red";

remindPasswordForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const emailValue = userEmail.value;

    console.log(emailValue);

    if(!emailPattern.test(emailValue)){
      remindPasswordForm.appendChild(invalidEmailAlert);
      return;
    }else{
        try{
            const usersRef = db.collection("users");
            const querySnapshot = await usersRef.where("email", "==", emailValue).get();

            if(querySnapshot.empty){
                remindPasswordForm.appendChild(invalidEmail);
            return;
            }

            await auth.sendPasswordResetEmail(emailValue);
            console.log("Wysłano email resetujący hasło do:", emailValue);
            alert("Wysłano wiadomość do resetowania hasła!");
            window.location.href = "loginPage.html";
        }catch(error){
            console.error("Błąd resetowania hasła:", error.message);
            if(!remindPasswordForm.contains(invalidEmail)) {
            remindPasswordForm.appendChild(invalidEmail);
            }
            remindPasswordForm.appendChild(invalidEmail);
        }
    }
});
