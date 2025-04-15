// routes/chat.js
const express = require('express');
const router = express.Router();
const { getSession } = require('../utils/sessionStore');

const menuItems = {
  1: { name: "Jollof Rice", price: 1500 },
  2: { name: "Fried Rice", price: 1500 },
  3: { name: "Chicken", price: 1200 },
  4: { name: "Beef", price: 1000 },
  5: { name: "Coke", price: 500 },
  6: { name: "Water", price: 300 }
};

const timeSlots = {
  1: "12:00 PM",
  2: "3:00 PM",
  3: "6:00 PM",
  4: "9:00 PM"
};

router.post('/', (req, res) => {
  const { sessionId, message } = req.body;
  const session = getSession(sessionId);
  const response = [];

  // If user is in time selection mode
  if (session.awaitingTimeSelection) {
    if (timeSlots[message]) {
      session.scheduledTime = timeSlots[message];
      session.awaitingTimeSelection = false;
      const total = session.currentOrder.reduce((sum, item) => sum + item.price, 0);
      response.push(`Order scheduled for ${session.scheduledTime}.`);
      response.push(`Your total is ₦${total}. Click "Pay Now" to complete payment.`);

      return res.json({ 
        messages: response,
        paymentRequired: true,
        amount: total * 100, // kobo
        email: "test@example.com", // fake test email
        sessionId
      });
    } else {
      response.push("Invalid option. Please select a time slot:");
      for (const key in timeSlots) {
        response.push(`${key} - ${timeSlots[key]}`);
      }
      return res.json({ messages: response });
    }
  }

  switch (message) {
    case "1":
      response.push("Select an item number to add to your order:");
      for (const key in menuItems) {
        response.push(`${key}: ${menuItems[key].name} - ₦${menuItems[key].price}`);
      }
      break;

    case "99":
      if (session.currentOrder.length) {
        session.awaitingTimeSelection = true;
        response.push("Please select a time slot for your order:");
        for (const key in timeSlots) {
          response.push(`${key} - ${timeSlots[key]}`);
        }
      } else {
        response.push("No order to place.");
      }
      break;

    case "98":
      if (session.orderHistory.length) {
        response.push("Your Order History:");
        session.orderHistory.forEach((order, idx) => {
          response.push(`Order ${idx + 1}: ${order.items.map(i => i.name).join(", ")} at ${order.time}`);
        });
      } else {
        response.push("No order history found.");
      }
      break;

    case "97":
      if (session.currentOrder.length) {
        response.push("Current Order:");
        response.push(session.currentOrder.map(i => i.name).join(", "));
      } else {
        response.push("No current order.");
      }
      break;

    case "0":
      if (session.currentOrder.length) {
        session.currentOrder = [];
        session.scheduledTime = null;
        response.push("Order cancelled.");
      } else {
        response.push("No order to cancel.");
      }
      break;

    default:
      if (menuItems[message]) {
        session.currentOrder.push(menuItems[message]);
        response.push(`${menuItems[message].name} added to your order.`);
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

  if (message === 'FINALIZE_ORDER') {
    session.orderHistory.push({
      items: [...session.currentOrder],
      time: session.scheduledTime
    });
    session.currentOrder = [];
    session.scheduledTime = null;
    return res.json({ messages: [] });
  }

  res.json({ messages: response });
});

module.exports = router;
