import http from "node:http";
import { createApp } from "./createApp.ts";
import { Server } from "socket.io"
const PORT = process.env.PORT || 3000;

(async () => {
  const app = await createApp()

  
  if (!app) return;
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  io.on("connection", (socket) => {
    console.log("connected to socket")



    socket.on("disconnect", () => {
      console.log("user disconnected")
    })


  })

  server.listen(3000, "0.0.0.0", () => {
    console.log(`yea PORT:${PORT}`)
  })
})()