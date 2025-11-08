const express = require("express");
const { ensureAuthenticated } = require("../middleware/auth");
const router = express.Router();

router.get("/home", ensureAuthenticated, (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("home", { user: req.session.user });
});

module.exports = router;
