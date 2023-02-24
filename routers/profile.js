const express = require("express");
const req = require("express/lib/request");
const router=express.Router();
const User = require("../model/user");


router.get("/profile",async (req,res)=>{
    
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;

    const user_data=await User.findOne({username:user});
    res.render("profile.ejs",{isLoggedIn,user,user_data});
});


module.exports=router;