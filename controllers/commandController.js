const Command = require('../models/command');
const Sale = require('../models/sale');  
const User = require('../models/user');  
const Cart = require('../models/cart');


// // 1. Create a new command (place command)
// exports.createCommand = async (req, res) => {
//   const { userID, address, cartId, paymentMethod } = req.body;

//   try {
//     // Find the cart by ID
//     const cart = await Cart.findById(cartId);
//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     // Find the user by ID
//     const user = await User.findById(userID);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Calculate the total price of the command (based on cartTotal)
//     const totalPrice = cart.cartTotal;

//     // Set payment status based on payment method selected
//     let paymentStatus = 'Unpaid';  // Default payment status
//     if (paymentMethod === 'Online') {
//       paymentStatus = 'Paid';  // Mark as "Paid" for online payment
//     }

//     // Create a new Command (Order)
//     const command = new Command({
//       userID: userID,
//       address: address,
//       cartId: cartId,
//       orderStatus: 'Pending', // Default status
//       paymentStatus: paymentStatus, // Set based on payment method
//       paymentMethod: paymentMethod, // "Online" or "Delivery"
//       totalPrice: totalPrice,
//     });

//     // Save the command (order)
//     await command.save();

//     // Optionally, clear the cart after placing the order
//     cart.salesID = [];
//     cart.cartTotal = 0;
//     await cart.save();

//     // Return the created command
//     res.status(201).json({ message: 'Order created successfully', command });
//   } catch (err) {
//     console.error('Error creating order:', err);
//     res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// };

// // 2. Get Command By ID
// exports.getCommandById = async (req, res) => {
//   const { commandId } = req.params;

//   try {
//     // Find the command by ID and populate necessary fields (e.g., cart and user)
//     const command = await Command.findById(commandId)
//       .populate('cartId')
//       .populate('userID')
//       .populate('cartId.salesID'); // Populate sales (items in the cart)

//     if (!command) {
//       return res.status(404).json({ message: 'Command not found' });
//     }

//     res.status(200).json({ message: 'Command found', command });
//   } catch (err) {
//     console.error('Error fetching order:', err);
//     res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// };

// // 3. Cancel Command (Set orderStatus to "Cancelled")
// exports.cancelCommand = async (req, res) => {
//   const { commandId } = req.body;

//   try {
//     // Find the command by ID
//     const command = await Command.findById(commandId);
//     if (!command) {
//       return res.status(404).json({ message: 'Command not found' });
//     }

//     // Check if the order has already been completed
//     if (command.orderStatus === 'Completed') {
//       return res.status(400).json({ message: 'Order is already completed and cannot be cancelled' });
//     }

//     // Update the order status to "Cancelled" and set paymentStatus to "Unpaid"
//     command.orderStatus = 'Cancelled';
//     command.paymentStatus = 'Unpaid'; // Change paymentStatus to "Unpaid"
//     await command.save();

//     res.status(200).json({ message: 'Order cancelled successfully', command });
//   } catch (err) {
//     console.error('Error cancelling order:', err);
//     res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// };


// // 4. Complete Command (Set orderStatus to "Completed")
// exports.completeCommand = async (req, res) => {
//   const { commandId } = req.body;

//   try {
//     // Find the command by ID
//     const command = await Command.findById(commandId);
//     if (!command) {
//       return res.status(404).json({ message: 'Command not found', error: 'Invalid command ID' });
//     }

//     // Check if the order has already been completed
//     if (command.orderStatus === 'Completed') {
//       return res.status(400).json({ message: 'Order is already completed', error: 'Order already completed' });
//     }

//     // Update the order status to "Completed"
//     command.orderStatus = 'Completed';
//     await command.save();

//     // Return the updated command in the response
//     res.status(200).json({ message: 'Order completed successfully', command });
//   } catch (err) {
//     console.error('Error completing order:', err);
//     res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// };

// // 5. Change the payment status (manual update)
// exports.changePaymentStatus = async (req, res) => {
//   const { commandId, paymentStatus } = req.body;

//   try {
//     // Validate that paymentStatus is either 'Paid' or 'Unpaid'
//     if (paymentStatus !== 'Paid' && paymentStatus !== 'Unpaid') {
//       return res.status(400).json({ message: 'Invalid payment status. Must be "Paid" or "Unpaid".' });
//     }

//     // Find the command by ID
//     const command = await Command.findById(commandId);
//     if (!command) {
//       return res.status(404).json({ message: 'Command not found', error: 'Invalid command ID' });
//     }

//     // Update the paymentStatus of the command
//     command.paymentStatus = paymentStatus;
//     await command.save();

//     // Return the updated command
//     res.status(200).json({ message: 'Payment status updated successfully', command });
//   } catch (err) {
//     console.error('Error changing payment status:', err);
//     res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// };
// //change paymentMethod
// exports.changePaymentMethod = async (req, res) => {
//   const { commandId, newPaymentMethod } = req.body;

//   try {
//     // Validate the new payment method
//     const validPaymentMethods = ['Online', 'Delivery'];
//     if (!validPaymentMethods.includes(newPaymentMethod)) {
//       return res.status(400).json({ message: 'Invalid payment method. Allowed values are "Online" or "Delivery".' });
//     }

//     // Find the command by ID
//     const command = await Command.findById(commandId);
//     if (!command) {
//       return res.status(404).json({ message: 'Command not found' });
//     }

//     // If the payment method is changing, we should also update the payment status
//     let paymentStatus = 'Unpaid';  // Default status for Delivery
//     if (newPaymentMethod === 'Online') {
//       paymentStatus = 'Paid';  // Set to "Paid" if the payment method is "Online"
//     }

//     // Update the payment method and payment status
//     command.paymentMethod = newPaymentMethod;
//     command.paymentStatus = paymentStatus;

//     // Save the updated command
//     await command.save();

//     // Return the updated command
//     res.status(200).json({ message: 'Payment method updated successfully', command });
//   } catch (err) {
//     console.error('Error changing payment method:', err);
//     res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// };
// Create a new command from the user's cart
// exports.createCommand = async (req, res) => {
//   try {
//     const { userId, address, paymentMethod } = req.body;

//     // Check if the user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Retrieve the user's cart
//     const cart = await Cart.findOne({ userId }).populate("salesID");
//     console.log("Cart:", cart);
//     console.log("Cart.salesIds:", cart?.salesID);

//     // Check if the cart or salesIds is empty
//     if (!cart || !cart.salesID || !Array.isArray(cart.salesID) || cart.salesID.length === 0) {
//       return res.status(400).json({ message: "Cart is empty or not found" });
//     }

//     // Extract only the `_id` values from salesIds
//     const saleIds = cart.salesID.map((sale) => sale._id);

//     // Create a new command
//     const newCommand = new Command({
//       userId,
//       address,
//       saleId: saleIds, // Pass only the array of ObjectId values
//       orderStatus: "Pending",
//       paymentStatus: "Unpaid",
//       paymentMethod,
//       totalPrice: cart.cartTotal,
//     });

//     // Save the new command in the database
//     const savedCommand = await newCommand.save();

//     // Clear the cart after placing the order
//     cart.salesID = [];
//     cart.cartTotal = 0;
//     await cart.save();

//     res.status(201).json(savedCommand);
//   } catch (error) {
//     console.error("Error creating command:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
exports.createCommand = async (req, res) => {
  try {
    const { userId, address, paymentMethod } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve the user's cart
    const cart = await Cart.findOne({ userId }).populate("salesID");
    console.log("Cart:", cart);
    console.log("Cart.salesID:", cart?.salesID);

    // Check if the cart or salesID is empty
    if (!cart || !cart.salesID || !Array.isArray(cart.salesID) || cart.salesID.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not found" });
    }

    // Extract only the `_id` values from salesID
    const saleIds = cart.salesID.map((sale) => sale._id);
    console.log("Extracted saleIds:", saleIds);

    // Create a new command
    const newCommand = new Command({
      userId,
      address,
      saleId: saleIds, // Pass only the array of ObjectId values
      orderStatus: "Pending",
      paymentStatus: "Unpaid",
      paymentMethod,
      totalPrice: cart.cartTotal,
    });

    // Save the new command in the database
    const savedCommand = await newCommand.save();

    // Clear the cart after placing the order
    cart.salesID = [];
    cart.cartTotal = 0;
    await cart.save();

    res.status(201).json(savedCommand);
  } catch (error) {
    console.error("Error creating command:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all commands
exports.getAllCommands = async (req, res) => {
  try {
    const commands = await Command.find().populate("userId").populate("saleId");
    res.status(200).json(commands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Get a command by ID
// exports.getCommandById = async (req, res) => {
//   try {
//     const command = await Command.findById(req.params.id).populate("userId").populate("saleId");
//     if (!command) {
//       return res.status(404).json({ message: "Command not found" });
//     }
//     res.status(200).json(command);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// Get a command by ID
exports.getCommandById = async (req, res) => {
  try {
    const commandId = req.params.id;

    // Find the command and populate userId and saleId
    const command = await Command.findById(commandId)
      .populate("userId") // Populate the userId field
      .populate("saleId"); // Populate the saleId field (array of references)

    // Log the command for debugging
    console.log("Command:", command);

    // Check if the command exists
    if (!command) {
      return res.status(404).json({ message: "Command not found" });
    }

    // Return the command as a JSON response
    res.status(200).json(command);
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching command by ID:", error);

    // Return a 500 error with the error message
    res.status(500).json({ message: error.message });
  }
};

// Update a command
exports.updateCommand = async (req, res) => {
  try {
    const updatedCommand = await Command.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCommand) {
      return res.status(404).json({ message: "Command not found" });
    }
    res.status(200).json(updatedCommand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a command
exports.deleteCommand = async (req, res) => {
  try {
    const deletedCommand = await Command.findByIdAndDelete(req.params.id);
    if (!deletedCommand) {
      return res.status(404).json({ message: "Command not found" });
    }
    res.status(200).json({ message: "Command successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
