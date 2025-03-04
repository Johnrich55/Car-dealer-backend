import { createServer } from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
// import { port } from './config/config.js';
import { Server } from "socket.io";
import socketServer from "./sockets/socket.js";

const server = createServer(app);
socketServer(server);

connectDB().then(() => {
  server.listen(3000, () => {
    console.log(`Server running on port 2000`);
  });
});
