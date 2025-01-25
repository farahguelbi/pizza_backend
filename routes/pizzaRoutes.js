const express = require('express');
const router = express.Router();
const pizzaController = require('../controllers/pizzaController');  
// Route to get all pizzas
router.get('/', pizzaController.getAllPizzas);
// Route to get all pizzas
router.get('/:id', pizzaController.getPizzaById);
// Route to create a new pizza
router.post('/', pizzaController.createPizza);
// Route to get pizzas by type (slice or full pizza)
router.get('/type/:type', pizzaController.getPizzaByType);
// Route to search pizzas by name 
router.get('/search/:name', pizzaController.searchPizzas);
module.exports = router;