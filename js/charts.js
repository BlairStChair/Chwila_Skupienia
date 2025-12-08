document.addEventListener("DOMContentLoaded", () => {
function getWeeklyDates(){
    let todayDate = new Date();
    let weeklyDates = [];
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

    for(let i = 7; i > 0; i--){
        // let pastDate = new Date(todayDate.getTime());
        // pastDate.setDate(pastDate.getDate() - i);
        let date = new Date(monday);
        date.setDate(monday.getDate() - i);

        weeklyDates.push(date.toLocaleDateString("default",
            {
                day: "numeric", month: "long"
            }
        ));
    }

    // weeklyDates.push("Today");
    console.log(weeklyDates);
    return weeklyDates;
}

var yValues = [10.5, 9, 7.5, 6, 4.5, 3, 1.5];
var barColors = "#e4d4f8ff";

new Chart("weeklyChart", {
  type: "bar",
  data: {
    labels: getWeeklyDates(),
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    legend: {display: false}
  }
});
});