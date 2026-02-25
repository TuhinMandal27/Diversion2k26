async function triggerSOS() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const data = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    };

    await fetch("/api/sos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    document.getElementById("sosModal").classList.add("active");
  });
}

function closeModal() {
  document.getElementById("sosModal").classList.remove("active");
}