const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.toggleLike = async function(req,res){
    try {
        
        let likable;
        let deleted = false;


        if(req.query.type == 'Post'){
            console.log("Post type")
            likable = await Post.findById(req.query.id).populate('likes');
        }else{
            console.log("Comment type")
            likable = await Comment.findById(req.query.id).populate('likes');
        }
    
        console.log(likable);

        //check if like already exists

        let checkExistingLike = await Like.findOne({
            Likable : req.query.id,
            onModel : req.query.type,
            user : req.user._id
        })

        // if a like already existing delete it

     //   console.log(likable);
       // console.log(checkExistingLike);
        if(checkExistingLike){
            likable.likes.pull(checkExistingLike._id);

            likable.save();
            checkExistingLike.remove();

            deleted  = true;
        }else{
            let newLike = await Like.create({
                user : req.user._id,
                Likable : req.query.id, 
                onModel : req.query.type
            })

            likable.likes.push(newLike._id);
            likable.save(); 
        }

        return res.json(200,{
            message : "Request Successful",
            data : {
                deleted : deleted
            }
        })


    } catch (error) {
        if(error){
            console.log(error);
            return res.json(500,{
                message : "Internal Servor error"
            })
        }
    }
}

