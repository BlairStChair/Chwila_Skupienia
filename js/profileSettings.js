const avatarFile = document.querySelector("#avatarFile");
const avatar = document.querySelector("#avatar")
const submitAvatar = document.querySelector("#submitAvatar");

const auth = firebase.auth();
const db = firebase.firestore();

avatarFile.addEventListener("change", () => {
    avatar.src = URL.createObjectURL(avatarFile.files[0]);
})

submitAvatar.addEventListener("click", () => {

});