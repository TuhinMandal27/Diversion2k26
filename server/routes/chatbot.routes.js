const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/chat", async (req, res) => {

  const { message } = req.body;
    const bannedTopics = [
    "hack",
    "bomb",
    "weapon",
    "kill",
    "suicide",
    "drugs",
    "explosive",
    "attack"
    ];

    if (bannedTopics.some(word =>
    message.toLowerCase().includes(word)
    )) {
    return res.json({
        reply: "I can only assist with medical-related concerns. If this is a health issue, please describe your symptoms."
    });
    }

  try {
    const bannedTopics = ["hack", "bomb", "weapon", "kill", "drugs"];

    if (bannedTopics.some(word => message.toLowerCase().includes(word))) {
    return res.json({
        reply: "I can only assist with medical-related concerns."
    });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
            {
                role: "system",
                content: `
                You are LifeSavers Medical Assistant AI.

                STRICT RULES:

                1. NEVER give final diagnosis.
                2. NEVER prescribe medication or dosage.
                3. ALWAYS recommend consulting a real doctor.
                4. ONLY give general medical guidance.
                5. If emergency symptoms detected → tell user to call emergency services immediately.
                6. NEVER answer non-medical questions.
                7. NEVER generate harmful, illegal, or unsafe instructions.
                8. Keep answers short, clear, and safe.

                Emergency symptoms include:
                - chest pain
                - breathing difficulty
                - unconsciousness
                - stroke symptoms
                - severe bleeding

                If emergency → respond EXACTLY with:
                "⚠️ This may be a medical emergency. Please seek immediate medical help or call emergency services."

                Always end every response with:
                "This AI does not replace a licensed medical professional."
                `
                },
            {
                role: "user",
                content: message
            }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;

    res.json({ reply });

  } catch (error) {

    console.error("GROQ ERROR:");
    console.log(error.response?.data || error.message);

    res.status(500).json({
      reply: "AI service unavailable."
    });

  }

});

module.exports = router;