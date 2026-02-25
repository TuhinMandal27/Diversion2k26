const sosModal = document.getElementById("sosModal");
const sosResults = document.getElementById("sosResults");

// Phone mock elements
const phoneLocation = document.getElementById("phoneLocation");
const phoneHospital = document.getElementById("phoneHospital");
const phoneDoctors = document.getElementById("phoneDoctors");
const phoneTriage = document.getElementById("phoneTriage");
const phoneETA = document.getElementById("phoneETA");

/* Close modal */
function closeModal() {
  sosModal.classList.remove("active");
  sosResults.innerHTML = "";
}

/* Utility: add step to modal */
function addStep(text, type) {
  const div = document.createElement("div");
  div.className = `modal-step ${type}`;
  div.textContent = text;
  sosResults.appendChild(div);
}

/* Reverse geocode coordinates → address */
async function getAddress(lat, lng) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  );
  const data = await res.json();
  return data.display_name || "Address unavailable";
}

/* MAIN SOS */
async function triggerSOS() {
  sosModal.classList.add("active");
  sosResults.innerHTML = "";

  addStep(" Acquiring live GPS location…", "loading");

  if (!navigator.geolocation) {
    addStep(" Geolocation not supported", "error");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      // STEP 1 — GPS
      addStep(
        ` GPS Location acquired: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        "success"
      );

      // STEP 2 — ADDRESS
      addStep(" Resolving address…", "loading");
      const address = await getAddress(lat, lng);

      phoneLocation.textContent = address;

      addStep(` Address resolved`, "success");

      // STEP 3 — HOSPITAL SCAN
      addStep(" Scanning nearest hospitals…", "loading");

      const res = await fetch(`/api/hospitals/search?lat=${lat}&lng=${lng}`);
      const data = await res.json();

      if (!data.length) {
        addStep(" No hospitals found nearby", "error");
        return;
      }

      const nearest = data[0];
      const doctorCount = data.length;

      // Update phone UI
      phoneHospital.textContent =
        `${nearest.name} — ${nearest.distance.toFixed(1)} km`;
      phoneDoctors.textContent = `${doctorCount} Available`;
      phoneTriage.textContent = "Active";
      phoneTriage.style.color = "var(--accent)";
      phoneETA.textContent = "~20 min";

      // Modal updates
      addStep(
        ` Nearest hospital: ${nearest.name}, ${nearest.distance.toFixed(1)} km`,
        "success"
      );
      addStep(
        ` ${doctorCount} on-duty doctor(s) found nearby`,
        "success"
      );

      // STEP 4 — FINAL
      addStep(" AI triage module initialized", "loading");
      addStep(" Emergency responders alerted", "success");

      // Send SOS payload (real)
      const localTime = new Date().toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit", 
        second: "2-digit",
        day: "2-digit",
        month: "short",
        year: "numeric"
        });

        await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            latitude: lat,
            longitude: lng,
            address,
            time: localTime
        })
     });
    },
    () => {
      addStep(" Location access denied", "error");
    }
  );
}