const mongoose=require("mongoose");
const type = require("./type");

const commandSchema=new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    orderStatus: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    paymentMethod: { type: String, enum: ['Online', 'Delivery'], required: true },  // New field
    totalPrice: { type: Number, default: 0 }
  }, { timestamps: true });

module.exports=mongoose.model('Command',commandSchema);