import { createServer } from "http";
import socketIO, { Socket } from "socket.io";

import { Board } from "johnny-five";
import { RaspiIO } from "raspi-io";

import { status, reboot, shutdown } from "./controllers/sys";
import { changeDirection, changeSpeed } from "./controllers/car";

// WebSockets
const server = createServer();
const io = socketIO(server);

// RaspberryPi
const board = new Board({ io: new RaspiIO(), repl: false });

// Running port
const PORT = 8000;

// SocketIO event handling
io.on("connection", (socket: Socket) => {
  setInterval(() => socket.emit("status", status()), 1000);
  socket.on("shutdown", shutdown);
  socket.on("reboot", reboot);
  socket.on("change-direction", changeDirection);
  socket.on("change-speed", changeSpeed);
});

// Listen to configured port
server.listen(PORT, () =>
  console.log(`Socket.IO Server running on port: ${PORT}`)
);
