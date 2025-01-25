const mongoose=require("mongoose");
const userSchema=new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            trim:true
        },
        lastName:{
            type:String,
            required:true,
            trim:true
        },
         imageUrl:{
            type: String,
            default:''

          },
          email: {
            type: String,
            required: true,
            unique:true
          },
          address: {
            type: String,
            default:''

        
          },
          phone: {
            type: String,
            default:''

        
          },
          password: {
            type: String,
            required: true,
          },
          gender: {
            type: String,
            enum: ['Male', 'Female','Other'],
            default:'Other',
          },  
          birthDate: {
            type: Date,
            default:null,
          },
        }, { timestamps: true });
        /*hash password!*/

module.exports = mongoose.model('User', userSchema);

  