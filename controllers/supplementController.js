const User = require("../models/user");
const Supplement = require("../models/supplement");
const Dish = require("../models/dishes");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
app.use(express.json());

exports.createSupplement = async (req, res) => {
    try {
      const dish = await Dish.findById(req.body.dishId);
      if (!dish) {
        return res.status(404).json({ error: 'Dish not found' });
      }
      const supplement = new Supplement({
        name: req.body.name,
        price: req.body.price,
        isFree: req.body.isFree,
        dish: dish._id
      });
      await supplement.save();
      dish.supplements.push(supplement._id);
      await dish.save();
      res.status(201).json({supplement});
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.addSupplement = async (req, res) => {
    try {
      const { name, price, isFree } = req.body;
  
      const supplement = new Supplement({
        name,
        price,
        isFree
      });
  
      await supplement.save();
  
      res.json({ message: 'Supplement added', supplement });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.getAllSupplements = async (req, res) => {
    try {
      const supplements = await Supplement.find();
      res.json(supplements);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // READ all supplements for a specific dish
  exports.getAllSupplementsForDish = async (req, res) => {
    try {
      const dish = await Dish.findById(req.params.dishId);
      if (!dish) {
        return res.status(404).json({ error: 'Dish not found' });
      }
      const supplements = await Supplement.find({ dish: dish._id });
      res.json(supplements);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.addExistingSupplementToDish = async (req, res) => {
    try {
      const dish = await Dish.findById(req.body.dishId);
      if (!dish) {
        return res.status(404).json({ error: 'Dish not found' });
      }
  
      const supplement = await Supplement.findById(req.params.supplementId);
      if (!supplement) {
        return res.status(404).json({ error: 'Supplement not found' });
      }
  
      // check if the supplement is already added to the dish
      if (dish.supplements.includes(supplement._id)) {
        return res.status(400).json({ error: 'Supplement already added to the dish' });
      }
  
      dish.supplements.push(supplement._id);
      await dish.save();
  
      res.json({ message: 'Supplement added to the dish' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // READ a single supplement by ID for a specific dish
  exports.getSupplementByIdForDish = async (req, res) => {
    try {
      const dish = await Dish.findById(req.params.dishId);
      if (!dish) {
        return res.status(404).json({ error: 'Dish not found' });
      }
      const supplement = await Supplement.findOne({
        _id: req.params.supplementId,
        dish: dish._id
      });
      if (!supplement) {
        return res.status(404).json({ error: 'Supplement not found' });
      }
      res.json(supplement);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // UPDATE a supplement for a specific dish
  exports.updateSupplementForDish = async (req, res) => {
    try {
      const dish = await Dish.findById(req.params.dishId);
      if (!dish) {
        return res.status(404).json({ error: 'Dish not found' });
      }
      const supplement = await Supplement.findOne({
        _id: req.params.supplementId,
        dish: dish._id
      });
      if (!supplement) {
        return res.status(404).json({ error: 'Supplement not found' });
      }
      supplement.name = req.body.name || supplement.name;
      supplement.description = req.body.description || supplement.description;
      supplement.price = req.body.price || supplement.price;
      supplement.isFree = req.body.isFree || supplement.isFree;
      await supplement.save();
      res.json(supplement);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.deleteSupplementForDish = async (req, res) => {
    try {
      const dish = await Dish.findById(req.body.dishId);
      if (!dish) {
        return res.status(404).json({ error: 'Dish not found' });
      }
      const supplement = await Supplement.findOne({
        _id: req.params.supplementId,
        dish: dish._id
        });
        if (!supplement) {
        return res.status(404).json({ error: 'Supplement not found' });
        }
        dish.supplements.pull(supplement._id);
        await dish.save();
        res.json({ message: 'Supplement deleted' });
        } catch (err) {
        res.status(500).json({ error: err.message });
        }
        };