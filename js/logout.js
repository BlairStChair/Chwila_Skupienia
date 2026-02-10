const logoutBtn = document.querySelector(".logoutBtn");

auth.onAuthStateChanged((user) => {
    if(!user){
        location.replace("loginPage.html");
    }
});

logoutBtn.addEventListener("click", async () => {
    try{
        //używam funkcji gotowej z firebase, które wylogowuje, żeby nie było, że się nie wyloguje i ktoś ma na zawsze dostęp do aplikacji 
        //tylko trzeba się logować znowu
        await auth.signOut();
        alert("Zostałeś wylogowany!");
        location.replace("loginPage.html");
    }catch(error){
        console.log(error.message);
        alert("Wystąpił błąd podczas wylogowywania!");
    }
});