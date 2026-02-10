document.addEventListener("DOMContentLoaded", () => {
const userEmail = document.querySelector(".userEmail");
const userPassword = document.querySelector(".userPassword");
const loginForm = document.querySelector("form");

const invalidLogin = document.createElement("p");
invalidLogin.className = "error";
invalidLogin.textContent = "Błędny login lub hasło"
invalidLogin.style.color = "red";

loginForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const emailValue = userEmail.value;
    const passwordValue = userPassword.value;

    console.log(emailValue);
    console.log(passwordValue);

    try{
        //używam funkcji wbudowanej do firebase, który sprawdza czy hasło pasuje do podanego konta
        const userCredential = await auth.signInWithEmailAndPassword(emailValue, passwordValue);
        console.log("Zalogowano:", userCredential.user);
        alert("Zalogowano pomyślnie!");
        window.location.href = "dashboardPage.html";
    }catch(error){
            //jak nie pasuje to wywala błąd
            loginForm.appendChild(invalidLogin);
    }
});
});
