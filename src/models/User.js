const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username is required!'],
        minLength:[4,'Username must be atleast 4 characters long!']
    },
    address:{
        type:String,
        required:[true,'Address is required!'],
        maxLength:[20,'Address must be maximum 20 characters long!']
    },
    password:{
        type:String,
        required:[true,'Password is required!']
    },
    myPublications:[{
        type:mongoose.Schema.Types.ObjectId
    }]
});

const User = mongoose.model('User',userSchema);

module.exports = User;