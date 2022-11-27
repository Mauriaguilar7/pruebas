const Post = require("../models/Post.model");
const debug = require ("debug")("app:post-controller");


const controller = {};

controller.create = async (req, res) => {
    try {
        const {name, lastName, email, number, location, description, image, imageProfile} = req.body;

        const { _id: userId } = req.user;


   const post = new Post({
    name: name,
    lastName: lastName,
    email: email,
    number: number,
    location: location,
    description: description,
    image: image,
    imageProfile: imageProfile,
    user : userId
   });

   const newPost = await post.save();

   if (!newPost){
    return res.status (409).json ({error :"Ocurrio un error al crear un post"});
   }

   return res.status(201).json(newPost);

    } catch (error) {
        debug({error})
        return res.status(500).json({error: "Error interno de servidor"})
    }
}
controller.findAll = async (req, res) =>{
    try {
        const posts = 
            await Post
            .find({ hidden: false })
            .populate("user", "username email");

        return res.status(200).json ({ posts })
        
    } catch (error) {
        debug({error})
        return res.status(500).json({error: "Error interno de servidor"})
    }
}

controller.findOwn = async (req, res) =>{
    try {
        const { _id:userId } = req.user;

        const posts = 
        await Post
        .find({ user: userId})
        .populate("user", "username email");
        
        return res.status(200).json({ posts})

    } catch (error) {
        debug({error})
        return res.status(500).json({error: "Error interno de servidor"})
    }
}

controller.findPostByUser = async (req, res) => {
    try {
        const { identifier } = req.params;

        const posts = await Post.find({ user : identifier, hidden: false});

        return res. status(200).json ({posts})

    } catch (error) {
        debug({error})
        return res.status(500).json({error: "Error interno de servidor"})
    }

}




controller.findOneById = async (req, res) =>{
    try {

      const {identifier} = req.params;
      const post = await Post.findOne({_id: indentifier , hidden : false});

      if(!post){
        return res.status(404).json({error: "Post no encontrado"});
      }
      return res.status(200).json ({ post })
        
    } catch (error) {
        debug({error})
        return res.status(500).json({error: "Error interno de servidor"})
    }
}

module.exports = controller;