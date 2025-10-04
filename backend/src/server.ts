import http from "node:http";
import { createApp } from "./createApp.ts";

const PORT = process.env.PORT || 3000;

(async () => {
  const app = await createApp()
  if(!app) return
  app.listen(PORT, () => {
    console.log(`listening on PORT:${PORT}`)
  })
})()