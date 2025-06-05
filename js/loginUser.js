const userEmail = document.querySelector(".userEmail");
const userPassword = document.querySelector(".userPassword");
const loginBtn = document.querySelector(".loginBtn");

loginBtn.addEventListener("click", () => {
    const emailValue = userEmail.value;
    const passwordValue = userPassword.value;

    console.log(emailValue);
    console.log(passwordValue);
});
