const mongoose = require('mongoose');
const type = require('./type');

// Sale schema to store sale details with quantities for pizzas and sides
const saleSchema = new mongoose.Schema(
  {
    pizzaId: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: 'Pizza',
      refPath: 'pizzaType',
      required: true,
    },

    quantitypizza: {
      type: Number,
      required: true,
      min: 1,
    },
    pizzaType: {
      type: String,
      required: true,
      enum: ['Pizza','PizzaCustom'], 
    
    },
    // User reference for the person making the sale
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Total price for the sale (pizza + sides)
    totalPrice: {
      type: Number,
      required: true,
      default:0,
    },

    sides: [
      {
        sideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Side', required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
