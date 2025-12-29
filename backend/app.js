const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");

require("dotenv").config();

const app = express();
app.use(express.json());

mongoose
  .connect(
    process.env.MONGO_URI
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
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
