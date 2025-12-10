document.addEventListener("DOMContentLoaded", () => {

const auth = firebase.auth();
const db = firebase.firestore();

let totalMonthlyMinutes = 0;

let currentUserName = "";
let invitesResults = [];

auth.onAuthStateChanged(async (user) => {
    currentUserName = await db.collection("users").doc(user.uid).get();
    const userData = currentUserName.data();
    const userName = currentUserName.data();

    await getUsersFriends(user.uid);
    getMonthlyMinutes();
});

async function getUsersFriends(currentUserUID){
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

    invitesResults = usersAcceptedFriends.filter(request =>
        request.to.includes(currentUserUID) && request.status === "accepted"
    );  
    console.log(invitesResults);
};

function countUsersMinutes(){

}

function getMonthlyMinutes(){
    let todayDate = new Date();
    let year = todayDate.getFullYear()
    let month = todayDate.getMonth();
    let rankingDate = year + "-" + month;

    console.log("rankingDate: ", rankingDate);
}

});