const Cart = require('../models/cart');
const Pizza = require('../models/Pizza');
const Side = require('../models/sides');
const Sale = require('../models/sale'); 

// Create a new cart or get the existing one for a user
exports.createOrGetCart = async (req, res) => {
  const { userId } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    // If the user doesn't have a cart, create a new one
    if (!cart) {
      cart = new Cart({ userId, cartTotal: 0 });
      await cart.save();
      return res.status(201).json({ message: 'Cart created', cart });
    }

    res.status(200).json({ message: 'Cart found', cart });
  } catch (err) {
    console.error('Error creating or fetching cart:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// Add a sale to the cart (pizza + sides with quantity)
exports.addSaleToCart = async (req, res) => {
  const { userId, saleId } = req.body;

  try {
    // Find the sale by saleId
    const sale = await Sale.findById(saleId).populate('pizzaId').populate('sides');
    
    if (!sale) return res.status(404).json({ message: 'Sale not found' });

    // Calculate the total price of the sale (pizza + sides)
    const totalSalePrice = sale.totalprice;

    // Find the cart for the user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({
        userId,
        salesID: [saleId],  // Store only the saleId here, no additional properties
        cartTotal: totalSalePrice,
      });
      await cart.save();
      return res.status(201).json({ message: 'Cart created and sale added', cart });
    } else {
      // If the cart exists, add the saleId to the salesID array
      cart.salesID.push(saleId);

      // Update the cart's total price
      cart.cartTotal += totalSalePrice;
      await cart.save();

      return res.status(200).json({ message: 'Sale added to cart', cart });
    }
  } catch (err) {
    console.error('Error adding sale to cart:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// Get the cart details
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the cart for the user and populate sales
    const cart = await Cart.findOne({ userId }).populate('sales.saleId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);  // Return the cart with all sales
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};







// Add an item to the cart (pizza and optional sides)
exports.addToCart = async (req, res) => {
    const { userId, pizzaId, quantity, sizeId, sides } = req.body;
    try {
        // Check if the pizza exists
        const pizza = await Pizza.findById(pizzaId);
        if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
    
        // Find the selected size from the pizza sizes array
        const selectedSize = pizza.sizes.find(s => s.id === sizeId);
        if (!selectedSize) return res.status(404).json({ message: 'Size not found' });
    
        // Calculate the total price of the pizza item (base pizza price + selected size price)
        const pizzaTotalPrice = (pizza.price + selectedSize.price) * quantity;
    
        // Calculate the total price of sides (if any)
        let sidesTotalPrice = 0;
        for (let i = 0; i < sides.length; i++) {
          const side = await Side.findById(sides[i]);
          if (!side) return res.status(404).json({ message: 'Side not found' });
          sidesTotalPrice += side.price;
        }
    
        // Calculate the final total for the item (pizza + sides)
        const totalItemPrice = pizzaTotalPrice + sidesTotalPrice;
    
        // Check if the cart already exists for the user
        let cart = await Cart.findOne({ userId });
    
        if (!cart) {
          // If the cart doesn't exist, create a new cart
          cart = new Cart({
            userId,
            items: [{
              pizzaId,
              quantity,
              sizeId,
              sides,
              totalPrice: totalItemPrice,
            }],
            cartTotal: totalItemPrice,
          });
        } else {
          // If cart exists, check if pizza is already in the cart
          const itemIndex = cart.items.findIndex(item => item.pizzaId.toString() === pizzaId.toString() && item.sizeId.toString() === sizeId.toString());
    
          if (itemIndex > -1) {
            // If the pizza already exists, update the quantity and total price
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].totalPrice += totalItemPrice;
          } else {
            // If the pizza doesn't exist, add it to the cart
            cart.items.push({
              pizzaId,
              quantity,
              sizeId,
              sides,
              totalPrice: totalItemPrice,
            });
          }
    
          // Update the cart total
          cart.cartTotal = cart.items.reduce((total, item) => total + item.totalPrice, 0);
        }
    
        // Save the cart
        await cart.save();
    
        res.status(200).json({ message: 'Item added to cart', cart });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    };
    
    // Get the cart details
    exports.getCart = async (req, res) => {
      const { userId } = req.params;
    
      try {
        const cart = await Cart.findOne({ userId })
          .populate('salesID')  // Populate sales
          .populate('salesID.pizzaId')  // Populate pizzaId in sales
          .populate('salesID.sides');  // Populate sides in sales
    
        if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
        }
    
        res.status(200).json(cart);  // Return the cart with populated details
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    };
    
    // Remove an item from the cart
exports.removeFromCart = async (req, res) => {
    const { userId, pizzaId, sizeId } = req.body;
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      // Find the item to remove
      const itemIndex = cart.items.findIndex(item => item.pizzaId.toString() === pizzaId.toString() && item.sizeId.toString() === sizeId.toString());
  
      if (itemIndex === -1) {
        return res.status(400).json({ message: 'Item not found in cart' });
      }
  
      // Remove the item from the cart
      const itemPrice = cart.items[itemIndex].totalPrice;
      cart.items.splice(itemIndex, 1);
       // Update the cart total
    cart.cartTotal -= itemPrice;

    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Clear the cart
exports.clearCart = async (req, res) => {
    const { userId } = req.body;
  
    try {
      // Find the cart and clear it
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      cart.items = [];
      cart.cartTotal = 0;
  
      await cart.save();
  
      res.status(200).json({ message: 'Cart cleared', cart });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  // Remove a sale from the cart
  exports.removeSaleFromCart = async (req, res) => {
    const { userId, saleId } = req.body;
  
    try {
      // Find the cart for the user
      const cart = await Cart.findOne({ userId });
  
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      // Ensure the salesID array is initialized as an array
      if (!Array.isArray(cart.salesID)) {
        cart.salesID = [];  // Initialize it as an empty array if not already
      }
  
      // Find the index of the sale in the salesID array
      const saleIndex = cart.salesID.findIndex(item => item.toString() === saleId.toString());
  
      if (saleIndex === -1) {
        return res.status(400).json({ message: 'Sale not found in cart' });
      }
  
      // Remove the sale from the cart's salesID array
      cart.salesID.splice(saleIndex, 1);
  
      // Calculate the new cart total
      const totalPrice = cart.salesID.reduce((total, item) => total + item.totalPrice, 0);
      cart.cartTotal = totalPrice;
  
      // Save the updated cart
      await cart.save();
  
      res.status(200).json({ message: 'Sale removed from cart', cart });
    } catch (err) {
      console.error('Error removing sale from cart:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  };
// Clear the cart
exports.clearCart = async (req, res) => {
  const { userId } = req.body;

  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear the salesID array and reset cartTotal
    cart.salesID = [];
    cart.cartTotal = 0;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Cart cleared', cart });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};