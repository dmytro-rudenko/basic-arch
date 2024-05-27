const udp = require("dgram");

// creating a client socket
const client = udp.createSocket("udp4");

//buffer msg
const data = Buffer.from("pctea");

client.on("message", function (msg, info) {
  console.log("Data received from server : " + msg.toString());
  console.log(
    "Received %d bytes from %s:%d\n",
    msg.length,
    info.address,
    info.port
  );
});

//sending msg
client.send(data, 8080, "localhost", function (error) {
  if (error) {
    client.close();
  } else {
    console.log("Data sent");
  }
});

const data1 = Buffer.from("hello");
const data2 = Buffer.from("world");

//sending multiple msg
client.send([data1, data2], 8080, "localhost", function (error) {
  if (error) {
    client.close();
  } else {
    console.log("Data sent");
  }
});
