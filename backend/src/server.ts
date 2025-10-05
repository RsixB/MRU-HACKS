import http from "node:http";
import { createApp } from "./createApp.ts";
import { connectMongo } from "./database/connect-mongo.ts";
import { Server } from "socket.io"
const PORT = process.env.PORT || 3000;
import type { WebSocketStore } from "./types/types.ts";
//i'll change this to redis later

export let usernamesAndSockets: WebSocketStore = {} ;

const app =  createApp()

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.on("connection", async (socket) => {
  try{
    const username = socket.handshake.query.username
    usernamesAndSockets[`${username}`] = socket.id
    socket.on("disconnect", () => {
      delete usernamesAndSockets[`${username}`]
      console.log("user disconnected from socket")
    })
    console.log(usernamesAndSockets)
  } catch (e) {

  }
});


(async() => {
 try {
    const connected = await connectMongo()
    if (!connected) throw new Error()
    server.listen(3000, "0.0.0.0", () => {
      console.log(`yea PORT:${PORT}`)
    });      
 } catch(e) {
  console.error("server error")
 }  
})()