const btn = document.getElementById("findHospitals");
const list = document.getElementById("hospitalList");

btn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    list.innerHTML = "Geolocation not supported.";
    return;
  }

  list.innerHTML = " Fetching location...";

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const res = await fetch(`/api/hospitals?lat=${lat}&lng=${lng}`);
    const hospitals = await res.json();

    if (hospitals.length === 0) {
      list.innerHTML = "No hospitals found nearby.";
      return;
    }

    list.innerHTML = hospitals.map(h => `
      <div class="feature-card" style="margin-bottom:1rem;">
        <h3>${h.name}</h3>
        <p>${h.address}</p>
        <p> ${h.phone}</p>
        <p><strong>${h.distance.toFixed(2)} km away</strong></p>
      </div>
    `).join("");
  });
});
