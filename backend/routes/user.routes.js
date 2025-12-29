const express = require("express");
const router = express.Router();

const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const {
  getCurrentUser,
  getAllUsers,
} = require("../controllers/userController");

router.get("/me", authMiddleware, getCurrentUser);

router.get("/", authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;
