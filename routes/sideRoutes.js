const express = require('express');
const router = express.Router();
const sideController = require('../controllers/sideController');  // Import the side controller

// Route to get a side by ID
router.get('/:id', sideController.getSideById);

// Route to get all sides
router.get('/', sideController.getAllSides);

module.exports = router;
