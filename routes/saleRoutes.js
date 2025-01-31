const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

// Routes pour les ventes
router.post('/create', saleController.createSale);
router.post('/add-sides', saleController.addMultipleSides);
router.post('/update', saleController.updateSale);
router.get('/:saleId', saleController.getSaleById);
router.get('/', saleController.getAllSales);

router.delete('/:saleId', saleController.deleteSale);

module.exports = router;
