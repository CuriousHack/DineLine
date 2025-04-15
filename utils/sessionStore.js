// utils/sessionStore.js
const sessions = {};

const getSession = (sessionId) => {
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      currentOrder: [],
      orderHistory: []
    };
  }
  return sessions[sessionId];
};

module.exports = { getSession };