const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

const authRoutes = require("./routes/auth.routes");

mongoose
  .connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/backend_assessment"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log("DB error:", err.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
