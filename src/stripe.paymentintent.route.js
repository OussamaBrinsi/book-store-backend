// Stripe PaymentIntent endpoint for classic card payments
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not set in environment variables. Please add it to your .env file."
  );
}
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/stripe/create-payment-intent
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;
    if (!amount) {
      return res.status(400).json({ error: "Missing amount" });
    }
    // Stripe expects amount in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
