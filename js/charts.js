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

async function createChart(statsArray){
  const labels = getWeeklyDates();
  var barColors = "#e4d4f8ff";

  new Chart("weeklyChart", {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        backgroundColor: barColors,
        data: statsArray
      }]
    },
    options: {
      legend: {display: false}
    }
  });
  
}

window.getUserStats = getUserStats;
window.createChart = createChart;
});