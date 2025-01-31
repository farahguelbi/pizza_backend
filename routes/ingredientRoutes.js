const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
//Route to get all ingredients
router.get('/',ingredientController.getAllIngredients);
//Route to get ingredient by ID 
router.get('/:id',ingredientController.getIngredientById);
//get ingredient by layer
// router.get('/by-layer',ingredientController.getIngredientsByLayer);

module.exports=router;

