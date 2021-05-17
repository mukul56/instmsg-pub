const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'instmsg'
}

passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){
    User.findById(jwtPayLoad._id , function(err,user){
        if(err){
            console.log("Error in jwt");
            return;
        }

        if(user){
            return done(null,user); // (err,users)
        }else{
            return done(null,false); // false means user is not found
        }

    })
}));

module.exports = passport;
