const mongoose = require('mongoose');

const LikesSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId
    },
    //Defines object id of the liked object
    Likable : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        refPath : 'onModel'
    },

    // this field is used for defining the type of the liked object since this is a dynamic referenced
    onModel : {
        type : String,
        required : true,
        enum : ['Post','Comment']
    }
},{
    timestamps : true
});

const Like = mongoose.model('Like',LikesSchema);
module.exports = Like;