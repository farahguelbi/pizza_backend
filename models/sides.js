const type = require("./type");
const mongoose=require("mongoose");
const sideSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    type:{
        type:Number,
        enum:['drinks','fries'],
        required:true
    },
});
module.exports=mongoose.model('Side',sideSchema);