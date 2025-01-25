const express=require('express');
const userController=require("../controllers/userController");
const router=express.Router();
const multer=require('multer');
const User=require("../models/user");

const  authenticate =require('../middleware/authenticate')
//register new user
router.post('/register',userController.registerUser);
//login
router.post('/login',userController.loginUser);
//get user by ID 
router.get('/:id',userController.getUserById);
//get ALL users
router.get('/all',authenticate, userController.getAllUsers);
//update user
router.put('/update/:id',authenticate, userController.updateUser);
//logout
router.post("/logout", userController.logoutUser);
//forget password
router.post("/forget-password", userController.forgetPassword);
//resetpassword
router.post('/reset-password', userController.Resetpassword);
//updatepass
router.post('/update-password',authenticate, userController. updatePassword); 
router.delete('/delete',authenticate,userController. deleteUser);
//verify code otp
router.post('/verify-code', userController.VerifCode);








filename = "";
const mystorage = multer.diskStorage({
  destination: "./uploads/images",
  filename: (req, file, redirect) => {
    let date = Date.now();
    let f1 = date + "." + file.mimetype.split("/")[1];
    redirect(null, f1);
    filename = f1;
  },
});

const upload = multer({ storage: mystorage });

router.post("/updateImage", upload.any("image"), async (req, res) => {
  var id = req.body.id;
  try {
    await User.findByIdAndUpdate(id, {
      imageUrl:
        "http://" +
        process.env.IP_ADDRESS +
        ":" +
        process.env.PORT +
        "/uploads/images/" +
        filename,
    });
    res.status(200).json({
      message: "image updated",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




















module.exports=router;
