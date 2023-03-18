const User = require("../models/user");
const Cart = require("../models/cart");
const Dish = require("../models/dishes");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
app.use(express.json());

exports.createCart = async (req, res) => {
  try {
    let userId, guestId;
    if (req.user) {
      userId = req.user.id;
    } else {
      guestId = req.cookies.guestId;
    }
    const cart = new Cart({ userId: userId || null, guestId: guestId || null });
    const savedCart = await cart.save();
    res.json(savedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

exports.addDishtoCart = async (req, res) => {
  try {
    const { cartId, dishId, quantity } = req.body;
    const cart = await Cart.findById(cartId);
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }
    // Check if the cart belongs to the logged-in user
    if (cart.userId && !cart.userId.equals(req.user.id)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    // Check if the cart belongs to the guest
    if (cart.guestId && cart.guestId !== req.cookies.guestId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    const dishIndex = cart.dishes.findIndex(d => d.dishId.equals(dishId));
    if (dishIndex >= 0) {
      // If the dish is already in the cart, increment its quantity
      cart.dishes[dishIndex].quantity += quantity;
    } else {
      // Otherwise, add the dish to the cart with the specified quantity
      cart.dishes.push({ dishId, quantity });
    }
    const savedCart = await cart.save();
    res.json(savedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getDishesFromCart = async (req, res) => {
  try {
    let cart;
    if (req.user) {
      // If the user is authenticated, find their cart by user ID
      cart = await Cart.findOne({ userId: req.user.id, _id: req.params.cartId }).populate('dishes.dishId');
    } else {
      // If the user is not authenticated, find their cart by guest ID
      const guestId = req.cookies.guestId;
      if (!guestId) {
        return res.status(404).json({ message: "Guest ID not found" });
      }
      cart = await Cart.findOne({ guestId, _id: req.params.cartId }).populate('dishes.dishId');
    }
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const dishes = cart.dishes.map(d => d.dishId);
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

exports.removeDishFromCart = async (req, res) => {
  try {
    let cart;
    if (req.user) {
      // If the user is authenticated, find their cart by user ID
      cart = await Cart.findOne({ userId: req.user.id, _id: req.params.cartId });
    } else {
      // If the user is not authenticated, find their cart by guest ID
      const guestId = req.cookies.guestId;
      if (!guestId) {
        return res.status(404).json({ message: "Guest ID not found" });
      }
      cart = await Cart.findOne({ guestId, _id: req.params.cartId });
    }
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const dishIndex = cart.dishes.findIndex(d => d.dishId == req.params.dishId);
    if (dishIndex === -1) {
      return res.status(404).json({ message: "Dish not found in cart" });
    }
    cart.dishes.splice(dishIndex, 1);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

exports.clearCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await Cart.findById(cartId);
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }
    cart.dishes = [];
    const savedCart = await cart.save();
    res.json(savedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
