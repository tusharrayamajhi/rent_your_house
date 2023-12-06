const mongoose = require("mongoose");
const reviews = require("./review.js");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"https://th.bing.com/th/id/R.7dc80bd5f866a35b4ce60d354f797713?rik=%2bSMDTrcL2GeyMA&riu=http%3a%2f%2fwww.thewowstyle.com%2fwp-content%2fuploads%2f2015%2f04%2ffree-wallpaper-1.jpg&ehk=M5d0t7IokzrTOrzGdVmt11LDcnO9BWFSwwm4Gx8ttmE%3d&risl=1&pid=ImgRaw&r=0",
        set:(v) => v === ""?"https://th.bing.com/th/id/R.7dc80bd5f866a35b4ce60d354f797713?rik=%2bSMDTrcL2GeyMA&riu=http%3a%2f%2fwww.thewowstyle.com%2fwp-content%2fuploads%2f2015%2f04%2ffree-wallpaper-1.jpg&ehk=M5d0t7IokzrTOrzGdVmt11LDcnO9BWFSwwm4Gx8ttmE%3d&risl=1&pid=ImgRaw&r=0":v,
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"review"
    }]
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await reviews.deleteMany({_id:{$in:listing.reviews}})
    }
})

const listing = mongoose.model("listing",listingSchema);
module.exports = listing;