const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://useranagementsystem.vercel.app",
    ],
    credentials: true,
  })
);

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
      console.log("DB error:", err.message);
      process.exit(1);
    });
}

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

module.exports = app;
