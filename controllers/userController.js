const bcrypt=require("bcryptjs");
const User=require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const  OTP=require('../models/OTP');

const blacklistedTokens = new Set();

//register User 
exports.registerUser=async (req,res)=>{
    console.log(req.body);  // Log the request body to verify it's being received correctly

    const { firstName, lastName, email, password, imageUrl, address, phone, gender, birthDate } = req.body;
        if(!firstName||!lastName||!email||!password){
            return res.status(400).json({ message: "Missing required fields" });

        }
       /* //verify if password=confirmPassword 
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
          }*/
        
        try{
            const existingUser =await User.findOne({ email });
            if(existingUser) return res.status(400).json({ message: "User already exists" });
            //hash password before saving it 
            const hashedPassword =await bcrypt.hash(password,10);
            //const parsedBirthDate = birthDate ? new Date(birthDate) : null;

            //create user 
            const newUser= new User({
                firstName,
                lastName,
                email,
                password:hashedPassword,
                imageUrl: imageUrl || "",  
                address:address || "",
                phone:phone || "",
                gender: gender || "",
                birthDate:birthDate ? new Date(birthDate) : null,

                }
            );
            //save the new user to database 
            await newUser.save();
            res.status(201).json({ message: "User registered successfully", uId: newUser._id });
        }catch(err){
            res.status(500).json({ message: "An error occurred", error: err.message });
        }
        };
        //login User 
        exports.loginUser = async (req, res) => {
            const { email, password } = req.body;
        
            // Check if email and password are provided
            if (!email || !password) {
                return res.status(400).json({ success: false, message: "Email and password are required!" });
            }
        
            try {
                // Find the user by email
                const user = await User.findOne({ email });
                if (!user) {
                    return res.status(400).json({ success: false, message: "Invalid email!" });
                }
        
                // Check if password matches
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ success: false, message: "Invalid password!" });
                }
        
                // Generate JWT token
                const token = jwt.sign(
                    { id: user._id, email: user.email },
                    'secretValue',
                    { expiresIn: "8d" }
                );
        
                // Calculate token expiration date
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 8);
        
                // Send successful response
                res.status(200).json({
                    message: "Login successful.",
                    token,
                    tokenExpiration: expirationDate.toISOString(),
                    Uid: user._id,
                });
        
            } catch (err) {
                res.status(500).json({ success: false, message: "Internal server error." });
            }
        };
        

//get user by ID 
exports. getUserById = async (req, res) => {
    const { id } = req.params; 
    
    // Vérifier si l'ID est valide
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid or missing User ID.",
        });
    }
    
    try {
        // Recherche de l'utilisateur par ID
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Réponse en cas de succès
        return res.status(200).json({
            success: true,
            message: "User retrieved successfully.",
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the user.",
        });
    }
};

//get ALL users
exports. getAllUsers=async (req,res)=>{
    try{
        const users = await User.find().select('-password');;
        res.status(200).json(users);

    }catch(err){
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving users.",
            error: err.message,
        });
    }
};
// Update User
exports.updateUser = async (req, res) => {
    const { firstName, lastName, phone, address, gender, birthDate } = req.body;
    const { id } = req.params; // Retrieve the user ID from the URL parameters

    // Validate the user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    try {
        // Update the user's profile
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, phone, address, gender, birthDate },
            { new: true, runValidators: true } // Return the updated user and validate the inputs
        );

        // Check if user was found
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Send success response
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile:", error);

        // Handle server errors
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the profile.",
            error: error.message,
        });
    }
};


// Logout User
exports. logoutUser = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(400).json({ message: "No token provided" });
    }

    blacklistedTokens.add(token); 
    res.status(200).json({ message: "Logout successful" });
};

exports. forgetPassword = async(req,res)=>{
try {

    var emaill = req.body.email
    const  random=Math.floor(1000 + Math.random() * 9000);
    console.log('Email provided:', emaill);


   const user=await User.findOne({email:emaill});
   console.log("Fetched User:", user);

   if (!user) {
    console.log('User not found in the database for email:', emaill);

    return res.status(404).json({
        message: 'No email found',
    });
}
console.log('User found:', user);


            const htmlMessage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    /* General Reset */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* Body Styles */
    body {
      font-family: Arial, sans-serif;
      background: #b22b2b;
      color: #fff;
      padding: 0;
      margin: 0;
    }

    /* Main Email Container */
    .email-container {
      max-width: 700px;
      margin: 50px auto;
      background: #fff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }

    /* Header Section */
    .email-header {
      text-align: center;
      padding: 25px;
      background-color: #b22b2b;
      border-radius: 10px 10px 0 0;
    }

    .email-header h1 {
      font-size: 2.5rem;
      font-weight: bold;
      color: #fff;
      margin-bottom: 15px;
    }

    .email-header img {
      width: 80px;
      margin-top: 15px;
      border-radius: 50%;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    /* Email Content Section */
    .email-content {
      font-size: 18px;
      line-height: 1.6;
      color: #333;
      padding: 20px;
      background: #fff;
      border-radius: 10px;
      margin-top: 20px;
    }

    .email-content p {
      margin-bottom: 20px;
    }

    .email-content .code {
      font-size: 24px;
      font-weight: bold;
      color: #b22b2b;
      text-align: center;
      background: #f5f5f5;
      padding: 10px;
      border-radius: 8px;
      margin: 20px 0;
      letter-spacing: 2px;
    }

    /* Footer Section */
    .email-footer {
      font-size: 14px;
      color: #bbb;
      text-align: center;
      margin-top: 25px;
      padding-top: 15px;
      border-top: 1px solid #ccc;
    }

    .email-footer p {
      margin-bottom: 10px;
    }

    .email-footer a {
      color: #b22b2b;
      text-decoration: none;
      font-weight: bold;
    }

    .email-footer a:hover {
      text-decoration: underline;
    }

    /* Responsive Styles */
    @media (max-width: 600px) {
      .email-container {
        padding: 20px;
        margin: 20px;
      }

      .email-header h1 {
        font-size: 2rem;
      }

      .email-content {
        font-size: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header Section -->
    <div class="email-header">
      <h1>Password Reset Request</h1>
      <img src="https://images.app.goo.gl/TetDAE5RHWLJGtEp7" alt="Reset Password Icon">
    </div>

    <!-- Email Content Section -->
    <div class="email-content">
      <p>Hi <strong>${req.body.email}</strong>,</p>
      <p>We received a request to reset your password for your account. Use the code below to reset it:</p>
      <div class="code">${random}</div>
      <p>Please note that this code is valid for the next 15 minutes. If you didn’t request a password reset, you can ignore this email.</p>
      <p>If you have any questions or concerns, feel free to contact us.</p>
      <p>Best regards,</p>
      <p><strong>Pizza Palooza Support Team</strong></p>
    </div>

    <!-- Footer Section -->
    <div class="email-footer">
      <p>&copy; 2024 Pizza Palooza. All rights reserved.</p>
      <p>Contact us: <a href="mailto:mypizzapalooza@gmail.com">mypizzapalooza@gmail.com</a> | +123 456 7890</p>
    </div>
  </div>
</body>
</html>
`;

            const details={
                from:"mypizzapalooza@gmail.com",
                to:emaill,
                subject:"Please reset your password",
                html:htmlMessage,
            
            };
            const  mailTransporter= nodemailer.createTransport({
                service:"gmail",auth:{user:"mypizzapalooza@gmail.com",pass:"hhmz uvmq tqbo vlqg",}
}); 
                              // Send email
        mailTransporter.sendMail(details, async (err) => {
            if (err) {
                console.error('Error sending email:', err);

                return res.status(500).json({ message: err.message || "Failed to send email" });
            }

                    
                 // Create OTP with 15 minutes expiry
                      const date = new Date(Date.now());
                      date.setMinutes(date.getMinutes() + 15);
          
                      const otp = new OTP({ email: emaill, otp: random, expiry_date: date });
          
                      const oldOTP = await OTP.findOne({ email: emaill });
                      if (!oldOTP) {
                          await otp.save();
                      } else {
                          oldOTP.expiry_date = otp.expiry_date;
                          oldOTP.otp = otp.otp;
                          await OTP.findByIdAndUpdate(oldOTP.id, oldOTP);
                      }
          
                      // Send success response
                      return res.json({
                          message: "Email sent successfully",
                      });
                  });
              } catch (error) {
                  // Catch and return any unhandled errors
                  console.error('Error in forgetPassword function:', error);

                  res.status(500).json({
                      message: "An unexpected error occurred",
                      error: error.message,
              });
          }
        };
          
// reset password 

exports. Resetpassword = async (req,res)=>{
    var passwordd = req.body.password
    var emaill = req.body.email

    bcrypt.hash(passwordd,10,async function(err,hashedPass){
        if(err){
            return  res.status(500).json({
                message : err
            })
        }
        await User.findOne({email:emaill})
        .then(async user=>{
            if(user){
                await User.findByIdAndUpdate(
                    user.id, { 
                    password: hashedPass });
                            res.json({
                            message : `password updated suuccessful`,
                         
                        })
            }else{
                return  res.status(404).json({
                    message : 'no user  found'
                })
            }
        })
    })

    
}

//updatePassword 
exports.updatePassword = async (req,res)=>{
    var oldpasswordd = req.body.oldPassword
    var newpasswordd = req.body.newPassword
    var id = req.body.id
        
        await User.findOne({_id:id})
        .then(async user=>{
            if(user){
              
                bcrypt.compare(oldpasswordd,user.password,async function(err,result){
                    if(err){
                        return  res.status(500).json({
                            message : err
                        })
                    }
                    if(result){
                        bcrypt.hash(newpasswordd,10,async function(err,newhashedPass){
                            if(err){
                                return  res.status(500).json({
                                    message : err
                                })
                            }
                            await User.findOne({_id:id})
                            .then(async user=>{
                                if(user){
                                    await User.findByIdAndUpdate(
                                        user.id, { 
                                        password: newhashedPass });
                                                res.json({
                                                message : `password updated suuccessful`,
                                             
                                            })
                                }else{
                                    return  res.status(404).json({
                                        message : 'no user  found'
                                    })
                                }
                            })})
    
                    }else{
                        return  res.status(202).json({
                            message : 'wrong password'
                        })
                    }
                })
                
                
                
            }else{
                return  res.status(404).json({
                    message : 'no user  found'
                })
            }
      
        })

};

//deleteUser
exports. deleteUser = async (req, res) => {
    var id  = req.body.id;
  
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }else{
                res.status(200).json({ message: 'User deleted successfully' });

      }
    } catch (error) {
      res.status(500).json({ message: 'Error occurred while deleting user' });
    }
  };
// verif code 
exports. VerifCode = (req,res,next)=>{
    var codee =req.body.otp
    var emaill = req.body.email

    OTP.findOne({$and:[{otp:codee},{email:emaill}]})
    .then(otp=>{
        if(otp){
            let  date =new Date( Date.now())
            date.setMinutes(date.getMinutes()+0)
           
            if(otp.expiry_date<date){
                return res.status(400).json({
                    message : `expired code`,
                })
            }else{
                res.json({
                        message : `code suuccessful`,
                     
                    })
            }

                        
        }else{
            return  res.status(404).json({
                message : 'no code found '
            })
        }
    })
}