document.addEventListener("DOMContentLoaded", () => {
const usersFriends = document.querySelector(".usersFriends");
const userSearch = document.querySelector(".userSearch");
const searchResults = document.querySelector(".searchResults")

const auth = firebase.auth();
const db = firebase.firestore();

let currentUserName = "";
let usersGlobal = [];

auth.onAuthStateChanged(async (user) => {
    currentUserName = await db.collection("users").doc(user.uid).get();
    const userData = currentUserName.data();

    const userName = currentUserName.data();
});

async function getAllUsernames(){
    let snapshot = await db.collection("users").get();
    console.log(snapshot);

    let users = snapshot.docs.map(doc => {
        let data = doc.data();
        if (data.displayName){
            return { displayName: data.displayName, uid: doc.id };
        }
            return null;
        }).filter(user => user !== null); //pobranie użytkowników i zapis displayName i uid w tablicy obiektów {displayName, uid}

    console.log(users);

    usersGlobal = users;
    console.log("Global", usersGlobal);

    return users;
}

let userSearchField = document.createElement("input");
userSearchField.setAttribute("type", "text");
userSearchField.id = "userSearchField"

let userSearchBtn = document.createElement("button");
userSearchBtn.textContent = "Szukaj";
userSearchBtn.id = "userSearchBtn"

userSearch.addEventListener("click", () => {
    usersFriends.style.display = "none";
    userSearch.appendChild(userSearchField);
    userSearch.appendChild(userSearchBtn);
    userSearchField.focus();
});

userSearchBtn.addEventListener("click", async () => {
    let usernameInput = userSearchField.value.toLowerCase();
    console.log(usernameInput);

    if(usernameInput === null || usernameInput.length === 0){
        alert("Pole wyszukiwania nie może być puste!")
        return;
    }else{
    await getAllUsernames();

    let results = usersGlobal.filter(user => 
        user.displayName.toLowerCase().includes(usernameInput)
    );

    console.log("Wyniki", results);

    searchResults.textContent = "";

    for(let i = 0; i < results.length; i++){
        let user = results[i];

        let resultDisplay = document.createElement("li");
        resultDisplay.textContent = user.displayName;
        resultDisplay.id = "resultDisplay" + i;

        let inviteUserBtn = document.createElement("button");
        inviteUserBtn.textContent = "Zaproś";
        inviteUserBtn.dataset.uid = user.uid;

        inviteUserBtn.addEventListener("click", async () => {
            console.log("Zaproszono użytkownika:", user.displayName, " o uid:", inviteUserBtn.dataset.uid);

            try{
                await db.collection("friendRequests").add({
                    fromUid: auth.currentUser.uid,
                    fromDisplayName: currentUserName.data().displayName,
                    to: inviteUserBtn.dataset.uid,
                    status: "pending",
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                alert("Zaproszenie wysłane!");
            }catch(error){
                console.error("Błąd przy wysyłaniu zaproszenia:", error);
            }
        });

        searchResults.appendChild(resultDisplay);
        resultDisplay.appendChild(inviteUserBtn);
    }
    }
});
});