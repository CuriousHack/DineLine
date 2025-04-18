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
  const senderDiv = document.createElement('span');
  const textDiv = document.createElement('p');
  messageDiv.classList.add('message');
  senderDiv.classList.add('sender')



  textDiv.innerText = text;
  senderDiv.innerText = sender;

  if (sender === 'You') {
    messageDiv.classList.add('sent');
  } else {
    messageDiv.classList.add('received');
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
  data.messages.forEach(msg => appendMessage('DineLine🍽️', msg));
}

window.onload = () => {
  fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message: '' })
  }).then(res => res.json())
    .then(data => {
      data.messages.forEach(msg => appendMessage('DineLine🍽️', msg));
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
    const messageDiv = appendMessage('DineLine🍽️', msg);

    if (data.paymentRequired) {
      const payButton = document.createElement('button');
      payButton.classList.add('pay-button');
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
      appendMessage("DineLine🍽️", "✅ Payment successful! Your order has been placed.");
      finalizeOrder(); // Store order in history
    },
    onClose: function() {
      appendMessage("DineLine🍽️", "Payment cancelled.");
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