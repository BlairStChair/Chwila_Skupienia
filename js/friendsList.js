document.addEventListener("DOMContentLoaded", () => {
const userSearch = document.querySelector(".userSearch");
const searchResults = document.querySelector(".searchResults")
const userInvites = document.querySelector(".userInvites");
const invitesList = document.querySelector(".invitesList");
const userInvitesTitle = document.querySelector(".userInvitesTitle");
const usersFriends = document.querySelector(".usersFriends");       
const usersFriendsList = document.querySelector(".usersFriendsList");

const auth = firebase.auth();
const db = firebase.firestore();

let currentUserName = "";
let usersGlobal = [];
let nameSpan;

//autentykacja użytkownika
auth.onAuthStateChanged(async (user) => {
    currentUserName = await db.collection("users").doc(user.uid).get();
    const userData = currentUserName.data();

    const userName = currentUserName.data();
});

//event przekierowuje na stronę innego użytkownika jak się kliknie jego nazwę
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("friend-name")) {
        const uid = e.target.dataset.uid;
        window.location.href = `../pages/diffrentUserProfilePage.html?uid=${uid}`;
    }
});

//pobranie nazw użytkowników z bazy, żeby potem wyszukiwać wśród tej tablicy obiektów użytkowników do zaproszenia
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

let clickCounter = 0;

//wyświetlenie listy znajomych
usersFriends.addEventListener("click", async (e) => {
   e.preventDefault();

   //upośledzony sposób, żeby lista nie generowała się w nieskończoność tylko raz
    if(clickCounter % 2 !== 0){
        return;
    }else{

    const currentUserUID = auth.currentUser.uid;

    console.log(currentUserUID);

    let friendRequestsSnapshot = await db.collection("friendRequests").get();
    console.log(friendRequestsSnapshot);

    const friendUids = new Set();

    //szukanie znajomych na podstawie czy w kolekcji z zaproszeniami ma status zaakceptowany
    friendRequestsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if(data.status !== "accepted") return;

        if(data.to === currentUserUID){
            friendUids.add(data.fromUid);
        }

        if(data.fromUid === currentUserUID){
            friendUids.add(data.to);
        }
    });

    usersFriendsList.innerHTML = "";
    friendsList = [];

    //dodanie wynajdzionych ludzi co mają z tobą status accepted do tablicy ze znajomymi
    for(const uid of friendUids){
        const userDoc = await db.collection("users").doc(uid).get();
        if(userDoc.exists){
            friendsList.push({
                fromUid: uid,
                fromDisplayName: userDoc.data().displayName
            });
        }
    }

    //wyświetlenie wyniku tej tablicy w DOM
    for(let i = 0; i < friendsList.length; i++){
        let request = friendsList[i];

        let friendResultDisplay = document.createElement("li");
        
        nameSpan = document.createElement("span");
        nameSpan.className = "nameSpan";
        nameSpan.textContent = request.fromDisplayName;
        nameSpan.dataset.uid = request.fromUid;

        usersFriendsList.appendChild(friendResultDisplay);
        friendResultDisplay.appendChild(nameSpan);

        //jak klikasz imię to przenosi na profil użytkownika
        nameSpan.addEventListener("click", () => {
            window.location.href = `../pages/diffrentUserProfilePage.html?uid=${request.fromUid}`;
            console.log("fromUid:", request.fromUid);
            
        }); 
    }
    }
    clickCounter++;
    console.log(clickCounter);
});

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

//wyszukiwanie użytkownika
userSearchBtn.addEventListener("click", async () => {
    let usernameInput = userSearchField.value.toLowerCase();
    console.log(usernameInput);

    //zabezpieczenie, żeby nie wyszukiwać pustego rekordu
    if(usernameInput === null || usernameInput.length === 0){
        alert("Pole wyszukiwania nie może być puste!")
        return;
    }else{
    await getAllUsernames();

    //przejście przez kolekcję użytkowników i sprawdzenie czy nazwa któraś się zawiera we wpisanym tekście w wyszukiwaniu
    let results = usersGlobal.filter(user => 
        user.displayName.toLowerCase().includes(usernameInput)
    );

    console.log("Wyniki", results);

    searchResults.textContent = "";

    //te wyniki dodaje do DOM i je widać
    for(let i = 0; i < results.length; i++){
        let user = results[i];

        let resultDisplay = document.createElement("li");
        resultDisplay.textContent = user.displayName;
        resultDisplay.id = "resultDisplay" + i;

        let inviteUserBtn = document.createElement("button");
        inviteUserBtn.textContent = "Zaproś";
        inviteUserBtn.dataset.uid = user.uid;

        //jak klikniesz zaproś to tworzy rekord w kolekcji z zaproszeniami i potem ktoś będzie mógł zobaczyć zaproszenie
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

//zaproszenia 
userInvitesTitle.addEventListener("click", async (e) => {
    e.preventDefault();

    const currentUserUID = auth.currentUser.uid;

    console.log(currentUserUID);

    //pobranie rekordów z kolekcji z zaproszeniami
    let friendRequestsSnapshot = await db.collection("friendRequests").get();
    console.log(friendRequestsSnapshot);

    //kod bierze dokumenty z Firestore, wyciąga tylko te poprawne, formatuje je do prostych obiektów i odrzuca śmieci - ktoś nie ma nazwy użytkownika 
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

    //wyszukuje z tablicy obiektów które mają status pending i wtedy dodaje rekord do invitesResults
    let invitesResults = usersFriendsRequests.filter(request =>
        request.to.includes(currentUserUID) && request.status === "pending"
    );  
    console.log(invitesResults);

    //generuje listę zaproszeń
    for(let i = 0; i < invitesResults.length; i++){
        let request = invitesResults[i];

        let inviteResultDisplay = document.createElement("li");
        
        let nameSpan = document.createElement("span");
        nameSpan.textContent = request.fromDisplayName; 

        //dodaje przyciski do zaakceptowania i odrzucenia
        let AcceptBtn = document.createElement("button");
        AcceptBtn.textContent = "Akceptuj";
        let RejectBtn = document.createElement("button");
        RejectBtn.textContent = "Odrzuć";

        //jak klikniesz akceptuj to zmienia status w rekordzie na zaakceptowany i wtedy zapraszający wyświetli się w znajomych
        AcceptBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            await db.collection("friendRequests").doc(request.id).update({
                status: "accepted"
            });

            let updatedDoc = await db.collection("friendRequests").doc(request.id).get();
            console.log(updatedDoc.data().status);

            //po kliknięciu zaproszenie się usuwa
            inviteResultDisplay.remove();
        });
        //tu tak samo tylko z odrzuceniem zaproszenia
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
});