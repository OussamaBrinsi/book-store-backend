const express = require("express");
const router = express.Router();
const {
  createAOrder,
  getOrderByEmail,
  getAllOrders,
  deleteOrder,
} = require("./order.controller");
// delete order by id (admin)
router.delete("/:id", deleteOrder);

// get all orders (admin)
router.get("/", getAllOrders);

// create order endpoint
router.post("/", createAOrder);

// get orders by user email
router.get("/email/:email", getOrderByEmail);

module.exports = router;
