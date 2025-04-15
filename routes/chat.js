// routes/chat.js
const express = require('express');
const router = express.Router();
const { getSession } = require('../utils/sessionStore');

const menuItems = {
  1: "Jollof Rice",
  2: "Fried Rice",
  3: "Chicken",
  4: "Beef",
  5: "Coke",
  6: "Water"
};

router.post('/', (req, res) => {
  const { sessionId, message } = req.body;
  const session = getSession(sessionId);
  const response = [];

  switch (message) {
    case "1":
      response.push("Select an item number to add to your order:");
      for (const key in menuItems) {
        response.push(`${key}: ${menuItems[key]}`);
      }
      break;

    case "99":
      if (session.currentOrder.length) {
        session.orderHistory.push([...session.currentOrder]);
        session.currentOrder = [];
        response.push("Order placed successfully! ✅");
        response.push("Would you like to place a new order? Type 1.");
        // Here, you would normally initiate payment
      } else {
        response.push("No order to place.");
      }
      break;

    case "98":
      if (session.orderHistory.length) {
        response.push("Your Order History:");
        session.orderHistory.forEach((order, idx) => {
          response.push(`Order ${idx + 1}: ${order.join(", ")}`);
        });
      } else {
        response.push("No order history found.");
      }
      break;

    case "97":
      if (session.currentOrder.length) {
        response.push("Current Order:");
        response.push(session.currentOrder.join(", "));
      } else {
        response.push("No current order.");
      }
      break;

    case "0":
      if (session.currentOrder.length) {
        session.currentOrder = [];
        response.push("Order cancelled.");
      } else {
        response.push("No order to cancel.");
      }
      break;

    default:
      // Check if message corresponds to a menu item
      if (menuItems[message]) {
        session.currentOrder.push(menuItems[message]);
        response.push(`${menuItems[message]} added to your order.`);
      } else {
        response.push("Invalid option. Please choose:");
        response.push("1 - Place order");
        response.push("99 - Checkout");
        response.push("98 - Order history");
        response.push("97 - Current order");
        response.push("0 - Cancel order");
      }
      break;
  }

  res.json({ messages: response });
});

module.exports = router;
