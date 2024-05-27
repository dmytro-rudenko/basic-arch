// peer-node.js;
const WebSocket = require("ws");
const Peer = require("simple-peer");
const wrtc = require("wrtc");

const { v4: uuidv4 } = require("uuid");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ws = new WebSocket("ws://localhost:3000");

ws.on("open", () => {
  const peers = {};
  const id = uuidv4(); // Unique ID for each peer

  ws.send(JSON.stringify({ type: "new-peer", id }));

  ws.on("message", (message) => {;
    const data = JSON.parse(message);

    // if (data.id === id) {
    //   // Ignore messages sent from this peer
    //   console.log("Ignoring message from self");
    //   return;
    // }

    if (data.type === "signal") {
      if (!peers[data.id]) {
        createPeer(data.id, false);
      }
      peers[data.id].signal(data.signal);
    } else if (data.type === "new-peer") {
      if (!peers[data.id]) {
        createPeer(data.id, true);
      }
    }
  });

  function createPeer(peerId, initiator) {
    const peer = new Peer({ initiator, wrtc, trickle: false });

    peer.on("signal", async (signal) => {
      ws.send(JSON.stringify({ type: "signal", id: peerId, signal, from: id }));
    });

    peer.on("connect", () => {
      console.log(`Connected to peer: ${peerId}`);
      peer.send(`Hello from ${id}`);

      rl.on("line", (input) => {
        peer.send(input);
      });
    });

    peer.on("data", (data) => {
      console.log(`Received message from ${peerId}: ${data.toString()}`);
    });

    peer.on("error", (err) => {
      console.error(`Error with peer ${peerId}:`, err);
    });

    peers[peerId] = peer;
  }
})