const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController');  // Import the controller

// Route to get type by ID
router.get('/:id', typeController.getTypeById);

module.exports = router;
