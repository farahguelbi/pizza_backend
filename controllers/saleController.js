const Sale=require('../models/sale');
const Pizza=require('../models/Pizza');
const Side=require('../models/sides');

// create a new sale
exports.create = async (req, res) => {
    const { userID, PizzaId, quantitypizza, sides, quantitiesides } = req.body;

    console.log("Received PizzaId:", PizzaId); // Verify the PizzaId received in the request
    console.log("Received sides:", sides);   // Verify the sides received in the request
    console.log("Received quantitiesides:", quantitiesides); // Verify quantitiesides received

    try {
        // Fetch the pizza details
        const pizza = await Pizza.findById(PizzaId);
        if (!pizza) {
            console.log("Pizza not found for ID:", PizzaId); // Log if pizza is not found
            return res.status(404).json({ message: 'Pizza not found' });
        }
        
        // Calculate the total pizza price
        const pizzaPrice = pizza.price * quantitypizza;
        console.log("Pizza price:", pizzaPrice); // Log pizza price

        // Fetch side details if any
        let sidePrice = 0;
        for (let i = 0; i < sides.length; i++) {
            const side = await Side.findById(sides[i]);
            if (!side) {
                console.log("Side not found for ID:", sides[i]); // Log if side is not found
                return res.status(404).json({ message: 'Side not found' });
            }
            sidePrice += side.price * quantitiesides[i]; // Accumulate total side price
            console.log("Side price for side:", side.name, " is:", sidePrice); // Log side price
        }

        // Total price of the sale (pizza + sides)
        const totalPrice = pizzaPrice + sidePrice;
        console.log("Total price of sale:", totalPrice); // Log total price

        // Create the new sale
        const newSale = new Sale({
            userId: userID,
            pizzaId: pizza._id, // Ensure the pizzaId is correctly referenced
            quantitypizza,
            totalprice: totalPrice,
            sides,
            quantityside: quantitiesides
        });

        // Save the new sale
        await newSale.save();

        // Respond with success
        res.status(201).json({ message: 'Sale created successfully', sale: newSale });

    } catch (err) {
        console.log("Error occurred:", err.message); // Log any error
        res.status(500).json({ message: err.message });
    }
};


// Get a sale by its ID
exports.getSaleById = async (req, res) => {
    const { saleId } = req.params;  // Get saleId from the URL parameter
  
    try {
      const sale = await Sale.findById(saleId).populate('pizzaId').populate('sides');  // Populate pizza and side details
      if (!sale) {
        return res.status(404).json({ message: 'Sale not found' });
      }
  
      res.status(200).json(sale);  // Return the sale details
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
// Update a sale by its ID
exports.updateSale = async (req, res) => {
  try {
    const saleId = req.params.saleId;
    const updateData = req.body;

    console.log('Received request to update sale with saleId:', saleId);
    console.log('Update data:', updateData);

    // Find the existing sale
    const sale = await Sale.findById(saleId).populate('pizzaId').populate('sides');
    if (!sale) {
      console.log('Sale not found');
      return res.status(404).json({ message: 'Sale not found' });
    }

    console.log('Existing sale found:', sale);

    // Initialize total price variable
    let totalPrice = 0;

    // Update pizza details and calculate total pizza price
    if (updateData.pizzaId && updateData.quantitypizza) {
      console.log('Updating pizza details');

      const pizza = await Pizza.findById(updateData.pizzaId);
      if (!pizza) {
        console.log('Invalid pizza ID');
        return res.status(400).json({ message: 'Invalid pizza ID' });
      }

      // Calculate the total price for the pizza using its base price (no size)
      const pizzaTotal = pizza.price * updateData.quantitypizza;  // Using pizza base price
      console.log(`Calculated pizza total price: ${pizzaTotal}`);

      // Update the pizza details in the sale
      sale.pizzaId = pizza;
      sale.quantitypizza = updateData.quantitypizza;
      totalPrice += pizzaTotal;  // Add pizza price to total price
    }

    // Update sides and calculate the total price for sides
    if (updateData.sides && updateData.quantitiesides && updateData.sides.length === updateData.quantitiesides.length) {
      console.log('Updating sides details');
      let sidesTotal = 0;

      // Loop through sides and their quantities
      for (let i = 0; i < updateData.sides.length; i++) {
        const side = await Side.findById(updateData.sides[i]);
        if (!side) {
          console.log(`Invalid side ID at index ${i}`);
          return res.status(400).json({ message: `Invalid side ID at index ${i}` });
        }

        // Add the side price multiplied by its quantity to the total
        sidesTotal += side.price * updateData.quantitiesides[i];
        console.log(`Added side ${side.name} price: ${side.price} * quantity: ${updateData.quantitiesides[i]} = ${side.price * updateData.quantitiesides[i]}`);
      }

      // Update sides and the total price
      sale.sides = updateData.sides;
      sale.quantitiesides = updateData.quantitiesides;
      totalPrice += sidesTotal;  // Add the sides' total price to the pizza total price
      console.log(`Total sides price added: ${sidesTotal}`);
    }

    // Update the total price in the sale
    sale.totalprice = totalPrice; // Set the total price for the sale
    console.log(`Total price updated: ${totalPrice}`);

    // Save the updated sale
    const updatedSale = await sale.save();
    console.log('Sale updated successfully:', updatedSale);

    // Return the updated sale with the new total price
    res.status(200).json(updatedSale);
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({ message: 'Error updating sale', error });
  }
};






 // Delete a sale
exports.deleteSale = async (req, res) => {
  const { saleId } = req.params;  // Get saleId from the URL parameter

  try {
    // Find and delete the sale in one step using findByIdAndDelete
    const sale = await Sale.findByIdAndDelete(saleId);

    // If the sale was not found
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Sale deleted successfully
    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (err) {
    console.error('Error deleting sale:', err);  // Log error for debugging
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    // Find all sales from the database
    const sales = await Sale.find().populate('pizzaId').populate('sides');  // Use populate to get detailed info about pizza and sides

    if (!sales || sales.length === 0) {
      return res.status(404).json({ message: 'No sales found' });
    }

    // Return the list of all sales
    res.status(200).json(sales);
  } catch (err) {
    console.error('Error fetching sales:', err);
    res.status(500).json({ message: 'Error fetching sales', error: err.message });
  }
};

