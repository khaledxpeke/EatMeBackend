const OrderedDish = require('../models/orderedDish');
const Dish = require('../models/dish');
const Supplement = require('../models/supplement');

exports.addOrderedDish = async (req, res) => {
    try {
        const { dishId, supplements } = req.body;
        const dish = await Dish.findById(dishId).populate('supplements');
        if (!dish) {
          res.status(404).json({ message: 'Dish not found' });
          return;
        }
    
        // Make a copy of the supplements
        const orderedSupplements = [];
        for (const supplement of supplements) {
          const orderedSupplement = { ...supplement };
          if (orderedSupplement._id) {
            orderedSupplement.supplement = orderedSupplement._id;
            delete orderedSupplement._id;
          }
          orderedSupplements.push(orderedSupplement);
        }
    
        const orderedDish = new OrderedDish({
          dish: dishId,
          supplements: orderedSupplements,
          userId: req.user.id,
          guestId: req.cookies.guestId
        });
        const savedOrderedDish = await orderedDish.save();
        res.json(savedOrderedDish);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };

  exports.getOrderedDishes = async (req, res) => {
    try {
      let query = {};
      if (req.user) {
        query.userId = req.user.id;
      } else {
        query.guestId = req.cookies.guestId;
      }
      const orderedDishes = await OrderedDish.find(query).populate('dish').populate('supplements.supplement');
      res.json(orderedDishes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.updateOrderedDishSupplements = async (req, res) => {
    try {
      const { orderedDishId, supplements } = req.body;
      const orderedDish = await OrderedDish.findById(orderedDishId).populate('dish').populate('supplements.supplement');
      if (!orderedDish) {
        res.status(404).json({ message: 'Ordered dish not found' });
        return;
      }
      // Check if the ordered dish belongs to the logged-in user
      if (orderedDish.userId && !orderedDish.userId.equals(req.user.id)) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
      // Check if the ordered dish belongs to the guest
      if (orderedDish.guestId && orderedDish.guestId !== req.cookies.guestId) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
      if (!orderedDish.dish) {
        res.status(500).json({ message: 'Ordered dish is missing dish reference' });
        return;
      }
      const dish = await Dish.findById(orderedDish.dish._id).populate('supplements');
      if (!dish) {
        res.status(500).json({ message: 'Dish not found' });
        return;
      }
      const newSupplements = [];
      for (let i = 0; i < supplements.length; i++) {
        const supplement = supplements[i];
        const foundSupplement = dish.supplements.find(s => s._id.equals(supplement.supplement));
        if (!foundSupplement) {
          res.status(500).json({ message: 'Supplement not found' });
          return;
        }
        newSupplements.push({ supplement: foundSupplement._id, quantity: supplement.quantity });
      }
      orderedDish.supplements = newSupplements;
      const savedOrderedDish = await orderedDish.save();
      res.json(savedOrderedDish);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.deleteOrderedDish = async (req, res) => {
    try {
      const { id } = req.params;
      const orderedDish = await OrderedDish.findById(id);
      if (!orderedDish) {
        res.status(404).json({ message: 'Ordered dish not found' });
        return;
      }
      // Check if the ordered dish belongs to the logged-in user
      if (orderedDish.userId && !orderedDish.userId.equals(req.user.id)) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
      // Check if the ordered dish belongs to the guest
      if (orderedDish.guestId && orderedDish.guestId !== req.cookies.guestId) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
      await orderedDish.remove();
      res.json({ message: 'Ordered dish deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };