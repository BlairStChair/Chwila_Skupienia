document.addEventListener("DOMContentLoaded", () => {
const db = firebase.firestore();

//podaje daty dni z poprzedniego tygodnia 
function getWeeklyDates(){
    //pobranie dzisiejszej daty
    let todayDate = new Date();
    let weeklyDatesToDisplay = [];
    let dayOfWeek = todayDate.getDay();
    let DaysToMonday = 0;
    let monday = new Date(todayDate);

    console.log("monday -", monday);
    console.log(todayDate);
    console.log(dayOfWeek);
    
    //jeśli mamy niedziele to cofamy się o 6 dni, a jak inny dzień to cofamy się do poniedziałku
    if(dayOfWeek == 0){
      DaysToMonday = 1;
    }else{
      DaysToMonday = 1 - dayOfWeek;
    }

    //ustawiamy datę na poniedziałek bieżącego tygodnia
    monday.setDate(todayDate.getDate() + DaysToMonday);

    let displayDates = [];
    let isoDates = [];

    //generuje się 7 dat dni z poprzedniego tygodnia do wyświetlenia na wykresie
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

    //zwraca obie tablice z datami z zeszłego tygodnia - jedna dla wykresu, druga w formacie dla kolekcji Firebase
    console.log(weeklyDatesToDisplay);
    return {displayDates, isoDates};
}

//pobiera statystyki użytkownika z Firestore
async function getUserStats(uid){
  const { isoDates } = getWeeklyDates()
  let downloadedMinutes = [];

  //iterujemy po każdej dacie z poprzedniego tygodnia i robimy referencje
  for(let date of isoDates){
    let docRef = db.collection("sessionsInfo").doc(uid).collection("stats").doc(date);
    //pobranie danych z kolekcji na podstawie referencji
    let docSnap = await docRef.get();

    //wczesniej nie mialam takiego warunku ale musialam go dodac poniewaz dla jednego 
    //dnia tygodnia nie mialam zadnego rekordu wiec wywalalo blad
    //chodzi o to, że jeśli dokument z danego dnia istnieje to zapisujemy ile minut jest w rekordzie zapisane a jak nie to wpisujemy, że ktoś pracował 0 minut
    if(docSnap.exists){
      downloadedMinutes.push(docSnap.data().minutes | 0);
    }else{
      downloadedMinutes.push(0);
    } 
  }
  console.log(downloadedMinutes);
  //zwraca tablice minut ile minut ktoś pracował danego dnia
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
      }
    }
  });
}

window.getUserStats = getUserStats;
window.createChart = createChart;
});