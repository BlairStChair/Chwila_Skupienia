const currentPage = window.location.pathname.split("/").pop();
const buttons = document.querySelectorAll(".navBtn");

buttons.forEach(btn => {
  if (btn.getAttribute("href") === currentPage) {
    btn.classList.add("active");
  }
});
