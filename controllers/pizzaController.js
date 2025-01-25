const Pizza = require("../models/Pizza");
const Ingredient=require("../models/ingredient");
const ingredientsController = require('../controllers/ingredientController');  // Ensure the correct path to the ingredients controller
const Type=require('../models/type');
const mongoose = require("mongoose");
//Get all pizzas
exports.getAllPizzas=async (req,res)=>{
    try{
        const pizzas=await Pizza.find().populate('ingredients').populate('type');
        res.status(200).json(pizzas);
    }catch(err){
        res.status(500).send(err.message);
    }
};
//Get pizza by ID 
exports.getPizzaById=async(req,res)=>{
   try{
    const pizza=await Pizza.findById(req.params.id).populate('ingredients').populate('type');
    if(!pizza) return res.status(404).send("Pizza not found");
    res.status(200).json(pizza);
   }catch(err){
    res.status(500).send(err.message);
   }
};
//search pizza by name
exports.searchPizzas = async (req, res) => {
    const query = req.params.name;  // Get the search query from the URL parameter (path parameter)
    console.log("Received search query:", query);  // Debugging log

    try {
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Find pizzas where the name matches the query (case-insensitive)
        const pizzas = await Pizza.find({
            name: { $regex: query, $options: 'i' }  // Search only in pizza name (case-insensitive)
        })
        .exec();

        // If no pizzas found, return 404
        if (pizzas.length === 0) {
            return res.status(404).json({ message: 'No pizzas found' });
        }

        // Return the matching pizzas
        res.status(200).json(pizzas);

    } catch (err) {
        res.status(500).json({ message: err.message });  // Handle errors
    }
};

//get Pizza By type
exports.getPizzaByType = async (req, res) => {
    const pizzaType = req.params.type; 
    console.log('Received pizza type:', pizzaType);  

    try {
        // Validate the pizzaType to ensure it matches 'Full Pizza' or 'Slice'
        if (!['Full Pizza', 'Slice'].includes(pizzaType)) {
            return res.status(400).json({ message: 'Invalid pizza type. Use "Full Pizza" or "Slice".' });
        }

        // Fetch the type ObjectId using the type name (e.g., 'Full Pizza')
        const type = await Type.findOne({ name: pizzaType });
        console.log('Found Type:', type);  // Log the found type
        console.log('Type ObjectId:', type._id);  // This should print the correct ObjectId

        // If the type is not found, return a 404 error
        if (!type) {
            return res.status(404).json({ message: 'Type not found' });
        }

        // Fetch all pizzas that have the matching ObjectId in the type field
        const pizzas = await Pizza.find({ type: type._id })  // Using ObjectId to query
            .populate('type')  // Populate type to get the type name
            .populate('ingredients');  // Populate ingredients

        // If no pizzas are found, return a 404 error
        if (pizzas.length === 0) {
            return res.status(404).json({ message: 'No pizzas found for this type.' });
        }

        res.status(200).json(pizzas);  // Return the found pizzas

    } catch (err) {
        console.error('Error in getPizzaByType:', err.message);  // Log the error for debugging
        res.status(500).json({ message: err.message });
    }
};
//create pizza 
exports.createPizza = async (req, res) => {
    const { selectedSize, ingredients } = req.body;

    try {
        // Validate pizza type
        const pizzaType = await Type.findOne({ name: 'Full Pizza' });
        if (!pizzaType) {
            return res.status(400).json({ success: false, message: 'Default pizza type not found' });
        }

        const sizePrices = {
            small: 8,
            medium: 10,
            large: 12
        };

        if (!sizePrices[selectedSize]) {
            return res.status(400).json({ success: false, message: 'Invalid pizza size selected' });
        }

        const sizePrice = sizePrices[selectedSize];

        // Ingredient IDs should be passed directly as strings
        const ingredientIds = ingredients.map(item => item.ingredientId);

        // Fetch ingredient data using ingredientIds (Mongoose automatically handles the conversion)
        const ingredientData = await Ingredient.find({ _id: { $in: ingredientIds } });

        let ingredientPrice = 0;
        const ingredientDetails = ingredients.map(item => {
            const ingredient = ingredientData.find(i => i._id.toString() === item.ingredientId);
            if (!ingredient) {
                throw new Error(`Ingredient with ID ${item.ingredientId} not found`);
            }

            const priceForThisIngredient = ingredient.price * item.quantity;
            ingredientPrice += priceForThisIngredient;

            return ingredient._id;  // Just return the ObjectId reference (no need for 'type')
        });

        const totalPrice = sizePrice + ingredientPrice;

        // Create a new pizza document, but now name, reference, and description are not included
        const pizza = new Pizza({
            price: totalPrice,
            ingredients: ingredientDetails,  // Only store ObjectIds here (not the full object with type/quantity)
            type: pizzaType._id,
            size: [{ size: selectedSize, price: sizePrice }]
        });

        await pizza.save();

        res.status(201).json({
            success: true,
            message: "Pizza created successfully",
            data: {
                ...pizza._doc,
                ingredients: ingredientDetails  // Return the ingredient references in the response
            }
        });
    } catch (err) {
        console.log('Error:', err.message);  // Log error to debug
        res.status(500).json({ success: false, message: err.message });
    }
};









































    /*try{
        const ingredientDetails= await Ingredient.find({ '_id': { $in: ingredients } });
        const ingredientsWithImages = ingredientDetails.map(ingredient => ({
            name: ingredient.name,
            image: ingredient.image,  
            price: ingredient.price,
          }));
        const newPizza =new Pizza({
            name,
            description,
            price,
            ingredients:ingredientsWithImages,
            sizes,
            type,

            }
        );
        
    await newPizza.save();
    res.status(201).json(newPizza);
}catch(err){
    res.status(500).json({ message: err.message }); 
}};*/
