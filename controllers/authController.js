const User = require("../models/user");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
app.use(express.json());
const phone = require('phone');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const multer = require('multer');
const path = require('path');

exports.register = async (req, res, next) => {
  const { email,username, password,gender,phone: rawPhone,address,date,country,region ,state,postal,image} = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  // const { country: phoneCountryCode, phoneNumber: formattedPhone } = phone(rawPhone);
  // if (!formattedPhone) {
  //   return res.status(400).json({ message: "Invalid phone number" });
  // }
  try {
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        email,
        username,
        password: hash,
        gender,
        // phone: formattedPhone,
        address,
        date:new Date(),
        country,
        region,
        state,
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
            message: "This name already exists",
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
      message: "The email or password is incorrect!",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        message: "User not found",
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
            user: user,
            token: token,
          });
        } else {
          res.status(400).json({ message: "The email or password is incorrect!" });
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
        container.country = user.country;
        container.region = user.region;
        container.state = user.state;
        container.postal = user.postal;
        container.image = user.image;

        return container;
      });
      res.status(200).json({ user: userFunction });
    })
    .catch((err) =>
      res.status(401).json({ message: "No users found", error: err.message })
    );
};

exports.getUserbyId = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    res.status(400).json({ message: " Id not present" });}
    else {
      const user= await User.findById(userId);
      res.status(200).json({ user: user }); 
    }

  }

exports.logout = async (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(401).json({message:"Incorrect password"});
    }
    const passmatch = await bcrypt.compare(newPassword, user.password);
    if (passmatch) {
      return res
        .status(400)
        .json({message:"the new password is the same as the old password"});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({message:"Password updated successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Internal Server Error"});
  }
};

exports.findEmail = async (req, res) => {
  const { email } = req.body;

  // Look up the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({message:'User not found'});
  }

  res.json({ userId: user._id });
}

exports.resetPassword = async (req, res) => {
  const { userId, newPassword, confirmPassword } = req.body;
try{

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({message:'User not found'});
  }


  const passwordMatch = await bcrypt.compare(newPassword, user.password);
  if (passwordMatch) {
    return res.status(400).json({message:'New password cannot be the same as the current password'});
  }


  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);


  user.password = passwordHash;
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });}
  catch(err){
    console.log(err)
  }
}

exports.updateProfile = async (req, res) => {
  const { username, gender, phone, address, date, country, region, state, postal } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = username || user.username;
    user.gender = gender || user.gender;
    if (phone) {
      try {
        const phoneNumber = phoneUtil.parseAndKeepRawInput(phone);
        if (!phoneUtil.isValidNumber(phoneNumber)) {
          return res.status(400).json({ error: 'Invalid phone number' });
        }
        user.phone = phoneUtil.format(phoneNumber, 1); // format as international
        user.phoneCountryCode = phoneNumber.getCountryCode().toString(); // save the country code
      } catch (err) {
        console.error(err);
        return res.status(400).json({ error: 'Invalid phone number' });
      }
    } else {
      user.phone = undefined;
      user.phoneCountryCode = undefined;
    }
    user.address = address || user.address;
    user.date = date || user.date;
    user.country = country || user.country;
    user.region = region || user.region;
    user.state = state || user.state;
    user.postal = postal || user.postal;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.updateUserImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { image } = req.body

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { image: image } },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({user})
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads/images'); // Store images in ./uploads/images directory
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = file.originalname.replace(ext, '').toLowerCase().split(' ').join('-');
//     cb(null, name + '-' + Date.now() + ext); // Generate unique filename for each uploaded image
//   }
// });

// // Set up multer middleware for handling file uploads
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5 // 5MB file size limit
//   },
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png/;
//     const mimetype = filetypes.test(file.mimetype);
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb('Error: Only JPEG, JPG, and PNG images allowed');
//     }
//   }
// }).single('image');

// // API endpoint for updating user image
// exports.updateUserImage = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     upload(req, res, async (err) => {
//       if (err) {
//         console.error(err.message);
//         return res.status(400).json({ error: err.message });
//       }

//       if (!req.file) {
//         return res.status(400).json({ error: 'No image file provided' });
//       }

//       const user = await User.findOneAndUpdate(
//         { _id: userId },
//         { $set: { image: req.file.path } },
//         { new: true }
//       );

//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       res.json("Image successfully updated");
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Server error' });
//   }
// };