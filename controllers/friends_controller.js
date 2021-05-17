const User = require('../models/user');
const Friendship = require('../models/friendship');


module.exports.toggleFriend = async function(req,res){

    try{

        let user = await User.findById(req.user._id);
        let friend = await user.populate('friends');
               
        let newFriendShip = await Friendship.create({
            from_user : req.user.id,
            to_user : req.query.toid 
        });

        friend.friends.push(newFriendShip._id);
        friend.save();

        //console.log(newFriendShip._id);
        //console.log(newFriendShip);

        return res.json(200,{
            message : "success friendship created",
        })


    }catch(error){
        console.log(error);
        return res.json(500,{
            message : "Internal Servor error"
        })
    }
}

module.exports.removeFriend = async function(req,res){
    try {
        let user = await User.findById(req.user.id);
        let friend = await user.populate('friends');

        let currentFriendShip = await Friendship.findOne({
            from_user : req.user.id,
            to_user : req.params.id
        })

        if(currentFriendShip){
            friend.friends.pull(currentFriendShip._id);
            friend.save();

            currentFriendShip.remove();
        }

        return res.json(200,{
            message : "friendShip deleted"
        })


    } catch (error) {
        return res.json(500,{
            message : "Interal Servor error",
            data : {
                error : error
            }
        })
    }
}