import { logoutUser, watchAuth } from "./auth.js";

const email = document.querySelector("#userEmail");
const initial = document.querySelector("#userInitial");
const logout = document.querySelector("#logoutButton");
const menu = document.querySelector("#menuButton");
const sidebar = document.querySelector("#sidebar");
const overlay = document.querySelector("#sidebarOverlay");

watchAuth((user) => {
  if (!user) return window.location.replace("../index.html");
  const value = user.email || "Usuario";
  if (email) email.textContent = value;
  if (initial) initial.textContent = value[0].toUpperCase();
});

logout?.addEventListener("click", async () => {
  await logoutUser();
  window.location.replace("../index.html");
});

menu?.addEventListener("click", () => {
  sidebar?.classList.toggle("is-open");
  overlay?.classList.toggle("is-visible");
});
overlay?.addEventListener("click", () => {
  sidebar?.classList.remove("is-open");
  overlay?.classList.remove("is-visible");
});
