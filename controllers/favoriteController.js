const User = require("../models/user");
const Favorite = require("../models/favorites");
const Dish = require("../models/dishes");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
app.use(express.json());



exports.addFavorite = async (req, res) => {
    const { dishId } = req.body;
    const userId = req.user.id;
  
    try {
      // Check if the dish exists
      const dish = await Dish.findById(dishId);
      if (!dish) {
        return res.status(404).json({ message: 'Dish not found' });
      }
  
      // Check if the user already favorited this dish
      const existingFavorite = await Favorite.findOne({ user: userId, dish: dishId });
      if (existingFavorite) {
        return res.status(400).json({ message: 'You already favorited this dish' });
      }
  
      // Create a new favorite
      const favorite = new Favorite({
        user: userId,
        dish: dishId
      });
  
      await favorite.save();
  
      res.json({ message: 'Dish added to favorites' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.getFavorites = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const favorites = await Favorite.find({ user: userId }).populate('dish');
      res.json(favorites);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.deleteFavorite = async (req, res) => {
    const userId = req.user.id;
    const favoriteId = req.params.favoriteId;
  
    try {
      const favorite = await Favorite.findOne({ _id: favoriteId, user: userId });
  
      if (!favorite) {
        return res.status(404).json({ message: 'Favorite not found' });
      }
  
      await favorite.remove();
  
      res.json({ message: 'Favorite removed' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
