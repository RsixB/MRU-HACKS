import expess from "express"
import bodyParser from "body-parser";
import { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/auth-routes.ts"
import generalRoutes from "./routes/general-routes.ts"
import AIRoutes from './routes/ai-routes.ts'
export const createApp = ():Application => {

    const app = expess();

    app.use(bodyParser.json())

    app.use(cors())

    //routes
    app.use("/api", authRoutes)
    app.use("/api", generalRoutes)
    app.use("/api", AIRoutes)
    return app
}