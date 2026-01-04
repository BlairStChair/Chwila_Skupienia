const toggleBtn = document.querySelector(".togglePlayer");
const player = document.querySelector(".musicPlayer");
const wrapper = document.querySelector(".musicPlayerWrapper");

toggleBtn.addEventListener("click", () => {
  player.classList.toggle("hidden");
  wrapper.classList.toggle("collapsed");
});
