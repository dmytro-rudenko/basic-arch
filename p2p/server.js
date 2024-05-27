// signaling-server.js
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("open", () => {
    console.log("Connected to signaling server");
  });

  ws.on("close", () => {
    console.log("Disconnected from signaling server");
  });

  ws.on("message", (message) => {
    console.log("received: %s", message);

    // Broadcast the message to all connected clients except the sender
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

console.log("Signaling server running on ws://localhost:8080");
