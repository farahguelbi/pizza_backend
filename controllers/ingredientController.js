const Ingredient= require('../models/ingredient');
//get All ingredients
exports.getAllIngredients=async(req,res)=>{
    try{
        const ingredients=await Ingredient.find();
        res.status(200).json(ingredients);
    }catch(err){
        res.status(500).json({message:err.message});        
    }
};
//get a specific ingredient By Id 
exports.getIngredientById=async(req,res)=>{
    try{
        const ingredient=await Ingredient.findById(req.params.id);
        if(!ingredient) return res.status(404).json({message:'Ingredient not found'});
        res.status(200).json(ingredient);

    }catch(err){
        res.status(500).json({ message: err.message }); 
    }
};
// // Fetch ingredients grouped by their layer
// exports.getIngredientsByLayer = async (req, res) => {
//   try {
//     // Group ingredients by their `layer` field
//     const ingredientsByLayer = await Ingredient.aggregate([
//       {
//         $group: {
//           _id: "$layer", // Group by the `layer` field
//           ingredients: {
//             $push: {
//               _id: "$_id",
//               name: "$name",
//               price: "$price",
//               isAvailable: "$isAvailable",
//               description: "$description",
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0, // Exclude `_id` from the result
//           layer: "$_id", // Rename `_id` to `layer`
//           ingredients: 1,
//         },
//       },
//     ]);

//     res.status(200).json({ success: true, data: ingredientsByLayer });
//   } catch (err) {
//     console.error("Error fetching ingredients by layer:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
// // Fetch Ingredients Categorized by Layer (Simple Categorization)
// exports.getIngredientsByLayer = async (req, res) => {
//   try {
//       // Fetch all ingredients
//       const ingredients = await Ingredient.find();

//       // Categorize ingredients by layer (dough, sauce, cheese, topping)
//       const categorizedIngredients = {
//           dough: ingredients.filter(ingredient => ingredient.layer === 'dough'),
//           sauce: ingredients.filter(ingredient => ingredient.layer === 'sauce'),
//           cheese: ingredients.filter(ingredient => ingredient.layer === 'cheese'),
//           topping: ingredients.filter(ingredient => ingredient.layer === 'topping'),
//       };

//       res.status(200).json(categorizedIngredients);
//   } catch (err) {
//       res.status(500).json({ message: err.message });
//   }
// };
























































// Fetch all ingredients categorized by layer
exports.getIngredientsByLayer = async (req, res) => {
    try {
      // Fetch all ingredients
      const ingredients = await Ingredient.find();
  
      // Categorize ingredients by layer (dough, sauce, cheese, topping)
      const categorizedIngredients = {
        dough: ingredients.filter(ingredient => ingredient.layer === 'dough'),
        sauce: ingredients.filter(ingredient => ingredient.layer === 'sauce'),
        cheese: ingredients.filter(ingredient => ingredient.layer === 'cheese'),
        topping: ingredients.filter(ingredient => ingredient.layer === 'topping'),
      };
  
      res.status(200).json(categorizedIngredients);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };