import expess from "express"
import bodyParser from "body-parser";
import { Application } from "express";
import cors from "cors";
import { connectMongo } from "./database/connect-mongo.ts";
import authRoutes from "./routes/auth-routes.ts"
import generalRoutes from "./routes/general-routes.ts"


export const createApp = async (): Promise<Application | null> => {
  try {

    const connected = await connectMongo()
    if (!connected) throw new Error()
    const app = expess();

    app.use(bodyParser.json())
    app.use(cors())


    //routes
    app.use("/api", authRoutes)
    app.use("/api", generalRoutes)
    //gotta add ai api route
    return app
  } catch (e) {
    return null
  }
}