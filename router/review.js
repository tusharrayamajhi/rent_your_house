const express = require("express");
const router = express.Router({mergeParams:true});
const { reviewSchema } = require("../Schemavalidate.js");
const ExpressError = require("../utils/expressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const review = require("../models/review.js");

const validreview = (err,req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    let errRevMsg = error.details.map((el)=>el.message);
    if(error){
      throw new ExpressError(400,errRevMsg);
    }else{
      next()
  }
  }
  




  router.post("/",validreview ,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let list = await listing.findById(id);
    let newReviews = new review({
        rating:req.body.rating,
        comment:req.body.comment
    })
    list.reviews.push(newReviews)
    await newReviews.save();
    await list.save();
    res.redirect(`/listing/${id}`);
}))
router.delete("/:reviewid",wrapAsync(async(req,res)=>{
    let {id,reviewid} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await review.findByIdAndDelete(reviewid);
    res.redirect(`/listing/${id}`);
  }))


  module.exports =router;