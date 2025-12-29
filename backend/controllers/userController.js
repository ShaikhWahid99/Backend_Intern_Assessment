const User = require("../models/User");

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
