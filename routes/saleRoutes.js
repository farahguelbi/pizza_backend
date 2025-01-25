const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');  // Adjust path if needed

// Route to create a new sale
router.post('/create', saleController.create);
// Define the route to get all sales
router.get('/', saleController.getAllSales);

// Route to get a sale by its ID
router.get('/:saleId', saleController.getSaleById);

// Route to update a sale by its ID
router.put('/update/:saleId', saleController.updateSale);

// Route to delete a sale by its ID
router.delete('/delete/:saleId', saleController.deleteSale);

module.exports = router;
