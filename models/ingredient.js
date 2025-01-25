const mongoose = require('mongoose');
const ingredientSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
       // required:true
       default:''
    },
    layer: {
    type: String,
    enum: ['dough', 'sauce', 'cheese', 'topping'],  
    required: true,
      }
  
});
module.exports=mongoose.model('Ingredient',ingredientSchema);