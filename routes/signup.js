const express = require("express");
const router = express.Router();
const User = require("../models/connection");
const bcrypt = require("bcrypt");
const { ensureNotAuthenticated } = require("../middleware/auth");

router.get("/signup", ensureNotAuthenticated, (req, res) =>
  res.render("signup")
);
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password)
      return res.render("signup", {
        error: "All fields required",
        name,
        email,
      });
    if (password !== confirmPassword)
      return res.render("signup", {
        error: "Passwords don't match",
        name,
        email,
      });

    const existed = await User.findOne({ email });
    if (existed)
      return res.render("signup", { error: "Email already registered", name });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.render("signup", { error: "Server error" });
  }
});



module.exports = router;
