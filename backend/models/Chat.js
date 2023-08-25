const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  user: { type: String, required: true }, // 'user' or 'bot'
  message: { type: String, required: true,default:"undefined" },
  timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
