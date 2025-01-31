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
       required:true
    },
    // layer: {
    // type: Number,
    // enum: [1, 2, 3, 4],  
    // required: true,
    //   }
  
});
module.exports=mongoose.model('Ingredient',ingredientSchema);