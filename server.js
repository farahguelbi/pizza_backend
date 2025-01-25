//Importing necessary modules 
const express=require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require('morgan');
const cors = require("cors"); // Import cors
const bodyParser = require("body-parser");
const userRoutes=require("./routes/userRoutes");
const ingredientRoutes=require("./routes/ingredientRoutes");
const pizzaRoutes = require('./routes/pizzaRoutes');
const sideRoutes = require('./routes/sideRoutes');  
const typeRoutes=require('./routes/typeRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');  
const saleRoutes = require('./routes/saleRoutes');
const cartRoutes=require('./routes/cartRoutes');
const CommandRoutes=require('./routes/commandRoutes');
const app=express();
dotenv.config();
app.use(morgan('dev'))
app.use("/uploads/images", express.static("uploads/images"));

// Middleware
app.use(express.json());
// Routes
app.use("/api/users", userRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/sides', sideRoutes);
app.use('/api/types', typeRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/command', CommandRoutes);


const Host=process.env.Host||'0.0.0.0';
//MongoDB Connection 
mongoose
.connect(process.env.MONGODB_URI)
.then(()=>console.log("connected to MongoDB"))
.catch((err)=>
console.log("Error Connecting to MongoDB",err));
//start the web server 
app.listen(5000,Host, () => {
  console.log('Server is running on port 5000');
});


