document.addEventListener("DOMContentLoaded", () => {
const usersFriends = document.querySelector(".usersFriends");
const userSearch = document.querySelector(".userSearch");
const searchResults = document.querySelector(".searchResults")

let userSearchField = document.createElement("input");
userSearchField.setAttribute("type", "text");

let userSearchBtn = document.createElement("button");
userSearchBtn.textContent = "Szukaj";

userSearch.addEventListener("click", () => {
    usersFriends.style.display = "none";
    userSearch.appendChild(userSearchField);
    userSearch.appendChild(userSearchBtn);
    userSearchField.focus();
});

userSearchBtn.addEventListener("click", () => {
    let usernameInput = userSearchField.value;
    console.log(usernameInput);
});
});