const mongoose=require('mongoose');
const wishlistSchema=new mongoose.Schema({
        userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        pizzas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' }]
      },
      { timestamps: true }
    );
module.exports = mongoose.model('Wishlist', wishlistSchema);

    