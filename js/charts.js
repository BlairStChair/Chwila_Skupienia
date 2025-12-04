document.addEventListener("DOMContentLoaded", () => {

const weeklyChart = document.querySelector("#weeklyChart");

var xValues = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
var yValues = [10.5, 9, 7.5, 6, 4.5, 3, 1.5];
var barColors = "#e4d4f8ff";

new Chart("weeklyChart", {
  type: "bar",
  data: {
    labels: xValues,
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