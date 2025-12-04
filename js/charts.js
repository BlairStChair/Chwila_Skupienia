document.addEventListener("DOMContentLoaded", () => {
function getWeeklyDates(){
    let todayDate = new Date();
    let weeklyDates = [];

    console.log(todayDate);

    for(let i = 7; i > 0; i--){
        let pastDate = new Date(todayDate.getTime());
        pastDate.setDate(pastDate.getDate() - i);
        weeklyDates.push(pastDate.toLocaleDateString("default",
            {
                day: "numeric", month: "short"
            }
        ));
    }
    
    weeklyDates.push("Today");
    console.log(weeklyDates);
    return weeklyDates;
}

getWeeklyDates();

var xValues = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
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