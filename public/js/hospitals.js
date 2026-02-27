const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const hospitalList = document.getElementById("hospitalList");
const statusMsg = document.getElementById("statusMsg");

/**
 * Convert city name to latitude & longitude
 */
async function getCoordinates(city) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        city
      )}&format=json`
    );

    const data = await res.json();

    if (!data.length) return null;

    return {
      lat: data[0].lat,
      lon: data[0].lon
    };
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}

/**
 * Fetch hospitals + available doctors
 */
async function fetchAvailability(lat, lng, controller) {
  const res = await fetch(
    `/api/hospitals/search?lat=${lat}&lng=${lng}`,
    { signal: controller.signal }
  );

  if (!res.ok) {
    throw new Error("Hospital API failed");
  }

  return res.json();
}

/**
 * Render results to UI
 */

function renderResults(data) {
  hospitalList.innerHTML = data
    .map(h => `
      <div class="feature-card">
        <div class="feat-icon-wrap"></div>
        <div class="feat-title">${h.name}</div>
        <div class="feat-desc">
           ${h.address}<br>
           Dr. ${h.doctor_name} (${h.speciality})<br>
           ${h.phone || "N/A"}<br>
          <span style="color:var(--accent)"> Available</span><br>
          <strong>${Number(h.distance).toFixed(1)} km away</strong>
        </div>
      </div>
    `)
    .join("");
}

/**
 * Main search handler
 */

searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();

  hospitalList.innerHTML = "";

  if (!city) {
    statusMsg.textContent = "⚠ Please enter a city name.";
    return;
  }

  statusMsg.textContent = " Locating city…";

  const controller = new AbortController();
  setTimeout(() => controller.abort(), 7000);

  try {
    // STEP 1: Get coordinates
    const coords = await getCoordinates(city);

    if (!coords) {
      statusMsg.textContent = "⚠ City not found.";
      return;
    }

    statusMsg.textContent = " Scanning for nearest hospitals...";

    // STEP 2: Fetch hospitals
    const results = await fetchAvailability(
      coords.lat,
      coords.lon,
      controller
    );

    if (!results.length) {
      statusMsg.textContent = "⚠ No doctors available nearby.";
      statusMsg.textContent = "⚠ No hospitals found nearby.";
      return;
    }

    statusMsg.textContent = ` ${results.length} hospital available`;
    renderResults(results);

  } catch (error) {
    console.error("Overpass error:", error.message);
    res.status(500).json({
      error: "Hospital server busy. Please try again."
    });
  }
});
