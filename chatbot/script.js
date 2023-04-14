// Create a WebSocket connection to the server
const socket = new WebSocket("ws://localhost:8080");

// When the connection is established, send a welcome message
socket.addEventListener("open", () => {
  socket.send("Hello, ChatGPT!");
});

// When a message is received from the server, display it in the chat log
socket.addEventListener("message", (event) => {
  const message = event.data;
  const chatLog = document.getElementById("chat-log");
  const newMessage = document.createElement("div");
  newMessage.textContent = message;
  chatLog.appendChild(newMessage);
});

// When the user submits a message, send it to the server
const chatInput = document.getElementById("chat-input");
chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const message = chatInput.value;
    socket.send(message);
    chatInput.value = "";
  }
});
