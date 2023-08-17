const Post = require("../models/Post");


const createPost = async(req,res)=>{
    const {image,title,description,userId} = req.body;
    if(!title || !description || !userId)
    {
        return res.status(400).json({message : "Fill all details"})
    }
    const url = "https://pixabay.com/images/search/nature/" //imageurl
    try{
        const newPost = await Post.create({
            image : url,
            title,
            description,
            user : userId
        });
        const newPostId = newPost._id;
        const post = await Post.findById(newPostId).populate("user");
        return res.status(200).json({message : "post created",post});
    }
    catch(err)
    {
        console.log(err.message);
        return res.status(500).json({message : "Server error"})
    }
}



const getAllPosts = async(req,res) => {
    try{
        const posts = await Post.find({});
        return res.status(200).json({message : "posts sent",posts});
    }catch(err){
        console.log(err.message);
        return res.status(500).json({message : "server error"});
    }
}

const getPost = async(req,res) =>{
    try{
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post)
        {
            return res.status(404).json({message : "post not found"});
        }
        return res.status(200).json({message : "post obtained",post});
    }catch(err){
        console.log(err.message);
        return res.status(500).json({message : "server error"});
    }
}



const updatePost = async(req,res)=> {    
    try{
        const id = req.params.id;
        if(!id){
            return res.status(400).json({message : "id not received"});
        }
        const post = await Post.findById(id);
        if(!post){
            return res.status(404).json({message : "post not found"}); 
        }
        const response = await Post.findByIdAndUpdate(id,req.body);
        return res.status(200).json({message : "post updated",response});

    }catch(err){
        console.log(err.message); 
        return res.status(500).json({message : "server error"});
    }
}


const deletePost = async(req,res) =>{
    try{
        const id = req.params.id;
        if(!id){
            return res.status(400).json({message : "id not received"});
        }
        const post = await Post.findById(id);
        if(!post){
            return res.status(404).json({message : "post not found"}); 
        }
        const response = await Post.findByIdAndDelete(id);
        return res.status(200).json({message : "post deleted",response});

    }catch(err){
        console.log(err.message); 
        return res.status(500).json({message : "server error"});
    }
}

module.exports = {createPost,getAllPosts,getPost,deletePost,updatePost}