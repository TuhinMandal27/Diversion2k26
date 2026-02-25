const hospitals = [
  { name: "Apollo Hospital", distance: "2.3 km" },
  { name: "Railway Hospital", distance: "1.1 km" }
];

const list = document.getElementById("hospitalList");
hospitals.forEach(h => {
  list.innerHTML += `<li>${h.name} — ${h.distance}</li>`;
});