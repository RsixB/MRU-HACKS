var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import http from "node:http";
import { createApp } from "./createApp.js";
import { connectMongo } from "./database/connect-mongo.js";
import { Server } from "socket.io";
const PORT = process.env.PORT || 3000;
//i'll change this to redis later
export let usernamesAndSockets = {};
const app = createApp();
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = socket.handshake.query.username;
        usernamesAndSockets[`${username}`] = socket.id;
        socket.on("disconnect", () => {
            delete usernamesAndSockets[`${username}`];
            console.log("user disconnected from socket");
        });
        console.log(usernamesAndSockets);
    }
    catch (e) {
    }
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connected = yield connectMongo();
        if (!connected)
            throw new Error();
        server.listen(3000, "0.0.0.0", () => {
            console.log(`yea PORT:${PORT}`);
        });
    }
    catch (e) {
        console.error("server error");
    }
}))();
