const profileLink = document.querySelector("#profileLink");

profileLink.addEventListener("click", () => {
    alert("Zarejestruj się, aby wyświetlić profil");
    window.location.href = "dashboardPageForGuests.html";
    profileLink.href = "";
});