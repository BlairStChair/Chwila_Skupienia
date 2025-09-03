const usersFriends = document.querySelector(".usersFriends");
const userSearch = document.querySelector(".userSearch");

let userSearchField = document.createElement("input");
userSearchField.setAttribute("type", "text");


userSearch.addEventListener("click", () => {
    usersFriends.style.display = "none";
    userSearch.appendChild(userSearchField);
    userSearchField.focus();
});