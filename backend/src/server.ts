import http from "node:http";
import { createApp } from "./createApp.ts";
const PORT = process.env.PORT || 3000;

(async () => {
  const app = await createApp()
  
  if (!app) return;
  const server = http.createServer(app);

  server.listen(3000, "0.0.0.0", () => {
    console.log(`yea PORT:${PORT}`)
  })
})()