document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");
  const userSection = document.getElementById("userSection");
  const usernameDisplay = document.getElementById("usernameDisplay");

  // If navbar elements don't exist on this page → do nothing
  if (!loginLink || !signupLink || !userSection || !usernameDisplay) {
    return;
  }

  if (user) {
    loginLink.style.display = "none";
    signupLink.style.display = "none";
    userSection.style.display = "flex";
    // usernameDisplay.textContent = user.name;
  } else {
    loginLink.style.display = "block";
    signupLink.style.display = "block";
    userSection.style.display = "none";
  }
});

/* LOGOUT */
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.reload();
}