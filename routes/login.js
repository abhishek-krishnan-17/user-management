const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/connection");
const { ensureNotAuthenticated } = require("../middleware/auth");

router.get("/login", ensureNotAuthenticated, (req, res) => res.render("login"));
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.render("login", { error: "All fields required", email });

    const user = await User.findOne({ email });
    if (!user)
      return res.render("login", { error: "Invalid credentials", email });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.render("login", { error: "Invalid credentials", email });

    // set session
    req.session.user = { id: user._id, name: user.name, email: user.email };
    res.redirect("/home");
  } catch (err) {
    console.error(err);
    res.render("login", { error: "Server error" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Session destroy error:", err);
      // Redirect to your existing 404 page
      return res.render("404");
    }

    // If no error, clear cookie and redirect normally
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});


module.exports = router;
