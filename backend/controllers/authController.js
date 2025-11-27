const jwt =require("jsonwebtoken");
const User =require("../models/User");

//Helper: Generation jwt
const generateToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"7d",
    });
}

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body || {};

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    // THIS LINE IS THE KEY
    console.error("Register error →", error.message || error);

    // Optional: send the real error only in development
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body || {};

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user and include password (since we set select: false)
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        businessName: user.businessName || "",
        address: user.address || "",
        phone: user.phone || "",
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error →", error.message);
    res.status(500).json({ message: "Server error" });
  }
};   

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      businessName: user.businessName || "",
      address: user.address || "",
      phone: user.phone || "",
    });
  } catch (error) {
    console.error("getMe error →", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only fields that are sent in request
    user.name = req.body.name || user.name;
    user.businessName = req.body.businessName || user.businessName;
    user.address = req.body.address || user.address;
    user.phone = req.body.phone || user.phone;

    // Save updated user
    const updatedUser = await user.save();

    // Send back updated data
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      businessName: updatedUser.businessName || "",
      address: updatedUser.address || "",
      phone: updatedUser.phone || "",
    });
  } catch (error) {
    console.error("Update profile error →", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



