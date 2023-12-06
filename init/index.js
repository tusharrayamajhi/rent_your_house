const mongoose = require("mongoose");
const initdata = require("./init");
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/hotel")
}
main().then(()=>{
    console.log("connected sucessfully")
})
.catch((err)=>{
    console.log(err)
})
const listingSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    image:{
        type:String,
        default:"https://th.bing.com/th/id/R.7dc80bd5f866a35b4ce60d354f797713?rik=%2bSMDTrcL2GeyMA&riu=http%3a%2f%2fwww.thewowstyle.com%2fwp-content%2fuploads%2f2015%2f04%2ffree-wallpaper-1.jpg&ehk=M5d0t7IokzrTOrzGdVmt11LDcnO9BWFSwwm4Gx8ttmE%3d&risl=1&pid=ImgRaw&r=0",
        set:(v) => v === ""?"https://th.bing.com/th/id/R.7dc80bd5f866a35b4ce60d354f797713?rik=%2bSMDTrcL2GeyMA&riu=http%3a%2f%2fwww.thewowstyle.com%2fwp-content%2fuploads%2f2015%2f04%2ffree-wallpaper-1.jpg&ehk=M5d0t7IokzrTOrzGdVmt11LDcnO9BWFSwwm4Gx8ttmE%3d&risl=1&pid=ImgRaw&r=0":v,
    },
    price:{
        type:Number,
    },
    location:String,
    country:String
})
const listing = mongoose.model("listing",listingSchema);
const insert = async ()=>{
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
}
insert()
