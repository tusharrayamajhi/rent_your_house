const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    reviewowner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }
})
const review = mongoose.model("review",reviewSchema);
module.exports = review;