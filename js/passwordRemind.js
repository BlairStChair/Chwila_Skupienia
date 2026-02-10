document.addEventListener("DOMContentLoaded", () => {
const userEmail = document.querySelector(".userEmail");
const remindPasswordForm = document.querySelector("form");

const auth = firebase.auth();
const db = firebase.firestore();

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

    //jak odświeżysz strone to znika informacja o błędnym emailu
    if(remindPasswordForm.contains(invalidEmailAlert)){
    remindPasswordForm.removeChild(invalidEmailAlert);
    }

    const emailValue = userEmail.value;

    console.log(emailValue);

    //sprawdza czy email ma poprawny format
    if(!emailPattern.test(emailValue)){
      remindPasswordForm.appendChild(invalidEmailAlert);
      return;
    }else{
        try{
            //jak tak to ściąga informacje o tym użytkowniku z firebase
            const usersRef = await db.collection("users");
            console.log(usersRef);
            const querySnapshot = await usersRef.where("email", "==", emailValue).get();
            console.log(querySnapshot);

            //jak nie znalazł w firebase użytkownika z takim mailem to wywala, że taki mail nie ma konta
            if(querySnapshot.empty){
                remindPasswordForm.appendChild(invalidEmail);
                return;
            }else{
                //jak znalazł to konto to za pomocą gotowej funkcji z firebase wysyła maila do resetowania hasła
                await auth.sendPasswordResetEmail(emailValue);
                console.log("Wysłano email resetujący hasło do:", emailValue);
                alert("Wysłano wiadomość do resetowania hasła!");
                window.location.href = "loginPage.html";
            }
        }catch(error){
            console.error("Błąd resetowania hasła:", error.message);
            if(!remindPasswordForm.contains(invalidEmail)){
                remindPasswordForm.appendChild(invalidEmail);
            }
            remindPasswordForm.appendChild(invalidEmail);
        }
    }
});
});
