const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        uniqure:true,
    },
    email:{
        type:String,
        required:true,
        uniqure:true,
    },
    password:{
        type:String,
        required:true,
    }
},{timestamp:true})

module.exports  = mongoose.model("User",UserSchema)

