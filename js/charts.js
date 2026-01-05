document.addEventListener("DOMContentLoaded", () => {

const db = firebase.firestore();

let weeklyDatesToGetData = [];

function getWeeklyDates(){
    let todayDate = new Date();
    let weeklyDatesToDisplay = [];
    let dayOfWeek = todayDate.getDay();
    let DaysToMonday = 0;
    let monday = new Date(todayDate);

    weeklyDatesToGetData = [];

    console.log("monday -", monday);
    console.log(todayDate);
    console.log(dayOfWeek);
    
    if(dayOfWeek == 0){
      DaysToMonday = 1;
    }else{
      DaysToMonday = 1 - dayOfWeek;
    }

    monday.setDate(todayDate.getDate() + DaysToMonday);

    for(let i = 7; i > 0; i--){
        let date = new Date(monday);
        date.setDate(monday.getDate() - i);

        weeklyDatesToDisplay.push(date.toLocaleDateString("default",
            {
                day: "numeric", month: "long"
            }
        ));

        weeklyDatesToGetData.push(date.toISOString().split("T")[0]);
    }

    console.log(weeklyDatesToDisplay);
    console.log(weeklyDatesToGetData);
    return weeklyDatesToDisplay;
}

async function getUserStats(uid){
  let weeklyDates = getWeeklyDates();
  let downloadedMinutes = [];

  for(let i = 0; i < 7; i++){
    let docRef = db.collection("sessionsInfo").doc(uid).collection("stats").doc(weeklyDatesToGetData[i]);
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
  const labels = getWeeklyDates();
  const ctx = document.getElementById("weeklyChart").getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "#381D5C");
  gradient.addColorStop(1, "#141414");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
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
        yAxes: [{
          ticks: { beginAtZero: true }
        }]
      }
    }
  });
}

window.getUserStats = getUserStats;
window.createChart = createChart;
});