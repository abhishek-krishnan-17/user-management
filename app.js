const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const hbs = require("hbs");
const loginRoute = require("./routes/login");
const signupRoute = require("./routes/signup");
const homeRoute = require("./routes/home");
const adminRoute = require("./routes/adminAuth");
const adminUserRoute = require("./routes/adminUser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Register Handlebars helpers

hbs.registerHelper("increment", (value) => parseInt(value) + 1);
hbs.registerHelper("decrement", (value) => parseInt(value) - 1);
hbs.registerHelper("add", (a, b) => a + b);
hbs.registerHelper("subtract", (a, b) => a - b);
hbs.registerHelper("gt", (a, b) => a > b);
hbs.registerHelper("lt", (a, b) => a < b);
hbs.registerHelper("eq", (a, b) => a === b);

// Pagination helpers
hbs.registerHelper("pagination", (totalPages, currentPage) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push({ number: i, active: i === currentPage });
  }
  return pages;
});

hbs.registerHelper("range", (from, to) => {
  const range = [];
  for (let i = from; i <= to; i++) {
    range.push(i);
  }
  return range;
});

app.use(
  session({
    secret: "abhishek_17",
    resave: false,
    saveUninitialized: false,
  })
);

mongoose
  .connect("mongodb://127.0.0.1:27017/admindata")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Redirect root (/) to login page
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use("/", loginRoute);
app.use("/", signupRoute);
app.use("/", homeRoute);
app.use("/admin", adminRoute);
app.use("/admin/users", adminUserRoute);

// Handle 404 - Page Not Found
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found",
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("server running successfully");
});
