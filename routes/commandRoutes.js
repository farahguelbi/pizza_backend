const express = require('express');
const router = express.Router();
const commandController = require('../controllers/commandController');

// Route to create a new command (order)
router.post('/checkout', commandController.createCommand);

// Route to get command details by ID
router.get('/:commandId', commandController.getCommandById);

// Route to cancel an order
router.post('/cancel', commandController.cancelCommand);
// Route to complete an order (set orderStatus to "Completed")
router.post('/complete', commandController.completeCommand);

// Route to change the payment status of a command (Paid/Unpaid)
router.post('/payment-status', commandController.changePaymentStatus);
// Route to change the payment method of an existing command (from Online to Delivery or vice versa)
router.post('/change-payment-method', commandController.changePaymentMethod);
module.exports = router;
