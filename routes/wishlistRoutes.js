// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');  // Correct path

// Add pizza to wishlist
router.post('/add', wishlistController.addToWishlist);  // Make sure the function is correctly called
// Remove pizza from wishlist
router.post('/remove', wishlistController.removeFromWishlist);
// Get user's wishlist
router.get('/:userId', wishlistController.getWishlist);

module.exports = router;
