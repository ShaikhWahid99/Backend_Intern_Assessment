const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log("Get current user error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const users = await User.find().select("-password").skip(skip).limit(limit);

    const totalUsers = await User.countDocuments();

    res.json({
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    console.log("Get all users error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.status = "active";
    await user.save();

    res.json({ message: "User activated successfully" });
  } catch (error) {
    console.log("Activate user error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.status = "inactive";
    await user.save();

    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    console.log("Deactivate user error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      return res
        .status(400)
        .json({ error: "Full name and email are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const emailExists = await User.findOne({
      email,
      _id: { $ne: req.user.id },
    });

    if (emailExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, email },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log("Update profile error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Old password and new password are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "New password must be at least 8 characters long" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("Change password error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
