const Pizza=require('../models/Pizza');
const Wishlist = require('../models/wishlist');
const mongoose = require('mongoose');

// add to wishlist
exports.addToWishlist = async (req, res) => {
  const { userID, pizzaId } = req.body;

  try {
     // Validate userId
     if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

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
// remove a pizza from the wishlist using DELETE
exports.removeFromWishlist = async (req, res) => {
  const { userId, pizzaId } = req.params; // Extract userId and pizzaId from route parameters

  try {
    // Find the wishlist associated with the user
    let wishlist = await Wishlist.findOne({ userID: userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Convert pizzaId to ObjectId if necessary
    const pizzaObjId = new mongoose.Types.ObjectId(pizzaId);

    // Check if the pizza exists in the wishlist
    if (!wishlist.pizzas.includes(pizzaObjId)) {
      return res.status(400).json({ message: 'Pizza not in wishlist' });
    }

    // Remove pizza from the wishlist
    wishlist.pizzas = wishlist.pizzas.filter(id => id.toString() !== pizzaObjId.toString());

    // Save the updated wishlist
    await wishlist.save();
    res.status(200).json({ message: 'Pizza removed from wishlist', wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// //remove a pizza from the wishlist 
// exports.removeFromWishlist = async (req, res) => {
//   const { userID, pizzaId } = req.body;

//   try {
//       let wishlist = await Wishlist.findOne({ userID });
//       if (!wishlist) {
//           return res.status(404).json({ message: 'Wishlist not found' });
//       }

//       // Convert pizzaId to ObjectId if it's passed as a string
//       const pizzaObjId =new  mongoose.Types.ObjectId(pizzaId);

//       //check if the pizza exists in the wishlist 
//       if (!wishlist.pizzas.includes(pizzaObjId)) {
//           return res.status(400).json({ message: 'Pizza not in wishlist' });
//       }

//       //remove pizza from the wishlist 
//       wishlist.pizzas = wishlist.pizzas.filter(id => id.toString() !== pizzaObjId.toString());

//       //save the updated wishlist 
//       await wishlist.save();
//       res.status(200).json({ message: 'Pizza removed from wishlist', wishlist });

//   } catch (err) {
//       res.status(500).json({ message: err.message });
//   }
// };
// get all pizzas in the user's wishlist
// exports.getWishlist = async (req, res) => {
//   const { userId } = req.query; 

//   try {
//     // Find the wishlist of the user
//     const wishlist = await wishlist.findOne({ userID: userId }).populate('pizzas');
//     if (!wishlist) {
//       return res.status(404).json({ message: 'Wishlist not found' });
//     }
//     res.status(200).json(wishlist); 
//   } catch (err) {
//     res.status(500).json({ message: err.message }); 
//   }
// };
// exports.getWishlist = async (req, res) => {
//   const userId = req.query.userID; // Use query parameter
//   try {
//     await Wishlist.findOne({ userID: userId }).then(async (wishlist) => {
//       if (wishlist) {
//         res.status(200).json(wishlist);
//       } else {
//         res.status(404).json({ msg: 'Wishlist not found' });
//       }
//     });
//   } catch (err) {
//     res.status(500).json(err.message);
//   }
// };

exports.getWishlist = async (req, res) => {
  const userId = req.query.userID; // Use query parameter

  try {
    // Find the wishlist and populate the pizzas field
    const wishlist = await Wishlist.findOne({ userID: userId }).populate('pizzas');
    
    if (wishlist) {
      res.status(200).json(wishlist); // Send the populated wishlist
    } else {
      res.status(404).json({ msg: 'Wishlist not found' }); // Send 404 if no wishlist exists
    }
  } catch (err) {
    console.error('Error fetching wishlist:', err); // Log the error
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// const WishList = require("../models/Wishlist");

// exports. createWishList = async (req, res) => {
//   const newWishList = new WishList(req.body);
//   try {
//     const savedWishList = await newWishList.save();
//     res.status(201).json(savedWishList);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
exports.createWishList = async (req, res) => {
  try {
    console.log("🚀 Creating Wishlist for user:", req.body.userID); // Debugging
    if (!req.body.userID) {
      return res.status(400).json({ message: "❌ userID is required" });
    }
    const newWishList = new Wishlist(req.body); 
    await newWishList.save();

    res.status(201).json({ message: "Wishlist created successfully", newWishList });
  } catch (error) {
    console.error("❌ Error creating wishlist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// exports. getWishListById = async (req, res) => {
//   var uid = req.body.userId;
//   try {
//     await WishList.findOne({ userID: uid }).then(async (wishlist) => {
//       if (wishlist) {
//         res.status(200).json(wishlist);
//       } else {
//         res.status(404).json({ msg: "wishlist not found" });
//       }
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// exports. updateWishList = async (req, res) => {
//   var id = req.body.id;
//   var pizzas = req.body.pizzas;

//   try {
//     const updatedWishList = await WishList.findByIdAndUpdate(
//       id,
//       {
//         pizzas: pizzas,
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedWishList);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// exports .deleteWishList = async (req, res) => {
//   var id = req.body.id;

//   try {
//     const wishlist = await WishList.findByIdAndDelete(id);
//     if (!wishlist) {
//       return res.status(404).json({ message: "wishlist not found" });
//     } else {
//       res.status(200).json({ message: "wishlist deleted successfully" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error occurred while deleting wishlist" });
//   }
// };

// exports. removePizzaFromWishList = async (req, res) => {
//   const { userId, pizzaId } = req.body;

//   try {
//     const wishlist = await WishList.findOne({ userID: userId });

//     if (!wishlist) {
//       return res.status(404).json({ message: "Wishlist not found" });
//     }

//     const updatedPizzas = wishlist.pizzas.filter(
//       (pizza) => pizza.toString() !== pizzaId
//     );

//     if (wishlist.pizzas.length === updatedPizzas.length) {
//       return res
//         .status(404)
//         .json({ message: "Pizza not found in the wishlist" });
//     }

//     wishlist.pizzas = updatedPizzas;
//     const updatedWishList = await wishlist.save();

//     res.status(200).json({
//       message: "Pizza removed successfully",
//       updatedWishList,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Error occurred while removing pizza",
//       error: err.message,
//     });
//   }
// };


// const Pizza = require('../models/Pizza');
// const Wishlist = require('../models/wishlist');
// const mongoose = require('mongoose');

// // ✅ Add to Wishlist (Ensures no duplicate pizzas are added)
// exports.addToWishlist = async (req, res) => {
//   const { userID, pizzaId } = req.body;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(userID)) {
//       return res.status(400).json({ message: 'Invalid userId' });
//     }

//     if (!mongoose.Types.ObjectId.isValid(pizzaId)) {
//       return res.status(400).json({ message: 'Invalid pizzaId' });
//     }

//     const pizzaObjectId = new mongoose.Types.ObjectId(pizzaId);
//     let wishlist = await Wishlist.findOne({ userID });

//     if (!wishlist) {
//       wishlist = new Wishlist({
//         userID,
//         pizzas: [pizzaObjectId],
//       });
//     } else {
//       if (wishlist.pizzas.some(id => id.toString() === pizzaObjectId.toString())) {
//         return res.status(400).json({ message: 'Pizza already in wishlist' });
//       }
//       wishlist.pizzas.push(pizzaObjectId);
//     }

//     await wishlist.save();
//     res.status(200).json({ message: 'Pizza added to wishlist', wishlist });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ Remove Pizza from Wishlist (Fixes ObjectId Comparison Issue)
// exports.removeFromWishlist = async (req, res) => {
//   const { userId, pizzaId } = req.params;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(pizzaId)) {
//       return res.status(400).json({ message: 'Invalid userId or pizzaId' });
//     }

//     let wishlist = await Wishlist.findOne({ userID: userId });
//     if (!wishlist) {
//       return res.status(404).json({ message: 'Wishlist not found' });
//     }

//     const pizzaObjId = new mongoose.Types.ObjectId(pizzaId);

//     if (!wishlist.pizzas.some(id => id.toString() === pizzaObjId.toString())) {
//       return res.status(400).json({ message: 'Pizza not in wishlist' });
//     }

//     wishlist.pizzas = wishlist.pizzas.filter(id => id.toString() !== pizzaObjId.toString());
//     await wishlist.save();

//     res.status(200).json({ message: 'Pizza removed from wishlist', wishlist });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ Get the latest Wishlist (Ensures real-time updates)
// exports.getWishlist = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: 'Invalid userId' });
//     }

//     // Use `.lean()` to ensure the latest data is returned
//     const wishlist = await Wishlist.findOne({ userID: userId })
//       .populate('pizzas')
//       .lean();

//     if (!wishlist) {
//       return res.status(404).json({ message: 'Wishlist not found' });
//     }

//     res.status(200).json(wishlist);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ Create a new wishlist (Only if needed)
// exports.createWishList = async (req, res) => {
//   try {
//     const newWishList = new Wishlist(req.body);
//     const savedWishList = await newWishList.save();
//     res.status(201).json(savedWishList);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
