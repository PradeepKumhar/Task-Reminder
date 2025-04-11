const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

//SignUP

router.post("/signup", async (req, res) => {
    try{
     const {name, email, password} = req.body;
     const existingUser = await User.findOne({email});
     if(existingUser) {
        return res.status(400).json({msg: "Email already exists"});
     }

     const salt  = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt);
     
   
     const newUser = new User({name,email, password: hashedPassword});
     await newUser.save();
     res.json({msg: "User created successfully"});

    }
    catch(error){
        res.status(500).json({message: "Sever Error"});
    }
});

router.post("/login", async (req,res)=>{
    try{
     const {email, password} = req.body;
     const user = await User.findOne({email});
     if(!user) return res.status(400).json({message: "Invalid credentials"});

     const isMatch = await bcrypt.compare(password, user.password);
     
     if(!isMatch) return res.status(400).json({message: "Invalid credentials"});

     //Generate jwt Token

     const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET,{expiresIn: "7d"});

     res.status(200).json({message:"Login sucessful",token , user});

    }
    catch(error){
        res.status(500).json({message: "Sever Error"});
    }
});

module.exports = router;

