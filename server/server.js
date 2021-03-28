const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
// const https = require("https");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var count = 0;

var $ipsConnected = [];

io.on("connection", function (socket) {
  var $ipAddress = socket.request.connection.remoteAddress;

  if (!$ipsConnected.hasOwnProperty($ipAddress)) {
    $ipsConnected[$ipAddress] = 1;

    count++;

    socket.emit("counter", { count: count });
  }

  socket.on("disconnect", function () {
    if ($ipsConnected.hasOwnProperty($ipAddress)) {
      delete $ipsConnected[$ipAddress];

      count--;

      socket.emit("counter", { count: count });
    }
  });
});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log("Server is up on port - " + port);
});
