const logoutBtn = document.querySelector(".logoutBtn");

logoutBtn.addEventListener("click", async () => {
    try{
        await auth.signOut();
        alert("Zostałeś wylogowany!");
        window.location.replace = "loginPage.html";
    }catch (error){
        console.log(error.message);
        alert("Wystąpił błąd podczas wylogowywania!");
    }
});