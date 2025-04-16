const chatBox = document.getElementById('chat-box');

const userInput = document.getElementById('user-input');
const sessionId = localStorage.getItem('sessionId') || generateSessionId();

function generateSessionId() {
  const id = '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('sessionId', id);
  return id;
}

function appendMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  const senderDiv = document.createElement('div');
  const textDiv = document.createElement('div');

  senderDiv.classList.add('sender');
  textDiv.classList.add('text');

  textDiv.innerText = text;
  senderDiv.innerText = sender;

  if (sender === 'You') {
    messageDiv.classList.add('right');
  } else {
    messageDiv.classList.add('left');
  }

  messageDiv.appendChild(senderDiv);
  messageDiv.appendChild(textDiv);

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  return messageDiv;
}

async function sendMessage() {
  const message = userInput.value;
  if (!message) return;

  appendMessage('You', message);
  userInput.value = '';

  const res = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message })
  });

  const data = await res.json();
  data.messages.forEach(msg => appendMessage('Bot', msg));
}

window.onload = () => {
  fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message: '' })
  }).then(res => res.json())
    .then(data => {
      data.messages.forEach(msg => appendMessage('Bot', msg));
    });
};

async function sendMessage() {
  const message = userInput.value;
  if (!message) return;

  appendMessage('You', message);
  userInput.value = '';

  const res = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message })
  });

  const data = await res.json();
  data.messages.forEach((msg) => {
    const messageDiv = appendMessage('Bot', msg);

    if (data.paymentRequired) {
      const payButton = document.createElement('button');
      payButton.innerText = 'Pay Now';
      data.email = 'akandelateef0@gmail.com';
      payButton.onclick = () => payWithPaystack(data.amount, data.email);
      messageDiv.appendChild(payButton);
    }
  })
}

function payWithPaystack(amount, email) {
  var handler = PaystackPop.setup({
    key: 'pk_test_dcc0109f6861997db08f7fab25e57e71e94b4ddc', // replace with your public key
    email: email,
    amount: amount,
    currency: "NGN",
    callback: function(response) {
      appendMessage("Bot", "✅ Payment successful! Your order has been placed.");
      finalizeOrder(); // Store order in history
    },
    onClose: function() {
      appendMessage("Bot", "Payment cancelled.");
    }
  });
  handler.openIframe();
}

function finalizeOrder() {
  fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message: 'FINALIZE_ORDER' })
  });
}