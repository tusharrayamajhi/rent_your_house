const mongoose = require("mongoose");
const passportlocalmongoose = require("passport-local-mongoose");
const usersSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})

usersSchema.plugin(passportlocalmongoose);
const user = mongoose.model("user",usersSchema);
module.exports = user;