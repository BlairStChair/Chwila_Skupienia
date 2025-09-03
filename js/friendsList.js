document.addEventListener("DOMContentLoaded", () => {
const usersFriends = document.querySelector(".usersFriends");
const userSearch = document.querySelector(".userSearch");
const searchResults = document.querySelector(".searchResults")

const auth = firebase.auth();
const db = firebase.firestore();

async function getAllUsernames(){
    let snapshot = await db.collection("users").get();
   
    console.log(snapshot);
    let usernames = snapshot.docs.map(doc => doc.data().displayName);
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