// Stripe Checkout endpoints for book-store backend
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not set in environment variables. Please add it to your .env file."
  );
}
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/stripe/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { priceId, quantity = 1 } = req.body;
    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }
    const YOUR_DOMAIN = process.env.CLIENT_URL || "http://localhost:5173";
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      mode: "payment",
      return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
    });
    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stripe/session-status?session_id=...
router.get("/session-status", async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ error: "Missing session_id" });
    }
    const session = await stripe.checkout.sessions.retrieve(session_id);
    res.json({
      status: session.status,
      customer_email: session.customer_details?.email || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
