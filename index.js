const express = require("express");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://book-store-frontend-inky-kappa.vercel.app"
    ],
    credentials: true,
  })
);

// routes
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");

const adminRoutes = require("./src/stats/admin.stats");
const stripeRoutes = require("./src/stripe.route");
const stripePaymentIntentRoutes = require("./src/stripe.paymentintent.route");

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/stripe", stripePaymentIntentRoutes);

async function main() {
  await mongoose.connect(process.env.DB_URL);
}

main()
  .then(() => console.log("Mongodb connect successfully!"))
  .catch((err) => console.log(err));

// Place the catch-all route after all other routes
app.use("/", (req, res) => {
  res.send("Book Store Server is running!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
