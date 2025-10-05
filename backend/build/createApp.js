import expess from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/auth-routes.js";
import generalRoutes from "./routes/general-routes.js";
import AIRoutes from "./routes/ai-routes.js";
export const createApp = () => {
    const app = expess();
    app.use(bodyParser.json());
    app.use(cors());
    //routes
    app.use("/api", authRoutes);
    app.use("/api", generalRoutes);
    app.use("/api", AIRoutes);
    return app;
};
