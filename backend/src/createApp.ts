import expess from "express"
import bodyParser from "body-parser";
import { Application } from "express";
import cors from "cors";
export const createApp = async (): Promise<Application | null> => {
  try {
    const app = expess();

    app.use(bodyParser.json())
    
    app.use(cors())

    return app
  } catch (e) {
    return null
  }
}