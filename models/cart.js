const mongoose=require('mongoose');
const cartSchema=new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    salesID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }], 
    cartTotal: { type: Number, required: true, default: 0 },
}, { timestamps: true });

module.exports=mongoose.model('Cart',cartSchema);
