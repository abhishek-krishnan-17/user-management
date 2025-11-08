const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/connection");
const { ensureAdmin } = require("../middleware/auth");

router.get("/",ensureAdmin, async (req, res) => {
  const q = req.query.q || "";
  const filter = q
    ? {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(filter).sort({ createdAt: -1 }).lean();
  res.render("admin-users", { users, q });
});

router.get("/new",ensureAdmin, (req, res) => {
  res.render("admin-user-form", { action: "/admin/users", method: "post" });
});

router.post("/",ensureAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.render("admin-user-form", {
        error: "all fields are required!!",
        action: "/admin/users",
        method: "post",
      });
    }
    const existed = await User.findOne({ email });
    if (existed) {
      return res.render("admin-user-form", {
        error: "email alredy exists",
        action: "/admin/users",
        method: "post",
      });
    }
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });
    res.redirect("/admin/users");
  } catch (error) {
    console.error(error);
    res.render("admin-user-form", {
      error: "server error",
      action: "/admin/users",
      method: "post",
    });
  }
});

router.get("/:id/edit", ensureAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.redirect("/admin/users");
  }
  res.render("admin-user-form", {
    user,
    action: `/admin/users/${user._id}?_method=PUT`,
    method: "post",
  });
});

router.put("/:id",ensureAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const update = { name, email };
    if (password && password.length >= 6) {
      update.password = await bcrypt.hash(password, 10);
    }
    await User.findByIdAndUpdate(req.params.id, update);
    res.redirect("/admin/users");
  } catch (error) {
    console.error(error);
    res.redirect("/admin/users");
  }
});

router.delete("/:id",ensureAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin/users");
  } catch (error) {
    console.error(error);
    res.redirect("/admin/users");
  }
});

module.exports = router;
