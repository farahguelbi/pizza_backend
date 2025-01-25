const Pizza=require('../models/Pizza');
const Wishlist = require('../models/wishlist');
const mongoose = require('mongoose');

// add to wishlist
exports.addToWishlist = async (req, res) => {
  const { userID, pizzaId } = req.body;

  try {
    // Check if the pizzaId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(pizzaId)) {
      return res.status(400).json({ message: 'Invalid pizzaId' });
    }

    // Convert pizzaId to ObjectId
    const pizzaObjectId = new mongoose.Types.ObjectId(pizzaId);

    let wishlist = await Wishlist.findOne({ userID });

    if (!wishlist) {
      // If no wishlist exists, create a new one
      wishlist = new Wishlist({
        userID,
        pizzas: [pizzaObjectId],  // Store pizzaId as ObjectId
      });
    } else {
      // If wishlist exists, check if pizza is already added
      if (wishlist.pizzas.includes(pizzaObjectId)) {
        return res.status(400).json({ message: 'Pizza already in wishlist' });
      }
      wishlist.pizzas.push(pizzaObjectId);  // Add pizzaId to the wishlist
    }

    // Save or update the wishlist
    await wishlist.save();
    res.status(200).json({ message: 'Pizza added to wishlist', wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 // remove a pizza from the wishlist 
//remove a pizza from the wishlist 
exports.removeFromWishlist = async (req, res) => {
  const { userID, pizzaId } = req.body;

  try {
      let wishlist = await Wishlist.findOne({ userID });
      if (!wishlist) {
          return res.status(404).json({ message: 'Wishlist not found' });
      }

      // Convert pizzaId to ObjectId if it's passed as a string
      const pizzaObjId =new  mongoose.Types.ObjectId(pizzaId);

      //check if the pizza exists in the wishlist 
      if (!wishlist.pizzas.includes(pizzaObjId)) {
          return res.status(400).json({ message: 'Pizza not in wishlist' });
      }

      //remove pizza from the wishlist 
      wishlist.pizzas = wishlist.pizzas.filter(id => id.toString() !== pizzaObjId.toString());

      //save the updated wishlist 
      await wishlist.save();
      res.status(200).json({ message: 'Pizza removed from wishlist', wishlist });

  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};
// get all pizzas in the user's wishlist
exports.getWishlist = async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameters

  try {
    // Find the wishlist of the user
    const wishlist = await Wishlist.findOne({ userID: userId }).populate('pizzas');
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    res.status(200).json(wishlist); 
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
};
