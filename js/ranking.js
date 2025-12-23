document.addEventListener("DOMContentLoaded", () => {
const monthlyRankingList = document.querySelector("#monthlyRankingList");
console.log("monthlyRankingList element:", monthlyRankingList);

const auth = firebase.auth();
const db = firebase.firestore();

let rankingDate;
let friendsList = [];

let profileUid;
const urlParams = new URLSearchParams(window.location.search);
const profileUidFromUrl = urlParams.get("uid");

auth.onAuthStateChanged(async (user) => {
    getMonth();

    profileUid = profileUidFromUrl || user.uid;
    
    await getUsersList(profileUid);

    const profileOwner = await addCurrentUserToList(profileUid);
    friendsList.push(profileOwner);

    friendsList = await addMonthlyMinutesToFriendsList(friendsList);
    monthlyRankingList.innerHTML = "";
    setRanking();
});

function getMonth(){
    let todayDate = new Date();
    let year = todayDate.getFullYear()
    let month = todayDate.getMonth() + 1;
    rankingDate = year + "-" + month;

    console.log("rankingDate: ", rankingDate);
}

async function getUsersList(profileUid) {
    const snapshot = await db.collection("friendRequests").get();

    const friendUids = new Set();

    //Okazało się że ta funkcja nie działa przy profilu innego użytkownika
    //bo wcześniejszy kod uwzględniał znajomość jako jednokierunkową a nie
    //brał pod uwagę że ten użytkownik wysłał mi zaproszenie które zaakceptowałam
    //ale ja nigdy mu zaproszenia nie wysłałam przez co nie zostałam zaliczona jako jego przyjaciel

    snapshot.docs.forEach(doc => {
        const data = doc.data();
        if(data.status !== "accepted") return;

        if(data.to === profileUid){
            friendUids.add(data.fromUid);
        }

        if(data.fromUid === profileUid){
            friendUids.add(data.to);
        }
    });

    friendsList = [];

    for(const uid of friendUids){
        const userDoc = await db.collection("users").doc(uid).get();
        if(userDoc.exists){
            friendsList.push({
                fromUid: uid,
                fromDisplayName: userDoc.data().displayName
            });
        }
    }

    console.log("friendsList:", friendsList);
}

async function countUsersMinutes(uid){
    let totalMonthlyMinutes = 0;

    let userRef = db.collection("sessionsInfo").doc(uid).collection("stats");
    let userSnapshot = await userRef.get();

    userSnapshot.forEach(doc => {
    let data = doc.data();
    if(data.date && data.date.startsWith(rankingDate)){
        totalMonthlyMinutes += data.minutes || 0;
    }
  });

  console.log(totalMonthlyMinutes);
  return totalMonthlyMinutes;
}

async function addMonthlyMinutesToFriendsList(friends){
    for(let friend of friends){
        friend.totalMonthlyMinutes = await countUsersMinutes(friend.fromUid);
        friend.totalMinutesRest = friend.totalMonthlyMinutes % 60;
        friend.totalWholeHours = Math.floor(friend.totalMonthlyMinutes / 60);
        friend.totalMonthlyHours = friend.totalWholeHours + " godz. " + friend.totalMinutesRest + " min. " 
    }
    return friends;
}

async function addCurrentUserToList(uid){
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();

    return{
        id: uid,
        fromDisplayName: userData.displayName,
        fromUid: uid,
        to: [],
        status: "userToAdd"
    };
}

function setRanking(){
    friendsList.sort((a, b) => b.totalMonthlyMinutes - a.totalMonthlyMinutes);

    for(let i = 0; i < friendsList.length; i++) {
        console.log(`${i + 1}. ${friendsList[i].fromDisplayName} - ${friendsList[i].totalMonthlyHours}`);
        let rankingListItem = document.createElement("li");
        rankingListItem.textContent = `${friendsList[i].fromDisplayName} - ${friendsList[i].totalMonthlyHours}`;
        monthlyRankingList.appendChild(rankingListItem);
    }
}
});