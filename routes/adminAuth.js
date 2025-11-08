const express = require("express");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("admin-login");
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.render("admin-login", { error: "all fields required" });
    }
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.render("admin-login", { error: "Invalid Credentials" });
    }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.render("admin-login", { error: "Invalid Credentials" });
    }
    req.session.admin = { id: admin._id, username: admin.username };
    res.render('dashboard')
  } catch (error) {
    console.log(error);
    res.render("admin-login", { error: "server error" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    res.redirect("/admin/login");
  });
});

router.get("/dashboard", (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  res.render("dashboard"); 
});

module.exports = router;
