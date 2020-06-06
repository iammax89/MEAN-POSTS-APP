const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const createNewUser = async (req, res, next) => {
  const { email, password } = req.body;
  let existedUser;
  try {
    existedUser = await User.findOne({ email: email });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
  if (existedUser) {
    res.status(500).json({
      message: "User exists already. Please login instead.",
    });
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
  const newUser = new User({
    email,
    password: hashedPassword,
    posts: [],
  });
  let createdUser;
  try {
    createdUser = await newUser.save();
  } catch (error) {
    res.status(500).json({
      error,
    });
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser._id,
        email: createdUser.email,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    res.status(500).json({
      error,
    });
  }

  res.status(201).json({
    message: "User created successfully!",
    userData: {
      id: createdUser._id,
      email: createdUser.email,
    },
    token: token,
    expiresIn: 3600,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
  if (!user) {
    res.status(401).json({
      message:
        "User wasn't found. Please check your credentials and try again.",
    });
  }
  let isValid;
  try {
    isValid = await bcrypt.compare(password, user.password);
  } catch (error) {
    res.status(500).json({ error });
  }
  if (!isValid) {
    res.status(500).json({
      message:
        "Password is incorrect. Please check your credentials and try again.",
    });
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Could not login. Please check your credentials and try again.",
    });
  }

  res.status(200).json({
    message: "Login successfully!",
    userData: {
      id: user._id,
      email: user.email,
    },
    token: token,
    expiresIn: 3600,
  });
};

module.exports.createNewUser = createNewUser;
module.exports.login = login;
