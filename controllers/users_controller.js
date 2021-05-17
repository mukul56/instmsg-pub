const User = require('../models/user');
const Posts = require('../models/post');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req,res){

    User.findById(req.params.id, function(err,user){
        return res.render('user_profile',{
            title : 'User Profile',
            profile_user : user
        })
    })
};


// module.exports.updateProfile = function(req,res){
    
//     if(req.user.id == req.params.id){
    
//         User.findByIdAndUpdate(req.params.id ,req.body ,function(err,user){
//             if(err){
//                 console.log("error in updating user Profile");
//                 return('/');
//             }

//             return res.redirect('back');
//         })
//     }else{
//         res.status(401).send('Unauthorized');
//     }
// }

module.exports.updateProfile = async function(req,res){
    
    try {
        if(req.user.id == req.params.id){
           // let user = await User.findByIdAndUpdate(req.params.id ,req.body);
            let user = await User.findById(req.params.id);


            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log("Multer error",err);
                    return;
                }
                

                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    if(user.avatar){
                        if(fs.existsSync(path.join(__dirname,'..',user.avatar))){
                            fs.unlinkSync(path.join(__dirname, '..' , user.avatar));
                        }
                    }

                    // this is saving the path of uploaded image into avatar path in user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                
                //console.log(req.file);
               // console.log(user);
                user.save();

                //console.log(req.file);

            });
           res.redirect('back');
        }else{
            res.status(401).send('Unauthorized');
        }
    } catch (error) {
        console.log('Error',error);
    }

}




// module.exports.userHome = function(req,res){

//     // Posts.find({},function(err,posts){
//     //     return res.render('userHome',{
//     //         title : 'Home',
//     //         posts : posts
//     //     });
//     // })

//     //Populate user of each post


//     if(req.isAuthenticated()){
//         Posts.find({}).populate('user')
//         .populate({
//             path : 'comments',
//             populate : {
//                 path : 'user'
//             }
//         })
//         .exec(function(err,posts){

//             User.find({},function(err,user){
//                 if(err){
//                     console.log("Error in fiding all users");
//                     res.redirect('back');
//                 }

//                 return res.render('userHome',{
//                     title : 'Home',
//                     posts : posts,
//                     users : user
//                 })

//             });
//         });
//     }else{
//         return res.redirect('/');
//     }

// };




module.exports.userHome = async function(req,res){


    // to catch err use try catch

    try {

        let posts = await Posts.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path : 'comments',
            populate : {
                path : 'user'
            }
        });

        let users = await User.find({});

        let userFriends = await User.findById(req.user.id)
            .populate({
                path : 'friends',
                populate : {
                    path : 'to_user',
                }
            })
        //console.log(userFriends.friends);

        return res.render('userHome',{
            title : 'Home',
            posts : posts,
            users : users,
            friends : userFriends.friends
        });


    }catch(error){
        console.log('Error', error);
        return;
    }
};



module.exports.post = function(req,res){
    return res.render('posts',{
        title : "posts"
    });
}; 


module.exports.signup = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect('userHome');
    }

    return res.render('user_sign_up',{
        title:"InstMsg : Sign Up"
    });
};

module.exports.signin = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('userHome');
    }
 
    return res.render('user_sign_in',{
        title : "InstMsg : Sign In"
    });
};


//Get the signup data
// module.exports.create = function(req,res){

//     if(req.body.password != req.body.confirm_password){
//         return res.redirect('userHome');
//         // or res.redirect('back);
//     }

//     User.findOne({email : req.body.email},function(err,user){
//         if(err){
//             console.log("error in finding user");
//             return;
//         }

//         if(!user){
//             User.create(req.body , function(err,user){
//                 if(err){
//                     console.log("error in creating user");
//                     return;
//                 }

//                 return res.redirect('signin');
//             })
//         }else{
//             return res.redirect('signup');
//         }

//     })

// };


module.exports.create = async function(req,res){
    try {

        if(req.body.password != req.body.confirm_password){
            req.flash('error','Wrong Password');
            return res.redirect('back');
            // or res.redirect('back);
        }
    
        let users =  await User.findOne({email : req.body.email});
        
        if(!users){
            let createUser = await User.create(req.body);
            return res.redirect('signin');
        }else{
            req.flash('error','User Already Exists with Email id');
            return res.redirect('signin');
        }
    } catch (error) {
        console.log("Error",error);
    }




};

module.exports.getAllUsers = function(req,res){
    User.find({},function(err,user){
        if(err){
            console.log("Error in fiding all users");
            res.redirect('back');
        }
        console.log("Users fetched");
        return res.render('userHome',{
            users : user
        });
    });
}


// //Get the singin data          
// module.exports.createSession = function(req,res){
    
//     //find the user
//     User.findOne({email : req.body.email},function(err,user){

//         if(err){
//             console.log("error in finding user in sing in");
//             return;
//         }
  

//     //handle user found

//     if(user){
//           // handle password which not match

//           if(user.password != req.body.password){
//               return res.redirect('back');
//           }

//         // handle session creation
//           res.cookie('user_id',user.id);
//           return res.redirect('profile');


//     }else{
//         // handle user not found
//         return res.redirect('back');
//     }


// });
// };

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    
    req.flash('success','Logged in Successfully');
    return res.redirect('userHome');
}

module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','You Have Logged Out');
    return res.redirect('/');
}