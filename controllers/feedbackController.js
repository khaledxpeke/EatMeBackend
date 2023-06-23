const User = require("../models/user");
const Feedback = require("../models/feedbacks");
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
    const feedbacks = await Feedback.create({
      description,
    });
    res.status(201).json({
      feedbacks: feedbacks,
    });
  } catch (error) {
    res.status(400).json({
      message: "Some error occured",
      error: error.message,
    });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({});
    res.status(200).json({
      feedbacks,
    });
  } catch (error) {
    res.status(400).json({
      message: "No Feedbacks found",
      error: error.message,
    });
  }
};

exports.getFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.findById(req.params.id);
    res.status(200).json({
      feedbacks,
    });
  } catch (error) {
    res.status(400).json({
      message: "No Feedback found",
      error: error.message,
    });
  }
};

exports.deleteFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Feedback successfully deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: "No Feedback found",
      error: error.message,
    });
  }
};

exports.update = async (req, res, next) => {
  const { description } = req.body;
  try {
    const feedbacks = await Feedback.findByIdAndUpdate(req.params.id, {
      description,
    });
    res.status(200).json({
      message: "Feedback successfully updated",
    });
  } catch (error) {
    res.status(400).json({
      message: "No Feedback found",
      error: error.message,
    });
  }
};
