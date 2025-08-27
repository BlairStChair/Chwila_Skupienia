const avatarFile = document.querySelector("#avatarFile");
const avatar = document.querySelector("#avatar")

avatarFile.addEventListener("change", () => {
    avatar.src = URL.createObjectURL(avatarFile.files[0]);
})