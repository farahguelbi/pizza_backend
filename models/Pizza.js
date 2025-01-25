const mongoose=require('mongoose');
const type = require('./type');

const pizzaSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
            default:'Custom pizza'
        },
        image:{
            type:String,
            default:''

        },
        reference:{
            type:String,
            default:''
        },
        description:{
            type:String,
            default:''
        },
        price:{
            type:Number,
            required:true,
            default:0
        },
        ingredients:
            [
                {
                   type:mongoose.Schema.Types.ObjectId,ref:'Ingredient',
                   quantity: { type: Number, default: 1 }
                }
            ],
       
    
        type:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Type',
            required:true
        },

            
            size: [
                {
                  size: { 
                    type: String, 
                    required: true, 
                    enum: ['small', 'medium', 'large'], // Enum for sizes
                  },
                  price: { 
                    type: Number, 
                    required: true 
                  }
                }
              ],
       
        }, { timestamps: true });

module.exports = mongoose.model('Pizza', pizzaSchema);

    