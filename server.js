const express = require('express');
const path = require('path');
const dotenv = require('dotenv')
dotenv.config();
const chatRoutes = require('./routes/chat');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/chat', chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});