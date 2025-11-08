const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./models/Admin");

async function createAdmin() {
  try {
    await mongoose.connect("mongodb://localhost:27017/admindata");

    const username = "admin";
    const password = "admin@123";

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists.");
      return mongoose.connection.close();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    console.log("admin created successfully!!");
    console.log("Username:", username);
    console.log("Password", password);

    mongoose.connection.close();
  } catch (error) {
    console.log("error creating admin", error);
  }
}

createAdmin();
