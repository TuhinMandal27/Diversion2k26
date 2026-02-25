const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const sosRoutes = require("./routes/sos.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/sos", sosRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});