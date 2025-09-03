document.addEventListener("DOMContentLoaded", () => {
const usersFriends = document.querySelector(".usersFriends");
const userSearch = document.querySelector(".userSearch");
const searchResults = document.querySelector(".searchResults")

const auth = firebase.auth();
const db = firebase.firestore();

let usernamesGlobal = [];
async function getAllUsernames(){
    let snapshot = await db.collection("users").get();
    console.log(snapshot);

    let usernames = snapshot.docs.map(doc => doc.data().displayName).filter(name => !!name);
    console.log(usernames);

    usernamesGlobal = usernames;
    console.log("Global", usernamesGlobal);

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

userSearchBtn.addEventListener("click", async () => {
    let usernameInput = userSearchField.value.toLowerCase();
    console.log(usernameInput);

    await getAllUsernames();

    let results = usernamesGlobal.filter(name => 
        name.toLowerCase().includes(usernameInput)
    );

    console.log("Wyniki", results);
});
});