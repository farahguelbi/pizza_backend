const Command = require('../models/command');
const Sale = require('../models/sale');  
const User = require('../models/user');  
const Cart = require('../models/cart');


// 1. Create a new command (place command)
exports.createCommand = async (req, res) => {
  const { userID, address, cartId, paymentMethod } = req.body;

  try {
    // Find the cart by ID
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the user by ID
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate the total price of the command (based on cartTotal)
    const totalPrice = cart.cartTotal;

    // Set payment status based on payment method selected
    let paymentStatus = 'Unpaid';  // Default payment status
    if (paymentMethod === 'Online') {
      paymentStatus = 'Paid';  // Mark as "Paid" for online payment
    }

    // Create a new Command (Order)
    const command = new Command({
      userID: userID,
      address: address,
      cartId: cartId,
      orderStatus: 'Pending', // Default status
      paymentStatus: paymentStatus, // Set based on payment method
      paymentMethod: paymentMethod, // "Online" or "Delivery"
      totalPrice: totalPrice,
    });

    // Save the command (order)
    await command.save();

    // Optionally, clear the cart after placing the order
    cart.salesID = [];
    cart.cartTotal = 0;
    await cart.save();

    // Return the created command
    res.status(201).json({ message: 'Order created successfully', command });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// 2. Get Command By ID
exports.getCommandById = async (req, res) => {
  const { commandId } = req.params;

  try {
    // Find the command by ID and populate necessary fields (e.g., cart and user)
    const command = await Command.findById(commandId)
      .populate('cartId')
      .populate('userID')
      .populate('cartId.salesID'); // Populate sales (items in the cart)

    if (!command) {
      return res.status(404).json({ message: 'Command not found' });
    }

    res.status(200).json({ message: 'Command found', command });
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// 3. Cancel Command (Set orderStatus to "Cancelled")
exports.cancelCommand = async (req, res) => {
  const { commandId } = req.body;

  try {
    // Find the command by ID
    const command = await Command.findById(commandId);
    if (!command) {
      return res.status(404).json({ message: 'Command not found' });
    }

    // Check if the order has already been completed
    if (command.orderStatus === 'Completed') {
      return res.status(400).json({ message: 'Order is already completed and cannot be cancelled' });
    }

    // Update the order status to "Cancelled" and set paymentStatus to "Unpaid"
    command.orderStatus = 'Cancelled';
    command.paymentStatus = 'Unpaid'; // Change paymentStatus to "Unpaid"
    await command.save();

    res.status(200).json({ message: 'Order cancelled successfully', command });
  } catch (err) {
    console.error('Error cancelling order:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};


// 4. Complete Command (Set orderStatus to "Completed")
exports.completeCommand = async (req, res) => {
  const { commandId } = req.body;

  try {
    // Find the command by ID
    const command = await Command.findById(commandId);
    if (!command) {
      return res.status(404).json({ message: 'Command not found', error: 'Invalid command ID' });
    }

    // Check if the order has already been completed
    if (command.orderStatus === 'Completed') {
      return res.status(400).json({ message: 'Order is already completed', error: 'Order already completed' });
    }

    // Update the order status to "Completed"
    command.orderStatus = 'Completed';
    await command.save();

    // Return the updated command in the response
    res.status(200).json({ message: 'Order completed successfully', command });
  } catch (err) {
    console.error('Error completing order:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// 5. Change the payment status (manual update)
exports.changePaymentStatus = async (req, res) => {
  const { commandId, paymentStatus } = req.body;

  try {
    // Validate that paymentStatus is either 'Paid' or 'Unpaid'
    if (paymentStatus !== 'Paid' && paymentStatus !== 'Unpaid') {
      return res.status(400).json({ message: 'Invalid payment status. Must be "Paid" or "Unpaid".' });
    }

    // Find the command by ID
    const command = await Command.findById(commandId);
    if (!command) {
      return res.status(404).json({ message: 'Command not found', error: 'Invalid command ID' });
    }

    // Update the paymentStatus of the command
    command.paymentStatus = paymentStatus;
    await command.save();

    // Return the updated command
    res.status(200).json({ message: 'Payment status updated successfully', command });
  } catch (err) {
    console.error('Error changing payment status:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
//change paymentMethod
exports.changePaymentMethod = async (req, res) => {
  const { commandId, newPaymentMethod } = req.body;

  try {
    // Validate the new payment method
    const validPaymentMethods = ['Online', 'Delivery'];
    if (!validPaymentMethods.includes(newPaymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method. Allowed values are "Online" or "Delivery".' });
    }

    // Find the command by ID
    const command = await Command.findById(commandId);
    if (!command) {
      return res.status(404).json({ message: 'Command not found' });
    }

    // If the payment method is changing, we should also update the payment status
    let paymentStatus = 'Unpaid';  // Default status for Delivery
    if (newPaymentMethod === 'Online') {
      paymentStatus = 'Paid';  // Set to "Paid" if the payment method is "Online"
    }

    // Update the payment method and payment status
    command.paymentMethod = newPaymentMethod;
    command.paymentStatus = paymentStatus;

    // Save the updated command
    await command.save();

    // Return the updated command
    res.status(200).json({ message: 'Payment method updated successfully', command });
  } catch (err) {
    console.error('Error changing payment method:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
