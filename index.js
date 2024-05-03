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
const users = require("./router/users.js");
const session = require("express-session");
const user = require("./models/user.js");

const passportLocalStragity = require("passport-local");
const passport = require("passport");

app.use(express.static(path.join(__dirname, "public")));
app.use(methodoverrider("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.engine("ejs", ejsMate);

async function main() {
  // 'mongodb://127.0.0.1:27017/hotel'
  // `${process.env.ATLASURL}`
  await mongoose.connect(`${process.env.ATLASURL}`);
}
main()
  .then(() => {
    console.log("databse is connected");
  })
  .catch((err) => {
    console.log(err);
  });



app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocalStragity(user.authenticate()))
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{
  res.locals.curruser = req.user;
  next();
})
app.get("/", (req, res) => {
  res.render("listing/home");
});
app.use("/users", users);
app.use("/listing", listings);
app.use("/listing/:id/review", reviews);

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
