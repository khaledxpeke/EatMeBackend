const User = require("../models/user");
const history = require("../models/history");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
app.use(express.json());

exports.add = async (req, res, next) => {
  const { orderId, date, table, amount, payment,phone } = req.body;
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  const userId = req.user.id;
  try {
    if (!orderId || !date || !table || !amount || !payment || !phone) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }
    const histories = await history.create({
      user_id: userId,
      orderId,
      date:dateOnly.toISOString().slice(0, 10), 
      table,
      amount,
      payment,
      phone,
    });
    res.status(201).json({
      histories: histories,
    });
  } catch (error) {
    res.status(400).json({
      message: "some error occured",
      error: error.message,
    });
  }
};

exports.get = async (req, res, next) => {
    const userId = req.user.id;
  try {
    const histories = await history.find({user_id:userId});
    res.status(200).json({
      histories: histories,
    });
  } catch (error) {
    res.status(400).json({
      message: "some error occured",
      error: error.message,
    });
  }
};

  exports.getHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
      const historyId = req.params.historyId;
      const histori = await history.findOne({ _id: historyId, user_id: userId });
      if (!histori) {
        return res.status(404).json({ message: 'History not found' });
      }
      res.json(histori);
    } catch (err) {
      next(err);
    }
  };
