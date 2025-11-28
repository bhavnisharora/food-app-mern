const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const foodPartnerModel = require("../models/foodpartner.model");

async function registerUser(req, res) {
  const { fullName, email, password } = req.body;

  const isAlreadyUserExists = await userModel.findOne({
    email,
  });

  if (isAlreadyUserExists) {
    return res.status(400).json({
      message: "user already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET
  ); //jwt secret key

  res.cookie("token", token);

  res.status(201).json({
    message: "user registerd successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  });
}

async function loginUser(req, res) {
  console.log("REQ BODY:", req.body);
  const { email, password } = req.body;
  console.log("email", email);

  const user = await userModel.findOne({
    email,
  });

  if (!user) {
    return res.status(404).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "user logged in successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  });
}

function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "logout successfully",
  });
}

async function registerFoodPartner(req, res) {
  const { name, email, password, phone, address, contactName } = req.body;

  const isAlreadyAlreadyExists = await foodPartnerModel.findOne({
    email,
  });

  if (isAlreadyAlreadyExists) {
    return res.status(400).json({
      message: "food partner already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const foodPartner = await foodPartnerModel.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    contactName,
  });

  const token = jwt.sign(
    {
      id: foodPartner._id,
    },
    process.env.JWT_SECRET
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "food partner registered successfully",
    foodPartner: {
      _id: foodPartner._id,
      email: foodPartner.email,
      name: foodPartner.name,
      address: foodPartner.address,
      contactName: foodPartner.contactName,
      phone: foodPartner.phone,
    },
  });
}

async function loginFoodPartner (req, res) {
  const { email, password } = req.body;
  const foodPartner = await foodPartnerModel.findOne({
    email,
  });

  if (!foodPartner) {
    return res.status(400).json({
      message: "Invalid Email or Password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: foodPartner._id,
    },
    process.env.JWT_SECRET
  );
  res.cookie("token", token);
  res.status(200).json({
    message: "Food partner logged in successfully!",
    foodPartner: {
      _id: foodPartner._id,
      email: foodPartner.email,
      name: foodPartner.name,
    },
  });
}

function logoutFoodPartner(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "Food Partner logout out successfully!",
  });
}

module.exports = { registerUser, loginUser, logoutUser, registerFoodPartner,loginFoodPartner, logoutFoodPartner };
