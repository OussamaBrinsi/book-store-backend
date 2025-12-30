const mongoose = require("mongoose");
const User = require("./src/users/user.model");

require("dotenv").config();
const MONGO_URI = process.env.DB_URL || "mongodb://localhost:27017/book-store";

async function createAdmin() {
  await mongoose.connect(MONGO_URI);
  const email = "brinsioussama31@gmail.com";
  const password = "oussama123";
  const role = "admin";

  // Remove any existing admin with this email
  await User.deleteMany({ email, role });

  const admin = new User({ email, password, role });
  await admin.save();
  console.log("Admin user created:", email);
  await mongoose.disconnect();
}

createAdmin().catch((e) => {
  console.error(e);
  process.exit(1);
});
