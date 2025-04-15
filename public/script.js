const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sessionId = localStorage.getItem('sessionId') || generateSessionId();

function generateSessionId() {
  const id = '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('sessionId', id);
  return id;
}

function appendMessage(sender, text) {
  const message = document.createElement('div');
  message.innerText = `${sender}: ${text}`;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
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

// Initial bot message
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
