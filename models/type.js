/*const mongoose=require('mongoose');
//enum for pizza type
const pizzaType=Object.freeze({
    Full_Pizza:'Full Pizza',
    Slice:'Slice',
});
const typeSchema= new mongoose.Schema({
    name:{
        type:String,
        enum:Object.values(pizzaType),
        require:true,
      default:'Full Pizza'
    },
});
module.exports=mongoose.model('Type',typeSchema);*/
const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Full Pizza', 'Slice'],
    required: true,
    default:'Full Pizza'
  },
});

module.exports = mongoose.model('Type', typeSchema);
