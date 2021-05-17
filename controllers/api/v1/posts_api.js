const Posts = require('../../../models/post');
const Comment = require('../../../models/comment');
// Fetches all the posts from db
module.exports.index = async function(req,res){

    let posts = await Posts.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path : 'comments',
        populate : {
            path : 'user'
        }
    });


    return res.json(200 , {
        message : "List of posts",
        posts : posts
    })
};


// Deleting post of user
module.exports.destroy = async function(req,res){
    try {
        let post = await Posts.findById(req.params.id); 

        // .id means converting object id into string
        if(post.user = req.user.id){
            post.remove();
            let comment = await Comment.deleteMany({post : req.params.id});
            res.json(200,{
                message : "Post and associated comments deleted Successfully"
            });

          //  return res.redirect('back');
        }else{
            return res.json(401,{
                message : "You can not delete this post"
            })
        }
    } catch (error) {
        return res.json(500,{
            message : "Internal Server Error"
        })
    }
}