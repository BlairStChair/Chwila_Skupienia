document.addEventListener("DOMContentLoaded", () => {
const userEmail = document.querySelector(".userEmail");
const userPassword = document.querySelector(".userPassword");
const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const emailValue = userEmail.value;
    const passwordValue = userPassword.value;

    console.log(emailValue);
    console.log(passwordValue);

        try {
            const userCredential = await auth.signInWithEmailAndPassword(emailValue, passwordValue);
            console.log("Zalogowano:", userCredential.user);
            alert("Zalogowano pomyślnie!");
            window.location.href = "dashboardPage.html";
        } catch (error) {
            console.error("Błąd logowania:", error.message);
            alert("Błędny e-mail lub hasło.");
        }
   
});
});
