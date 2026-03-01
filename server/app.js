require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");


const authRoutes = require("./routes/auth.routes");
const sosRoutes = require("./routes/sos.routes");
const hospitalRoutes = require("./routes/hospital.routes");
const aiRoutes = require("./routes/ai.routes");
const chatbotRoute = require("./routes/chatbot.routes");




const app = express();

app.use(cors());
app.use(express.json());

// serve frontend
const publicPath = path.resolve(__dirname, "../public");
console.log("Serving public from:", publicPath);

app.use(express.static(publicPath));

// default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chatbot", chatbotRoute);


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});