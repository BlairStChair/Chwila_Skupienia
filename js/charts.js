document.addEventListener("DOMContentLoaded", () => {
const db = firebase.firestore();

function getWeeklyDates(){
    let todayDate = new Date();
    let weeklyDatesToDisplay = [];
    let dayOfWeek = todayDate.getDay();
    let DaysToMonday = 0;
    let monday = new Date(todayDate);

    console.log("monday -", monday);
    console.log(todayDate);
    console.log(dayOfWeek);
    
    if(dayOfWeek == 0){
      DaysToMonday = 1;
    }else{
      DaysToMonday = 1 - dayOfWeek;
    }

    monday.setDate(todayDate.getDate() + DaysToMonday);

    let displayDates = [];
    let isoDates = [];

    for(let i = 7; i > 0; i--){
        let date = new Date(monday);
        date.setDate(monday.getDate() - i);

        displayDates.push(date.toLocaleDateString("default",
            {
                day: "numeric", month: "long"
            }
        ));

        isoDates.push(date.toISOString().split("T")[0]);
    }

    console.log(weeklyDatesToDisplay);
    return {displayDates, isoDates};
}

async function getUserStats(uid){
  const { isoDates } = getWeeklyDates()
  let downloadedMinutes = [];

  for(let date of isoDates){
    let docRef = db.collection("sessionsInfo").doc(uid).collection("stats").doc(date);
    let docSnap = await docRef.get();

    //Wczesniej nie mialam takiego warunku ale musialam go dodac poniewaz dla jednego 
    // dnia tygodnia nie mialam zadnego rekordu wiec wywalalo blad
    if(docSnap.exists){
      downloadedMinutes.push(docSnap.data().minutes | 0);
    }else{
      downloadedMinutes.push(0);
    } 
  }
  console.log(downloadedMinutes);
  return downloadedMinutes;
}
  // troche zmieniłam to żeby ten 
  // gradient działał poprawnie ogólnie nie wiem czy czegoś nie zepsułam
async function createChart(statsArray) {
  const { displayDates } = getWeeklyDates();
  const ctx = document.getElementById("weeklyChart").getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "#381D5C");
  gradient.addColorStop(1, "#141414");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: displayDates,
      datasets: [{
        backgroundColor: gradient,
        borderRadius: 8,
        data: statsArray
      }]
    },
    options: {
      legend: {
      display: false 
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

window.getUserStats = getUserStats;
window.createChart = createChart;
});