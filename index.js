if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodoverrider = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const listings = require("./router/listing.js");
const reviews = require("./router/review.js");


app.use(express.static(path.join(__dirname, "public")));
app.use(methodoverrider("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.engine("ejs", ejsMate);

async function main() {
  await mongoose.connect(process.env.ATLASURL);
}
main()
  .then(() => {
    console.log("databse is connected");
  })
  .catch((err,next) => {
    next(err);
  });

app.get("/", (req, res) => {
  res.render("listing/home");
});




app.use("/listing",listings);
app.use("/listing/:id/review",reviews)



app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page Not Found"));
});
app.use((err, req, res, next) => {
  const { statuscode = 500, message = "Something Went Wrong" } = err;
  console.log(err);
  res
    .status(statuscode)
    .render("listing/error.ejs", { status: statuscode, message: message });
});
app.listen(3000, () => {
  console.log("server is running");
});
