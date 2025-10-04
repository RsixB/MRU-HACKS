import expess from "express"
import bodyParser from "body-parser";
import { Application } from "express";

import cors from "cors";
import authRoutes from "./routes/auth-routes.ts"
import { connectMongo } from "./database/connect-mongo.ts";

export const createApp = async (): Promise<Application | null> => {
  try {


    const connected = await connectMongo()
    if (!connected) throw new Error()
     
    const app = expess();


    app.use(bodyParser.json())
    
    app.use(cors())

    return app
  } catch (e) {
    return null
  }
}

//test is git working???