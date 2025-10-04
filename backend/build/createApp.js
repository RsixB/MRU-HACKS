var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import expess from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connectMongo } from "./database/connect-mongo.js";
import authRoutes from "./routes/auth-routes.js";
import generalRoutes from "./routes/general-routes.js";
export const createApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connected = yield connectMongo();
        if (!connected)
            throw new Error();
        const app = expess();
        app.use(bodyParser.json());
        app.use(cors());
        app.use("/api", authRoutes);
        app.use("/api", generalRoutes);
        return app;
    }
    catch (e) {
        return null;
    }
});
