const express = require("express");
const router = express.Router();

const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const {
  getCurrentUser,
  getAllUsers,
  activateUser,
  deactivateUser,
} = require("../controllers/userController");

router.get("/me", authMiddleware, getCurrentUser);

router.get("/", authMiddleware, adminMiddleware, getAllUsers);

router.patch("/:id/activate", authMiddleware, adminMiddleware, activateUser);
router.patch(
  "/:id/deactivate",
  authMiddleware,
  adminMiddleware,
  deactivateUser
);

module.exports = router;
