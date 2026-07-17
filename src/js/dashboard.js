import { logoutUser, watchAuth } from "./auth.js";

const userEmail = document.querySelector("#userEmail");
const userInitial = document.querySelector("#userInitial");
const logoutButton = document.querySelector("#logoutButton");
const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector("#sidebar");
const overlay = document.querySelector("#sidebarOverlay");
const currentDate = document.querySelector("#currentDate");

watchAuth((user) => {
  if (!user) {
    window.location.replace("../index.html");
    return;
  }

  const email = user.email || "Usuario";
  userEmail.textContent = email;
  userInitial.textContent = email.charAt(0).toUpperCase();
});

logoutButton?.addEventListener("click", async () => {
  logoutButton.disabled = true;

  try {
    await logoutUser();
    window.location.replace("../index.html");
  } catch (error) {
    alert("No fue posible cerrar la sesión.");
    logoutButton.disabled = false;
  }
});

menuButton?.addEventListener("click", toggleSidebar);
overlay?.addEventListener("click", closeSidebar);

window.addEventListener("resize", () => {
  if (window.innerWidth > 960) {
    closeSidebar();
  }
});

currentDate.textContent = new Intl.DateTimeFormat("es-PA", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
}).format(new Date());

function toggleSidebar() {
  sidebar.classList.toggle("is-open");
  overlay.classList.toggle("is-visible");
}

function closeSidebar() {
  sidebar.classList.remove("is-open");
  overlay.classList.remove("is-visible");
}
