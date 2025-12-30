// Delete an order by ID (admin)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};
// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("products.book");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders", error);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};
const Order = require("./order.model");

const createAOrder = async (req, res) => {
  try {
    // Convert productIds (array of book ids) and cartItems (with quantity) to products [{book, quantity}]
    let products = [];
    if (req.body.cartItems && Array.isArray(req.body.cartItems)) {
      products = req.body.cartItems.map((item) => ({
        book: item._id,
        quantity: item.quantity || 1,
      }));
    } else if (req.body.productIds && Array.isArray(req.body.productIds)) {
      // fallback for old clients
      products = req.body.productIds.map((id) => ({ book: id, quantity: 1 }));
    }
    const orderData = {
      ...req.body,
      products,
    };
    delete orderData.productIds;
    delete orderData.cartItems;
    try {
      const newOrder = await Order(orderData);
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder);
    } catch (err) {
      console.error(
        "Order validation or save error:",
        err,
        "orderData:",
        orderData
      );
      return res.status(400).json({
        message: "Order validation failed",
        error: err.message,
        orderData,
      });
    }
  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

const getOrderByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ email })
      .sort({ createdAt: -1 })
      .populate("products.book");
    if (!orders) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

module.exports = {
  createAOrder,
  getOrderByEmail,
  getAllOrders,
  deleteOrder,
};
