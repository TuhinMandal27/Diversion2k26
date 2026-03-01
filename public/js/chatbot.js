async function sendMessage() {

  const chatBox = document.getElementById("chatBox");
  const input = document.getElementById("chatInput");

  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  addMessage("Typing...", "ai");

  try {
    const res = await fetch("/api/chatbot/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    document.querySelector(".message.ai:last-child")?.remove();
    addMessage(data.reply, "ai");

  } catch (error) {
    document.querySelector(".message.ai:last-child")?.remove();
    addMessage("AI service unavailable.", "ai");
  }

}

function addMessage(text, sender) {

  const chatBox = document.getElementById("chatBox");

  const wrapper = document.createElement("div");
  wrapper.className = `message ${sender}`;

  wrapper.innerHTML = `
    <div class="message-bubble">
      ${text}
    </div>
  `;

  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}

window.onload = function() {

  const chatBox = document.getElementById("chatBox");

  const welcomeMessage = `
  <strong>LifeSavers Medical Assistant AI</strong><br><br>
  ⚠ This AI provides general medical guidance only.<br>
  It does NOT provide diagnosis or prescriptions.<br><br>
  In case of emergency (chest pain, breathing difficulty, unconsciousness, severe bleeding), call emergency services immediately.<br><br>
  <em>This AI does not replace a licensed medical professional.</em>
  `;

  const wrapper = document.createElement("div");
  wrapper.className = "message ai";
  wrapper.innerHTML = `<div class="message-bubble">${welcomeMessage}</div>`;

  chatBox.appendChild(wrapper);
};