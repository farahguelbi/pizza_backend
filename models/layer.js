const mongoose = require('mongoose');

const layerSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['dough', 'sauce', 'cheese', 'topping'],  
    required: true,
  },
  options: {
    type: [String], 
    required: true,
  },
});

module.exports = mongoose.model('Layer', layerSchema);
