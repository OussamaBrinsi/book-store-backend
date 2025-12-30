// Script to update all books in the database with a default Stripe Price ID if missing
require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const Book = require("./src/books/book.model");

const DEFAULT_STRIPE_PRICE_ID = "price_1234"; // Replace with your real Stripe Price ID

async function updateBooksWithStripePriceId() {
  await mongoose.connect(process.env.DB_URL);
  const books = await Book.find({
    $or: [
      { stripePriceId: { $exists: false } },
      { stripePriceId: null },
      { stripePriceId: "" },
    ],
  });
  for (const book of books) {
    book.stripePriceId = DEFAULT_STRIPE_PRICE_ID;
    await book.save();
    console.log(
      `Updated book: ${book.title} with Stripe Price ID: ${DEFAULT_STRIPE_PRICE_ID}`
    );
  }
  console.log("All books updated.");
  mongoose.disconnect();
}

updateBooksWithStripePriceId();
