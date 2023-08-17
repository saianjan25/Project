const { default: mongoose } = require("mongoose");
const Profile = require("../models/Profile");
const router = require("../routes/profileRouter");
const Post = require("../models/Post");

const getProfile = async(req,res)=>{
    const user = req.params.id;
    if(user){
        return res.status(200).json({message : "profile obtained",user})
    }
    return res.status(500).json.id({message : "server error"})
}



module.exports = {getProfile}