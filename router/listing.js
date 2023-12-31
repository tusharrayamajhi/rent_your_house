const express = require("express");
const router = express.Router();
const { listingSchema} = require("../Schemavalidate.js");

const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const {islogedin,isuserexits,redirectUrl, isOwner} = require("../middleware.js");

const validlisting = (err,req, res, next) => {
    let {error}= listingSchema.validate(req.body);
    let errmsg = error.details.map((el) => el.message);
    if (error) {
      throw new ExpressError(400, errmsg);
    } else {
      next();
    }
  };


router.get(
  "/",
  wrapAsync(async (req, res) => {
    const list = await listing.find({});
    res.render("listing/listing.ejs", { list });
  })
);
router.post(
  "/",
  islogedin,
  validlisting,
  wrapAsync(async (req, res, next) => {
    const { title, description, image, price, location, country } = req.body;
    const list = new listing({
      title: title,
      description: description,
      image: image,
      price: price,
      location: location,
      country: country,
      owner:req.user._id
    });
    await list.save();
    res.redirect("/listing");
  })
);
router.get("/new",islogedin,(req, res) => {
  res.render("listing/newlisting");
});
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await listing.findById(id).populate({path:"reviews",populate:{path:"reviewowner"}}).populate("owner");
    res.render("listing/show", { list });
  })
);
router.put(
  "/:id/edit",
  islogedin,isOwner,
  validlisting,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = req.body;
    await listing.findByIdAndUpdate(id, list);
    res.redirect(`/listing/${id}`);
  })
);
router.get(
  "/:id/edit",
  islogedin,isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    res.render("listing/edit.ejs", { list });
  })
);
router.delete(
  "/:id",
  islogedin,isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
  })
);

module.exports =router;