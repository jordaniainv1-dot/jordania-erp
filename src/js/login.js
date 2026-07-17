import {
  loginWithEmail,
  redirectAuthenticatedUser
} from "./auth.js";

const form = document.querySelector("#loginForm");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const message = document.querySelector("#loginMessage");
const submitButton = document.querySelector("#loginButton");
const togglePassword = document.querySelector("#togglePassword");

redirectAuthenticatedUser("./pages/dashboard.html");

togglePassword?.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePassword.textContent = isPassword ? "Ocultar" : "Mostrar";
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("Completa el correo y la contraseña.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Ingresando...";
  showMessage("");

  try {
    await loginWithEmail(email, password);
    window.location.replace("./pages/dashboard.html");
  } catch (error) {
    showMessage(getFriendlyMessage(error.code), "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Iniciar sesión";
  }
});

function showMessage(text, type = "") {
  message.textContent = text;
  message.className = `form-message ${type}`.trim();
}

function getFriendlyMessage(code) {
  const messages = {
    "auth/invalid-email": "El correo electrónico no es válido.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/user-disabled": "Este usuario está deshabilitado.",
    "auth/too-many-requests": "Demasiados intentos. Espera unos minutos.",
    "auth/network-request-failed": "No se pudo conectar. Revisa tu internet."
  };

  return messages[code] || "No fue posible iniciar sesión.";
}
