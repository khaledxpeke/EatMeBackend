const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware.userAuth, favoritesController.getFavorites);
router.post('/', authMiddleware.userAuth, favoritesController.addFavorite);
router.delete('/:favoriteId', authMiddleware.userAuth, favoritesController.deleteFavorite);

module.exports = router;