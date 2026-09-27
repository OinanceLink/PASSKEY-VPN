let currentUser = null;
let isConnected = false;

let selectedVPN = {
  flag: "🇺🇸",
  country: "United States",
  city: "New York"
};


/* -------------------------
   SCREEN CONTROL
------------------------- */

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const screen = document.getElementById(screenId);

  if (screen) {
    screen.classList.add("active");
  }

  window.scrollTo(0, 0);
}


/* -------------------------
   CREATE ACCOUNT
------------------------- */

function signup() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!name || !email || !password) {
    alert("Please complete all fields.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  currentUser = {
    name: name,
    email: email,
    plan: "No active plan",
    owner: false
  };

  localStorage.setItem(
    "passkeyVPNUser",
    JSON.stringify(currentUser)
  );

  updateAccount();

  alert("Account created successfully.");

  showScreen("subscriptionScreen");
}


/* -------------------------
   LOGIN
------------------------- */

function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Enter your email and password.");
    return;
  }

  const savedUser = localStorage.getItem("passkeyVPNUser");

  if (!savedUser) {
    alert("No account found. Please create an account first.");
    return;
  }

  currentUser = JSON.parse(savedUser);

  if (currentUser.email !== email) {
    alert("Incorrect email or password.");
    return;
  }

  updateAccount();

  showScreen("homeScreen");
}


/* -------------------------
   ACCOUNT
------------------------- */

function updateAccount() {
  if (!currentUser) return;

  document.getElementById("welcomeUser").textContent =
    "Welcome, " + currentUser.name;

  document.getElementById("accountName").textContent =
    currentUser.name;

  document.getElementById("accountEmail").textContent =
    currentUser.email;

  document.getElementById("accountPlan").textContent =
    currentUser.plan;
}


/* -------------------------
   VPN LOCATION
------------------------- */

function selectLocation(flag, country, city) {
  selectedVPN = {
    flag: flag,
    country: country,
    city: city
  };

  document.getElementById("selectedCountry").textContent =
    country;

  document.getElementById("selectedCity").textContent =
    city;

  document.querySelector(".flag").textContent = flag;

  showScreen("homeScreen");
}


/* -------------------------
   VPN CONNECT BUTTON
------------------------- */

function toggleVPN() {

  /*
    PROTOTYPE ONLY

    This does NOT create a real VPN connection.
    The real WireGuard connection will be added later.
  */

  if (!currentUser) {
    alert("Please log in first.");
    showScreen("loginScreen");
    return;
  }

  if (currentUser.plan === "No active plan" && !currentUser.owner) {
    alert("An active subscription is required to use PASSKEY-VPN.");

    showScreen("subscriptionScreen");
    return;
  }

  isConnected = !isConnected;

  const status =
    document.getElementById("connectionStatus");

  const button =
    document.getElementById("connectButton");

  const message =
    document.getElementById("connectionMessage");

  const security =
    document.getElementById("securityText");


  if (isConnected) {

    status.textContent = "● CONNECTED";
    status.classList.add("connected");

    button.textContent = "DISCONNECT";
    button.classList.add("connected");

    message.textContent =
      "PASSKEY-VPN connection active.";

    security.textContent =
      "Connection protected";

  } else {

    status.textContent = "● NOT CONNECTED";
    status.classList.remove("connected");

    button.textContent = "CONNECT";
    button.classList.remove("connected");

    message.textContent =
      "Your connection is not protected.";

    security.textContent =
      "Waiting for connection";
  }
}


/* -------------------------
   SUBSCRIPTION
------------------------- */

function subscribe() {

  if (!currentUser) {
    alert("Please create an account first.");
    showScreen("signupScreen");
    return;
  }

  /*
    DEMO SUBSCRIPTION

    This does NOT charge money yet.
    Real payment processing will be added later.
  */

  currentUser.plan = "Premium";

  localStorage.setItem(
    "passkeyVPNUser",
    JSON.stringify(currentUser)
  );

  updateAccount();

  alert(
    "Demo subscription activated.\n\nReal payment processing will be added later."
  );

  showScreen("homeScreen");
}


/* -------------------------
   LOGOUT
------------------------- */

function logout() {

  isConnected = false;

  currentUser = null;

  showScreen("loginScreen");
}


/* -------------------------
   LOAD SAVED USER
------------------------- */

window.addEventListener("DOMContentLoaded", () => {

  const savedUser =
    localStorage.getItem("passkeyVPNUser");

  if (savedUser) {

    try {

      currentUser = JSON.parse(savedUser);

      updateAccount();

    } catch (error) {

      localStorage.removeItem("passkeyVPNUser");

    }

  }

});
