const mongoose = require('mongoose');
const type = require('./type');

// Sale schema to store sale details with quantities for pizzas and sides
const saleSchema = new mongoose.Schema(
  {
    // Pizza reference with quantity
    pizzaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pizza',
      required: true,
    },
    quantitypizza: {
      type: Number,
      required: true,
      min: 1,
    },

    // User reference for the person making the sale
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Total price for the sale (pizza + sides)
    totalprice: {
      type: Number,
      required: true,
    },

    // Sides array (each with quantity)
    sides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Side',
        required: true,
      },
    ],
    quantitiesides: [
      {
        type: Number,
        required: true,
        min: 1,
      },
    ], // To hold the quantity for each side
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
