const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const { NlpManager } = require('node-nlp');
const fs = require('fs'); // Import the File System module

// Load the JSON dataset
const dataset = require('./dataSet/Intent.json'); // Replace with the actual path


const app = express();
const port = 4000;
app.use(express.json());

const Chat=require('./models/Chat')

const User=require('./models/User')
// Connect to MongoDB
const dbURI = "mongodb://localhost/chatBot";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Create a user schema and model



const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});


app.use(express.json());





// Assuming you have a route for fetching chats
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, "secret-key");
    const userId = payload.userId;
    console.log("token is ", userId);

    // Find the user by ID
    const user = await User.findById(userId);
    console.log("token is ", user);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Convert image data to base64 string
    const base64Image = user.image.data.toString("base64");

    // Create a modified user object with the encoded image
    const modifiedUser = {
      ...user._doc,
      image: {
        data: base64Image,
        contentType: user.image.contentType,
      },
    };

    req.user = modifiedUser;
    next();
  } catch (error) {
    console.log("errrrrr");
    res.status(401).json({ error: "Unauthorized" });
  }
};









// Train the NlpManager with sample intents
/*
manager.addDocument('en', 'How are you feeling today?', 'greeting');
manager.addDocument('en', 'I need someone to talk to.', 'support');
manager.addDocument('en', 'Can you recommend a therapist?', 'support');
manager.addDocument('en', 'Tell me more about mental health.', 'information');
manager.addDocument('en', 'hi', 'greeting'); 
manager.train();

manager.addAnswer('en', 'greeting', 'Hello! How can I help you today?');
manager.addAnswer('en', 'support', "I'm here to support you. How can I assist you?");
*/
const manager = new NlpManager({ languages: ['en'] });
for (const intentData of dataset.intents) {
  const intent = intentData.intent;
  const text = intentData.text;
  const responses = intentData.responses;

  for (const trainingText of text) {
    manager.addDocument('en', trainingText, intent);
  }

  const randomResponseIndex = Math.floor(Math.random() * responses.length);
  const randomResponse = responses[randomResponseIndex];
  
  manager.addAnswer('en', intent, randomResponse); // Add a random response
}
// Train the manager
manager.train();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
let connectedUsers=0;

io.on('connection', (socket) => {
  connectedUsers++;
  console.log('New client connected');
  console.log('Total connected users:', connectedUsers);


  io.emit('userCount', connectedUsers);

  // Handle incoming chat messages
  socket.on('message', async (data) => {
    console.log('Received chat message',data);

    try {
      // Save the message to the database
 
      const userMessage = new Chat({ user: 'user', message: data });
    await userMessage.save();

    // Process the message and generate a response
    const response = await manager.process('en', data);
    
    // Save the bot's response to the database
    const botMessage = new Chat({ user: 'bot', message: response.answer });
    await botMessage.save();
    console.log(response)

    socket.emit('message', { intent: response.intent, message: response.answer });
    } catch (error) {
      console.log('Error saving chat message:', error);
    }
  });
  



  // Handle disconnection
  socket.on('disconnect', () => {
    connectedUsers--;
    console.log('Client disconnected');
    console.log('Total connected users:', connectedUsers);

    // Broadcast the updated user count to all connected clients
    io.emit('userCount', connectedUsers);
  });
});





// Handle user registration
app.post('/signup', upload.single('image'), async (req, res) => {
  const { name, email, password } = req.body;
  const { originalname, mimetype, buffer } = req.file;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email }).maxTimeMS(30000);
    if (existingUser) {
      return res.status(400).send('Email already registered.');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      image: {
        data: buffer,
        contentType: mimetype
      },
    });

    await newUser.save();
  
    const token = jwt.sign({ userId: newUser._id }, "secret-key");
    res.setHeader("Authorization", token);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user.');
  }
  

});







app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email }).maxTimeMS(30000);
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the password

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, "secret-key");

    // Set the token in the response header
    
    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});


app.get("/previousChat", authenticate, async (req, res) => {
  try {
    const userId = req.user._id; // Get the user's ID from the authenticated request

    // Fetch chats where userId matches the authenticated user's ID
    const chats = await Chat.find({ user: userId });

    res.status(200).json({ chats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});