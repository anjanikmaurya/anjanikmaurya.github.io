const express = require('express');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const openai = require('openai');
const app = express();

// Set up environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Configure OpenAI API client
const client = new openai.ApiClient({
  apiKey: OPENAI_API_KEY
});

// Create a new WebSocket server
const server = new WebSocket.Server({ port: 8080 });

// Handle new WebSocket connections
server.on('connection', (socket) => {
  console.log(`New WebSocket connection: ${socket}`);

  // Generate a unique session ID for each client
  const sessionId = uuidv4();

  // Send a welcome message to the client
  const message = {
    type: 'text',
    text: 'Welcome to the chatbot!'
  };
  socket.send(JSON.stringify(message));

  // Handle incoming messages from the client
  socket.on('message', async (data) => {
    console.log(`Received message: ${data}`);

    // Parse the incoming message as JSON
    const message = JSON.parse(data);

    // Send the message to OpenAI for processing
    const response = await client.completions.create({
      engine: 'davinci',
      prompt: message.text,
      maxTokens: 50
    });

    // Send the response back to the client
    const responseMessage = {
      type: 'text',
      text: response.choices[0].text
    };
    socket.send(JSON.stringify(responseMessage));
  });

  // Handle WebSocket connection errors
  socket.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
  });
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}...`);
});
