const User = require("../models/user");
const feedback = require("../models/feedbacks");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
app.use(express.json());


exports.add = async (req, res, next) => {
  const { description } = req.body;
  try {
    if (!description) {
      return res.status(400).json({
        message: "Description is required",
      });
    }
    if (description.length < 6) {
      return res
        .status(400)
        .json({ message: "Description less than 6 characters" });
    }
    const feedbacks = await feedback.create({
      description,
    });
    res.status(201).json({
      message: "Feedback successfully created",
      feedbacks: feedbacks,
    });
  } catch (error) {
    res.status(400).json({
      message: "Feedback not successful created",
      error: error.message,
    });
  }
};
