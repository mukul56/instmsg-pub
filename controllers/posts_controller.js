const User = require('../models/user');
const Posts = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

// module.exports.createPost = function(req,res){

//     if(req.isAuthenticated()){
//         Posts.create( {content : req.body.content , user : req.user._id }  , function(err,user){

//             if(err){
//                 console.log("error in creating posts");
//                 return res.redirect('back');
//             }
//             return res.redirect('back');
//         });
//     }else{
//         console.log("user not valid");
//         return res.redirect('/');
//     }
// }


module.exports.createPost = async function(req,res){

    try {
        let posts = await Posts.create( {content : req.body.content , user : req.user._id });
        
        if(req.xhr){
            post = await posts.populate('user', 'name').execPopulate();


            return res.status(200).json({
                data : {
                    post : post
                },
                message : "Post Created"
            })
        }
        
        req.flash('success','Post publised!');

        return res.redirect('back');
    } catch (error) {
        console.log("Error",error);
    }
}



// module.exports.createComment = function(req,res){
//     Posts.findById(req.body.post , function(err,post){

//         if(err){
//             console.log("error in finding post");
//             return res.redirect('back');
//         }
//         if(post){
//             Comment.create({
//                 content : req.body.content,
//                 post : req.body.post,
//                 user : req.user._id
//             }, function(err,comment){
//                 // handle error

//                 if(err){
//                     console.log("error in creating comment");
//                     res.redirect('back');
//                 }
 
//                 post.comments.push(comment);
//                 post.save();


//                 res.redirect('back');
//             });
//         }else{
//             console.log("post is not valid");
//             res.redirect('back');
//         }
//     });
// }




module.exports.createComment = async function(req,res){
        
    try{
        let post= await Posts.findById(req.body.post);
        if(post){
            let comment =await Comment.create({
                content : req.body.content,
                post : req.body.post,
                user : req.user._id
            });
            
            post.comments.push(comment);
            post.save();

            if(req.xhr){

                comment = await comment.populate('user', 'name').execPopulate();
   

                return res.status(200).json({
                    data : {
                        comment : comment
                    },
                    message : "Comment Created"
                })
            }

            req.flash('success','Comment Posted');
            res.redirect('back');

        }else{
            console.log("post is not valid");
            res.redirect('back');
        }
    }catch(error){
        console.log("Error",error);
        return;
    }
}



// module.exports.destroy = function(req,res){
//     Posts.findById(req.params.id ,function(err,post){

//         // .id means converting object id into string
//         if(post.user = req.user.id){
//             post.remove();
//             Comment.deleteMany({post : req.params.id}, function(err){

//                 if(err){
//                     console.log("error in deleting posts");
//                 }

//                 console.log("Comments with post deleted");
//                 return res.redirect('back');
//             });
//         }else{
//             console.log("You are not allowed to delete post");
//             return res.redirect('back');
//         }

//     })
// }





// Deleting post of user
module.exports.destroy = async function(req,res){
    try {
        let post = await Posts.findById(req.params.id); 

        // .id means converting object id into string
        if(post.user = req.user.id){


            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

            post.remove();
            let comment = await Comment.deleteMany({post : req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data : {
                        post_id : req.params.id
                    },
                    message: "Post deleted"
                })
            }

            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    } catch (error) {
        console.log("Error",error);
        return;
    }
}



// Deleting Comment
module.exports.destroyComment = async function(req,res){

    try {
        
        let comment = await Comment.findById(req.params.id);
        if(comment){
            let post = await Posts.findByIdAndUpdate(comment.post,{$pull : {comments : req.params.id}});
            comment.remove();
            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            res.redirect('back');
        }else{
            console.log("Invalid Comment");
            res.redirect('back');
        }
    } catch (error) {
        console.log("Error",error);
        return;
    }
}


