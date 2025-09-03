document.addEventListener("DOMContentLoaded", () => {
const usersFriends = document.querySelector(".usersFriends");
const userSearch = document.querySelector(".userSearch");
const searchResults = document.querySelector(".searchResults")

const auth = firebase.auth();
const db = firebase.firestore();

async function getAllUsernames(){
    let snapshot = await db.ref("users").once("value");
    let data = snapshot.val();
    console.log(snapshot);
    let usernames = Object.values(data).map(user => user.displayName);
    console.log(usernames);

    return usernames;
}

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

getAllUsernames();  

userSearchBtn.addEventListener("click", async () => {
    let usernameInput = userSearchField.value;
    console.log(usernameInput);

     

});
});