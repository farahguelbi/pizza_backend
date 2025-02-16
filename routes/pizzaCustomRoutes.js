const express = require('express');
const router = express.Router();
const PizzaCustomController = require('../controllers/pizzaCustomController');  // Import the controller

// Route to get type by ID
router.post('/create', PizzaCustomController.createPizza);
router.get("/", PizzaCustomController.getAllPizzas);
router.get("/:id", PizzaCustomController.getPizzaById);

module.exports = router;
