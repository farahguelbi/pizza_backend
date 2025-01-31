const PizzaCustom = require("../models/PizzaCustom");
const Ingredient = require("../models/ingredient");

const mongoose = require("mongoose");

// Create a custom pizza


exports.createPizza = async (req, res) => {
  const { selectedSize, ingredients } = req.body;

  try {
    // Validate size
    const sizePrices = {
      small: 8,
      medium: 10,
      large: 12,
    };

    if (!sizePrices[selectedSize]) {
      return res.status(400).json({
        success: false,
        message: "Invalid pizza size selected",
      });
    }

    const sizePrice = sizePrices[selectedSize];

    // Validate ingredients
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Ingredients are required",
      });
    }

    // Fetch ingredient details from the database
    const ingredientIds = ingredients.map((item) => item.ingredientId);
    const ingredientData = await Ingredient.find({ _id: { $in: ingredientIds } });

    if (ingredientData.length !== ingredients.length) {
      return res.status(400).json({
        success: false,
        message: "One or more ingredients could not be found",
      });
    }

    // Calculate ingredient prices
    let ingredientPrice = 0;
    const ingredientDetails = ingredients.map((item) => {
      const ingredient = ingredientData.find(
        (i) => i._id.toString() === item.ingredientId
      );

      const priceForThisIngredient = ingredient.price * item.quantity;
      ingredientPrice += priceForThisIngredient;

      return {
        ingredientId: ingredient._id, // Reference to Ingredient model
        quantity: item.quantity, // Store quantity of this ingredient
      };
    });

    // Calculate total price
    const totalPrice = sizePrice + ingredientPrice;

    // Create the pizza document
    const pizza = new PizzaCustom({
      name: "Custom Pizza",
      price: totalPrice,
      ingredients: ingredientDetails, // Store ObjectIds and quantities
      size: {
        small: { price: sizePrices.small },
        medium: { price: sizePrices.medium },
        large: { price: sizePrices.large },
      },
    });

    // Save to the database
    await pizza.save();

    // Return the response
    res.status(201).json({
      success: true,
      message: "Pizza created successfully",
      data: {
        _id: pizza._id,
        name: pizza.name,
        price: pizza.price,
        ingredients: ingredientDetails, // Include ingredients with quantities
        size: pizza.size,
        createdAt: pizza.createdAt,
        updatedAt: pizza.updatedAt,
      },
    });
  } catch (err) {
    console.error("Error:", err.message); // Log error for debugging
    res.status(500).json({ success: false, message: err.message });
  }
};



// Fetch all pizzas
exports.getAllPizzas = async (req, res) => {
  try {
    const pizzas = await PizzaCustom.find().populate("ingredients.ingredientId");
    res.status(200).json({ success: true, data: pizzas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Fetch a single pizza by ID
exports.getPizzaById = async (req, res) => {
  try {
    const pizza = await PizzaCustom.findById(req.params.id).populate("ingredients.ingredientId");
    if (!pizza) {
      return res.status(404).json({ success: false, message: "Pizza not found" });
    }
    res.status(200).json({ success: true, data: pizza });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
