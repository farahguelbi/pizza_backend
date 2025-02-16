// const mongoose=require('mongoose');

// const pizzaCustomSchema=new mongoose.Schema(
//     {
//         name:{
//             type:String,
//             required:true,
//             trim:true,
//             default:'Custom pizza'
//         },
//         // image:{
//         //     type:String,
//         //     default:''

//         // },
//         // reference:{
//         //     type:String,
//         //     default:''
//         // },
//         // description:{
//         //     type:String,
//         //     default:''
//         // },
//         price:{
//             type:Number,
//             required:true,
//             default:0
//         },
//         ingredients: [
//           {
//             ingredientId: {
//              type:String,
//               required: true,
//             },
//             quantity: {
//               type: Number,
//               required: true,
//               default: 1,
//             },
//           },
//         ],
        
    
//         // type:{
//         //     type:mongoose.Schema.Types.ObjectId,
//         //     ref:'Type',
//         //     required:true
//         // },
    

//         size: { 
//             small: {
//               price: { type: Number, required: true },
//             },
//             medium: {
//               price: { type: Number, required: true },
//             },
//             large: {
//               price: { type: Number, required: true },
//             }
//           },
       
//         },

            
//             // size: [
//             //     {
//             //       size: { 
//             //         type: String, 
//             //         required: true, 
//             //         enum: ['small', 'medium', 'large'], // Enum for sizes
//             //       },
//             //       price: { 
//             //         type: Number, 
//             //         required: true 
//             //       }
//             //     }
//             //   ],
       
//          { timestamps: true });

// module.exports = mongoose.model('PizzaCustom', pizzaCustomSchema);

const mongoose = require('mongoose');

const pizzaCustomSchema=new mongoose.Schema(
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
        // reference:{
        //     type:String,
        //     default:''
        // },
        // description:{
        //     type:String,
        //     default:''
        // },
        price:{
            type:Number,
            required:true,
            default:0
        },
        ingredients: [
          {
            ingredient: {
             type:String,
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
              default: 1,
            },
          },
        ],
        
    
        // type:{
        //     type:mongoose.Schema.Types.ObjectId,
        //     ref:'Type',
        //     required:true
        // },
          userId:{type : String , required : true},
          size:{type : String , required : true}

        // size: { 
        //     small: {
        //       price: { type: Number, required: true },
        //     },
        //     medium: {
        //       price: { type: Number, required: true },
        //     },
        //     large: {
        //       price: { type: Number, required: true },
        //     }
        //   },
       
        },

            
            // size: [
            //     {
            //       size: { 
            //         type: String, 
            //         required: true, 
            //         enum: ['small', 'medium', 'large'], // Enum for sizes
            //       },
            //       price: { 
            //         type: Number, 
            //         required: true 
            //       }
            //     }
            //   ],
       
         { timestamps: true });

module.exports = mongoose.model('PizzaCustom', pizzaCustomSchema);

    