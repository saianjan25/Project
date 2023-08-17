const User = require("../models/User.js");
const express = require("express");
const Jwt = require("jsonwebtoken");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const salt = bcrypt.genSaltSync(10);

app.use(cookieParser());

const registration = async(req,res) =>{
    console.log("Register controller");
    const {email,username,password} = req.body;
    if(!email || !username || !password){
        return res.status(400).json({message : "Fill all details"})
    }
    try{
        const isUser = await User.findOne({email});
        if(!isUser){
            const hashedPassword = bcrypt.hashSync(password,salt)
            const user = await User.create({email,username,password : hashedPassword});
            console.log(user);
            return res.status(200).json({message : "User created ",user});
        }
        return res.status(409).json({message : "User already existed"});
    }
    catch(err){
        console.log("in "+err.message);
        return res.status(500).json({message : "Server error "});
    }
}


//Login Controller
const login = async(req,res) =>{
    console.log("login controller");
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message : "Fill all details"})
    }
    try{
        const isUser = await User.findOne({email});
        if(isUser){
            const match = await bcrypt.compare(password,isUser.password); 
            if(match)
            {  
                const token = Jwt.sign({userId : isUser._id},process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_LIFETIME,
                });
                return res.status(200).json({message : "User logged in ",user : isUser,token});
            }
                
            else
                return res.status(401).json({message : "Invallid cradentials"});
        }        
        return res.status(401).json({message : "invalid credentials"});
    }
    catch(err){
        console.log(err.message);
        return res.status(500).json({message : "Server error "});
    }
}

const profile = (req,res) =>{
    const token = req.token;
    console.log("profile",token);
    Jwt.verify(token,process.env.JWT_SECRET,(err,info)=>{
        if (err) return res.status(401).json({message : "not logged in"});
        return res.status(200).json({message : "logged in",info});
    });
}

const logout = (res,req)=>{
    const token = localStorage.getItem("token");
    // console.log("logout",token);
    if (token){
        return res.status(500).json({message : "server error"});
    }
    return res.status(200).json({mssage : "logged out successfully"});
}
module.exports = {registration,login,profile,logout}