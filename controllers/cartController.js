const User = require("../models/user");
const Cart = require("../models/cart");
const Dish = require("../models/dishes");
const Supplement = require("../models/supplement");
const OrderedDish = require("../models/orderedDish");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
app.use(express.json());

(exports.createCart = async (req, res) => {
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
}),
  (exports.addDishtoCart = async (req, res) => {
    try {
      const { dishId, supplements, description,quantity} = req.body;

      // Check if the user is authenticated
      const userId = req.user ? req.user.id : null;
      const guestId = req.guest ? req.cookies.guestId: null;

      // Get the dish
      const dish = await Dish.findById(dishId);

      // Create a new array for the selected supplements
      const selectedSupplements = [];

      // Loop through the supplement IDs and get the supplement objects
      for (const supplementId of supplements) {
        const supplement = await Supplement.findById(supplementId);
        if (supplement) {
          selectedSupplements.push({
            supplement: supplement._id,
            name: supplement.name,
            price: supplement.price,
          });
        }
      }

      // Calculate the total price of the dish with supplements
      let totalPrice = dish.price;
      for (const supplement of selectedSupplements) {
        totalPrice += supplement.price;
      }

      // Create a new ordered dish with updated supplements
      const orderedDish = new OrderedDish({
        dish: dishId,
        supplements: selectedSupplements,
        description: description || "",
        quantity: quantity || 1,
        orderedBy: userId || guestId,
      });

      // Save the ordered dish to the database
      await orderedDish.save();

      // Create a new cart item
      const cartItem = {
        dish: orderedDish._id,
        selectedSupplements: selectedSupplements,
        quantity: quantity || 1,
      };

      // Find the user's or guest's cart and add the new item to it
      let cart;
      if (userId) {
        cart = await Cart.findOne({ user: userId });
      } else {
        cart = await Cart.findOne({ guest: guestId });
      }

      if (cart) {
        // Check if the item is already in the cart
        const existingItem = cart.items.find(
          (item) => item.dish.toString() === orderedDish._id.toString()
        );
        if (existingItem) {
          // If the item is already in the cart, increase the quantity
          existingItem.quantity += 1;
        } else {
          // If the item is not in the cart, add it
          cart.items.push(cartItem);
        }

        await cart.save();
      } else {
        // If the user/guest doesn't have a cart yet, create a new one and add the item to it
        const newCart = new Cart({
          items: [cartItem],
          user: userId,
          guest: guestId,
        });
        await newCart.save();
      }

      res.status(201).json({ message: "Item added to cart" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });

  exports.getOrderedDishesFromCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const guestId = req.cookies.guestId;
  
      let cart;
      if (userId) {
        cart = await Cart.findOne({ user: userId }).populate('items.dish.dish').populate('items.selectedSupplements.supplement');
      } else {
        cart = await Cart.findOne({ guest: guestId }).populate('items.dish.dish').populate('items.selectedSupplements.supplement');
      }
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      const orderedDishes = cart.items.map((item) => ({
        dish: item.dish,
        selectedSupplements: item.selectedSupplements,
        quantity: item.quantity
      }));
  
      res.json({ orderedDishes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  exports.removeDishFromCart = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.id;
    const guestId = req.cookies.guestId
  
    try {
      let cart = await Cart.findOne({ $or: [{ user: userId }, { guest: guestId }] });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const item = cart.items.find((item) => item.id === itemId);
      const dishId = item?.dish?.dish?._id;
      
      cart.items = cart.items.filter((item) => item.id !== itemId);
      await cart.save();

      await OrderedDish.deleteOne({ dish: dishId });
  
      return res.status(200).json(cart);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  };
 