const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Route to create or get an existing cart for a user
router.post('/cart', cartController.createOrGetCart);

// Route to add a sale (pizza + sides) to the cart
router.post('/cart/add-sale', cartController.addSaleToCart);

// Route to get the cart details for a user
router.get('/cart/:userId', cartController.getCart);

// Route to remove a sale from the cart
router.delete('/cart/remove-sale', cartController.removeSaleFromCart);

// Route to clear the entire cart for a user
router.post('/cart/clear', cartController.clearCart);

module.exports = router;
