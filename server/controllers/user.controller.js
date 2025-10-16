import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Chat from "../models/Chat.model.js";

// generate user token
const generateToken = async (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// register user API
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ message: "User already exits", success: false });
    }
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = await generateToken(user._id);

    return res
      .status(200)
      .json({ success: true, message: "User created successfully", token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// login user API
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        const token = await generateToken(user._id);
        return res.status(200).json({
          success: true,
          message: "User logged In Succesfully",
          token,
        });
      }
    }
    return res.json({ success: false, message: "Invalid email or password" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get user API
const getUser = async (req, res) => {
  try {
    const user = req.user;
    return res
      .status(200)
      .json({ sucess: true, message: "User fetched successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get published images API
const getPublishedImages = async (req, res) => {
  try {
    const publishedImages = await Chat.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.isImage": true,
          "messages.isPublished": true,
        },
      },
      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          userName: "$userName",
        },
      },
    ]);

    res.json({ success: true, images: publishedImages.reverse() });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, getUser, getPublishedImages };
