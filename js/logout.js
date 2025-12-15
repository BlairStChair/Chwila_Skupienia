const logoutBtn = document.querySelector(".logoutBtn");

auth.onAuthStateChanged((user) => {
    if(!user){
        location.replace("loginPage.html");
    }
});

logoutBtn.addEventListener("click", async () => {
    try{
        await auth.signOut();
        alert("Zostałeś wylogowany!");
        location.replace("loginPage.html");
    }catch(error){
        console.log(error.message);
        alert("Wystąpił błąd podczas wylogowywania!");
    }
});