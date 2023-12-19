const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const user = require("../models/user.js");
const {isuserexits,redirectUrl} = require("../middleware.js");
const passport = require("passport");

router.get("/signup", isuserexits, (req, res) => {
  res.render("users/signup.ejs");
});
router.get("/login", isuserexits, (req, res) => {
  res.render("users/login.ejs");
});
router.post(
  "/signup",
  isuserexits,
  wrapAsync(async (req, res) => {
    let userdata = new user({
      username: req.body.username,
      email: req.body.email,
    });
    let registeruser = await user.register(userdata, req.body.password);
    req.login(registeruser, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/users/login");
    });
  })
);
router.post(
  "/login",
  isuserexits,
  redirectUrl,
  passport.authenticate("local", { failureRedirect: "/users/login" }),
  async (req, res) => {
    let redirect = res.locals.redirectUrl || "/listing";
    res.redirect(redirect);
  }
);
router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/listing");
  });
});
module.exports = router;
