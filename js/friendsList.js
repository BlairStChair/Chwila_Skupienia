document.addEventListener("DOMContentLoaded", () => {
const userSearch = document.querySelector(".userSearch");
const searchResults = document.querySelector(".searchResults")
const userInvites = document.querySelector(".userInvites");
const invitesList = document.querySelector(".invitesList");
const userInvitesTitle = document.querySelector(".userInvitesTitle");
const usersFriends = document.querySelector(".usersFriends");        // przycisk/sekcja, którą klikasz
const usersFriendsList = document.querySelector(".usersFriendsList");

const auth = firebase.auth();
const db = firebase.firestore();

let currentUserName = "";
let usersGlobal = [];
let nameSpan;

auth.onAuthStateChanged(async (user) => {
    currentUserName = await db.collection("users").doc(user.uid).get();
    const userData = currentUserName.data();

    const userName = currentUserName.data();
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("friend-name")) {
        const uid = e.target.dataset.uid;
        window.location.href = `../pages/diffrentUserProfilePage.html?uid=${uid}`;
    }
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

userInvitesTitle.addEventListener("click", async (e) => {
    e.preventDefault();

    const currentUserUID = auth.currentUser.uid;

    console.log(currentUserUID);

    let friendRequestsSnapshot = await db.collection("friendRequests").get();
    console.log(friendRequestsSnapshot);

    let usersFriendsRequests = friendRequestsSnapshot.docs.map(doc => {
        let data = doc.data();
        if (data.fromDisplayName){
            return { 
            id: doc.id,
            fromDisplayName: data.fromDisplayName, 
            to: data.to,
            status: data.status || "pending" 
            };
        }
        return null;
        }).filter(userRequest => userRequest !== null); 

    console.log(usersFriendsRequests);

    let invitesResults = usersFriendsRequests.filter(request =>
        request.to.includes(currentUserUID) && request.status === "pending"
    );  
    console.log(invitesResults);

    for(let i = 0; i < invitesResults.length; i++){
        let request = invitesResults[i];

        let inviteResultDisplay = document.createElement("li");
        
        let nameSpan = document.createElement("span");
        nameSpan.textContent = request.fromDisplayName; 

        let AcceptBtn = document.createElement("button");
        AcceptBtn.textContent = "Akceptuj";
        let RejectBtn = document.createElement("button");
        RejectBtn.textContent = "Odrzuć";

        AcceptBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            await db.collection("friendRequests").doc(request.id).update({
                status: "accepted"
            });

            let updatedDoc = await db.collection("friendRequests").doc(request.id).get();
            console.log(updatedDoc.data().status);

            inviteResultDisplay.remove();
        });

        RejectBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            await db.collection("friendRequests").doc(request.id).update({
                status: "rejected"
            });

            let updatedDoc = await db.collection("friendRequests").doc(request.id).get();
            console.log(updatedDoc.data().status);

            inviteResultDisplay.remove();
        });

        invitesList.appendChild(inviteResultDisplay);
        inviteResultDisplay.appendChild(nameSpan);
        inviteResultDisplay.appendChild(AcceptBtn);
        inviteResultDisplay.appendChild(RejectBtn);
    }
});

let clickCounter = 0;

usersFriends.addEventListener("click", async (e) => {
   e.preventDefault();

    if(clickCounter % 2 !== 0){
        return;
    }else{

    const currentUserUID = auth.currentUser.uid;

    console.log(currentUserUID);

    let friendRequestsSnapshot = await db.collection("friendRequests").get();
    console.log(friendRequestsSnapshot);

    let usersAcceptedFriends = friendRequestsSnapshot.docs.map(doc => {
        let data = doc.data();
        if (data.fromDisplayName){
            return { 
            id: doc.id,
            fromDisplayName: data.fromDisplayName,
            fromUid: data.fromUid, 
            to: data.to,
            status: data.status  
            };
        }
        return null;
        }).filter(userRequest => userRequest !== null); 

    console.log(usersAcceptedFriends);

    let invitesResults = usersAcceptedFriends.filter(request =>
        request.to.includes(currentUserUID) && request.status === "accepted"
    );  
    console.log(invitesResults);

    for(let i = 0; i < invitesResults.length; i++){
        let request = invitesResults[i];

        let friendResultDisplay = document.createElement("li");
        
        nameSpan = document.createElement("span");
        nameSpan.className = "nameSpan";
        nameSpan.textContent = request.fromDisplayName;
        nameSpan.dataset.uid = request.fromUid;

        usersFriendsList.appendChild(friendResultDisplay);
        friendResultDisplay.appendChild(nameSpan);

        nameSpan.addEventListener("click", () => {
            window.location.href = `../pages/diffrentUserProfilePage.html?uid=${request.fromUid}`;
            console.log("fromUid:", request.fromUid);
            
        }); 
    }
    }
    clickCounter++;
    console.log(clickCounter);
});

});