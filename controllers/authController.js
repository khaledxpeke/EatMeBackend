const User = require("../models/user");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
app.use(express.json());

exports.register = async (req, res, next) => {
  const { email,username, password,gender,phone,address,date,country,region ,postal,image} = req.body;
  const user = await User.findOne({ email });
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        email,
        username,
        password: hash,
        gender,
        phone,
        address,
        date,
        country,
        region,
        postal,
        image, 

      })
        .then((user) => {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, email,username },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            user: user._id,
            token:token,
          });
        })
        .catch((error) =>
          res.status(400).json({
            message: "User not successful created",
            error: error.message,
          })
        );
    });
  } catch {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "email or Password not present",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      });
    } else {
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, email },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            user: user._id,
            token: token,
          });
        } else {
          res.status(400).json({ message: "Login not succesful" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.update = async (req, res, next) => {
  const { id } = req.body;

  if (id) {


    await User.findById(id);
  } else {
    res.status(400).json({ message: " Id not present" });
  }
  await User.findById(id)
    .then((user) => {
      // Third - Verifies the user is not an admin
      
        user.save((err) => {
          //Monogodb error checker
          if (err) {
            res
              .status("400")
              .json({ message: "An error occurred", error: err.message });
            process.exit(1);
          }
          res.status("201").json( user );
        });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ message: "An error occurred", error: error.message });
    });
};

exports.getUsers = async (req, res, next) => {
  await User.find({})
    .then((users) => {
      const userFunction = users.map((user) => {
        const container = {};
        container.email = user.email;
        container.username = user.username;
        container.gender = user.gender;
        container.phone = user.phone;
        container.address = user.address;
        container.date = user.date;
        container.Country = user.Country;
        container.region = user.region;
        container.postal = user.postal;
        container.image = user.image;

        return container;
      });
      res.status(200).json({ user: userFunction });
    })
    .catch((err) =>
      res.status(401).json({ message: "Not successful", error: err.message })
    );
};

exports.logout = async (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(401).send("Incorrect password");
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .send("New password and confirmation password do not match");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).send("Password updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.findEmail = async (req, res) => {
  const { email } = req.body;

  // Look up the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send('User not found');
  }

  res.send({ userId: user._id });
}

exports.resetPassword = async (req, res) => {
  const { userId, newPassword, confirmPassword } = req.body;
try{

  if (!newPassword || newPassword.trim().length < 8) {
    return res.status(400).send('New password must be at least 8 characters long');
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).send('New password and confirmation password do not match');
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).send('User not found');
  }


  const passwordMatch = await bcrypt.compare(newPassword, user.password);
  if (passwordMatch) {
    return res.status(400).send('New password cannot be the same as the current password');
  }


  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);


  user.password = passwordHash;
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.send({ token });}
  catch(err){
    console.log(err)
  }
}

exports.updateProfile = async (req, res) => {
  const { username, gender, phone, address, date, country, region, postal, image } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = username || user.username;
    user.gender = gender || user.gender;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.date = date || user.date;
    user.country = country || user.country;
    user.region = region || user.region;
    user.postal = postal || user.postal;
    user.image = image || user.image;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}