const listing = require("./models/listing.js");
const review = require("./models/review.js");
module.exports.islogedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/users/login");
    }
    next();
}
module.exports.redirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isuserexits = (req,res,next)=>{
    if(req.user){
        return res.redirect("/listing");
    }
    next();
}
module.exports.isOwner = async(req,res,next) =>{
    let {id} =req.params;
    let list = await listing.findById(id);
    if(list.owner._id.equals(res.locals.curruser._id)){
        return next();
    }
    res.redirect("/listing");
}
module.exports.isreviewOwner = async(req,res,next) =>{
    let {id,reviewid} =req.params;
    let reviews = await review.findById(reviewid);
    if(reviews.reviewowner._id.equals(res.locals.curruser._id)){
        return next();
    }
    res.redirect(`/listing/${id}`);
}