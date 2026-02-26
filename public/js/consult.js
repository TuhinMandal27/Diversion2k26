/* ===============================
   RAPIDAID – CONSULT MODULE
   =============================== */

const doctorCard = document.getElementById("doctorCard");
const consultStatus = document.getElementById("consultStatus");
const startVideoBtn = document.getElementById("startVideo");
const localVideo = document.getElementById("localVideo");
const pttBtn = document.getElementById("pttBtn");
const aiStatus = document.getElementById("aiStatus");

let stream = null;
let audioTrack = null;
let videoTrack = null;

/* ===============================
   LOAD ASSIGNED DOCTOR
   =============================== */

const doctor = JSON.parse(sessionStorage.getItem("assignedDoctor"));

if (doctor) {
  doctorCard.innerHTML = `
    <h3>${doctor.name}</h3>
    <p>${doctor.speciality}</p>
    <p>${doctor.hospital}</p>
    <p style="color:var(--accent)">🟢 Available</p>
  `;
  consultStatus.textContent =
    "Doctor connected. Start video for virtual assistance.";
} else {
  doctorCard.innerHTML = "❌ No doctor assigned.";
}

/* ===============================
   START VIDEO (USER ACTION)
   =============================== */

  function sendFrameToAI() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = localVideo.videoWidth;
    canvas.height = localVideo.videoHeight;

    ctx.drawImage(localVideo, 0, 0);
    const frame = canvas.toDataURL("image/jpeg");

    // fetch("/api/ai/analyze", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ frame })
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     aiStatus.textContent = "🧠 AI: " + data.status;

    //     if (data.status.includes("unresponsive")) {
    //       aiStatus.style.color = "#ff4d4d";
    //     } else {
    //       aiStatus.style.color = "#00ffb2";
    //     }
    //   });

    fetch("/api/ai/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frame })
    })
    .then(res => res.json())
    .then(data => {
      aiStatus.textContent = " AI: " + data.status.join(" | ");

      if (data.critical) {
        aiStatus.style.color = "#ff4d4d";
        consultStatus.textContent =
          " Critical condition detected. Doctor alerted.";
      } else {
        aiStatus.style.color = "#00ffb2";
      }
    });
}

setInterval(sendFrameToAI, 2000);

startVideoBtn.addEventListener("click", async () => {
  consultStatus.textContent = "🎥 Starting camera…";

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: true
    });

    localVideo.srcObject = stream;
    localVideo.style.display = "block";

    videoTrack = stream.getVideoTracks()[0];
    audioTrack = stream.getAudioTracks()[0];

    /* Push-to-Talk: mic OFF by default */
    audioTrack.enabled = false;

    consultStatus.textContent =
      "✅ Video active. Hold button to talk.";

    startAIAssistant();

  } catch (err) {
    console.error(err);
    consultStatus.textContent =
      "❌ Camera or microphone permission denied.";
  }
});

/* ===============================
   PUSH-TO-TALK (HOLD TO SPEAK)
   =============================== */

function enableMic() {
  if (audioTrack) {
    audioTrack.enabled = true;
    consultStatus.textContent = "🎙️ Talking…";
  }
}

function disableMic() {
  if (audioTrack) {
    audioTrack.enabled = false;
    consultStatus.textContent = "🔇 Mic muted";
  }
}

/* Desktop */
pttBtn.addEventListener("mousedown", enableMic);
pttBtn.addEventListener("mouseup", disableMic);
pttBtn.addEventListener("mouseleave", disableMic);

/* Mobile */
pttBtn.addEventListener("touchstart", enableMic);
pttBtn.addEventListener("touchend", disableMic);

/* ===============================
   AI ASSISTANT (REAL-TIME VIDEO)
   =============================== */

function startAIAssistant() {
  aiStatus.textContent = "🧠 AI assistant analyzing video feed…";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let lastMotionTime = Date.now();

  setInterval(() => {
    if (!videoTrack || localVideo.readyState < 2) return;

    canvas.width = localVideo.videoWidth;
    canvas.height = localVideo.videoHeight;

    ctx.drawImage(localVideo, 0, 0, canvas.width, canvas.height);

    /* SIMPLE MOTION DETECTION (REAL) */
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let motionDetected = false;
    for (let i = 0; i < frame.length; i += 40) {
      if (frame[i] > 150) {
        motionDetected = true;
        break;
      }
    }
  }, 3000);
}