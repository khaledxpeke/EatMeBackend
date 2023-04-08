const Dish = require("../models/dishes");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwtSecret= process.env.JWT_SECRET
app.use(express.json());

exports.add = async (req, res, next) => {
    //add dish post request and test with jwt token with userauth middleware
    const { name, description, price,image,category, quantity,stars } = req.body;
    try {
        const dish = await Dish.create({
            name,
            description,
            price,
            image,
            category,
            quantity,
            stars,
            supplements: [],
        });
        res.status(201).json({
            dish: dish._id,
        });
    } catch (error) {
        res.status(400).json({
            message: "Some error occured",
            error: error.message,
        });
    }
};

//give me function to get 1 dish by id
exports.getDish = async (req, res, next) => {
    try {
        const dish = await Dish.findById(req.params.id);
        res.status(200).json({
            dish,
        });
    } catch (error) {
        res.status(400).json({
            message: "No Dish found",
            error: error.message,
        });
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const dishes = await Dish.find({}).populate("supplements", "name");
        res.status(200).json({
            dishes,
        });
    } catch (error) {
        res.status(400).json({
            message: "No Dishes found",
            error: error.message,
        });
    }
};

// exports.createDishByCategory = async (req, res) => {
//     try {
//       const  {name, description, price, image ,categoryId,subcategoryId} =
//         req.body;
//       const category = await Category.findById(categoryId);
//       if (!category) {
//         return res.status(404).json({ message: "Category not found" });
//       }
//       let subcategory = null;
//       if (subcategoryId) {
//         subcategory = category.subcategories.id(subcategoryId);
//         if (!subcategory) {
//           return res.status(404).json({ message: "Subcategory not found" });
//         }
//       }
//       const dish = await Dish.create({
//         name,
//         description,
//         price,
//         image,
//         category: {
//           _id: category._id,
//           name: category.name,
//         },
//         subcategory: subcategory
//           ? {
//               _id: subcategory._id,
//               name: subcategory.name,
//             }
//           : null,
//       });
//       res.status(201).json({ dish });
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   };

//   exports.getDishesByCategory = async (req, res) => {
//     try {
//       const { subcategory } = req.query;
//       const category = await Category.findById(req.params.categoryId);
  
//       if (!category) {
//         return res.status(404).json({ message: "Category not found" });
//       }
  
//       let query = { category: category._id };
  
//       if (subcategory) {
//         query.subcategories = subcategory;
//       }
  
//       const dishes = await Dish.find(query).populate("category");
  
//       res.status(200).json({ dishes });
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   };

  
  
  
  