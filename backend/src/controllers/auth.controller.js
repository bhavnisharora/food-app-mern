const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    "aefbd3b158546ee0c257f560a8bbc6c2be18d7ac"
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

  if(!isPasswordValid){
    return res.status(400).json({
        message : "Invalid email or password"
    })
  }


  const token = jwt.sign({
    id: user._id,
  }, "aefbd3b158546ee0c257f560a8bbc6c2be18d7ac")

  res.cookie("token", token);


  res.status(200).json({
    message : "user logged in successfully",
    user :{
        _id : user._id,
        email : user.email,
        fullName: user.fullName       
    }
  })

}

module.exports = { registerUser, loginUser };
