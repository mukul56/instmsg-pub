
const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./config/user_db');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 8000;

const env = require('./config/environment');

// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongodb-session')(session);
const sassMiddleware = require('node-sass-middleware');

//flash messages
const flash = require('connect-flash');
const customFlashware = require('./config/middleware');

//setting up chat server to be used with socket.io
const chatServer = require('http').createServer(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000,function(error){
    if(error){
        console.log(error);
    }
    console.log("chat server is listening on port 5000");

});

const path = require('path');

app.use(sassMiddleware({
    src: path.join(__dirname, env.assets_path,'scss'),
    dest : path.join(__dirname,env.assets_path,'css'),
    debug : true,
    outputStyle :'extended',
    prefix : '/css'
}));
app.use(express.urlencoded());

//use express router
app.use(cookieParser());

app.use(express.static(env.assets_path));

// make the path uploads available to browser so that it show images from uploads folder
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



// set up the view engine ejs
app.set('view engine','ejs');
app.set('views','./views');

// mongo store is used to store session cookie in db
app.use(session({
    name: 'instmsg',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store : new MongoStore({
        mongooseConnection : db,
        autoRemove :'disabled'
    },function(err){
        if(err){
            console.log("err in connect-mongoose")
        }
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customFlashware.setFlash);
app.use('/',require('./routes'));



app.listen(port,function(err){
    if(err){
        console.log(`Error in server : ${err}`);
        return;
    }

    console.log(`server running on port : ${port}`);
});