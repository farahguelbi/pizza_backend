const mongoose=require("mongoose");
const type = require("./type");

const commandSchema=new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    saleId: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true }],
    orderStatus: { type: String, enum: ['Pending', 'Completed', 'Cancelled','shipped'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    paymentMethod: { type: String, enum: ['Credit Card', 'Cash on Delivery','PayPal'], required: true },  // New field
    totalPrice: { type: Number, default: 0 }
  }, { timestamps: true });

module.exports=mongoose.model('Command',commandSchema);