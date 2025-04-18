const express = require('express');
const router = express.Router();
const { getSession } = require('../utils/sessionStore');

const menuItems = {
  2: { name: "Jollof Rice", price: 1500 },
  3: { name: "Fried Rice", price: 1500 },
  4: { name: "Chicken", price: 1200 },
  5: { name: "Beef", price: 1000 },
  6: { name: "Coke", price: 500 },
  7: { name: "Water", price: 300 }
};

const timeSlots = {
  1: "🚀 Immediate Delivery",
  2: "🕛 12:00 PM",
  3: "🕒 3:00 PM",
  4: "🌆 6:00 PM",
  5: "🌙 9:00 PM"
};

router.post('/', (req, res) => {
  const { sessionId, message } = req.body;
  const session = getSession(sessionId);
  const response = [];
  const items = [];
  const time = [];

  if (!message || message.trim() === '') {
    response.push("Welcome! Please choose an option: \n1 - Place order \n99 - Checkout \n98 - Order history \n97 - Current order \n0 - Cancel order");
    return res.json({ messages: response });
  }

  // If user is in time selection mode
  if (session.awaitingTimeSelection) {
    if (timeSlots[message]) {
      session.scheduledTime = timeSlots[message];
      session.awaitingTimeSelection = false;
      const total = session.currentOrder.reduce((sum, item) => sum + item.price, 0);
      response.push(`Order scheduled for ${session.scheduledTime}. \n Your total is ₦${total}. \nClick "Pay Now" to complete payment.`);

      return res.json({ 
        messages: response,
        paymentRequired: true,
        amount: total * 100,
        email: "test@example.com",
        sessionId
      });
    } else {
      response.push("Invalid option. Please select a time slot:");
      for (const key in timeSlots) {
        time.push(`${key} - ${timeSlots[key]}`)
      }
      response.push(time.join('\n'))
      return res.json({ messages: response });
    }
  }
  
  switch (message) {
   
    case "1":
      for (const key in menuItems) {        
        items.push(`${key}: ${menuItems[key].name} - ₦${menuItems[key].price}`)
        
      }
      response.push(`Select an item number to add to your order: \n ${items.join('\n')}`);
      break;

    case "99":
      if (session.currentOrder.length) {
        session.awaitingTimeSelection = true;
        for (const key in timeSlots) {
          time.push(`${key} - ${timeSlots[key]}`)
        }
        response.push(`Please select a time slot for your order: \n${time.join('\n')}`);
      } else {
        response.push("No order to place.");
      }
      break;

    case "98":
      if (session.orderHistory.length) {
        response.push("Your Order History:");
        session.orderHistory.forEach((order, idx) => {
          response.push(`Your Order History: \n Order ${idx + 1}: ${order.items.map(i => i.name).join(", ")} at ${order.time}`);
        });
      } else {
        response.push("No order history found.");
      }
      break;

    case "97":
      if (session.currentOrder.length) {
        response.push(`Current Order: \n ${session.currentOrder.map(i => i.name).join(", \n")}`);
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
        response.push(`${session.currentOrder.map(i => i.name).join(", \n")} \n Press 99 to cheeckout or keep adding to your order`)
      } else {
        response.push("Invalid option. Please choose: \n 1 - Place order \n 99 - Checkout \n 98 - Order history \n 97 - Current order \n 0 - Cancel order");
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
