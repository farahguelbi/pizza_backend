// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');  // Correct path
const  authenticate = require('../middleware/authenticate')

// Add pizza to wishlist
router.post('/add',wishlistController.addToWishlist);  // Make sure the function is correctly called
// Remove pizza from wishlist
router.delete('/remove/:userId/:pizzaId', wishlistController.removeFromWishlist);
// Get user's wishlist
router.get('/:userId', wishlistController.getWishlist);
// create 
router.post('/create',wishlistController.createWishList);

module.exports = router;
