const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  user: { type: String, required: true }, // 'user' or 'bot'
  message: { type: String, required: true,default:"i am not trained for this " },
  timestamp: { type: Date, default: Date.now },
  intent: { type: String, required: true,default:"CustomResponse" },
  sender:{type:String}
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
