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
const PORT = process.env.PORT || 3000;
(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = yield createApp();
    if (!app)
        return;
    const server = http.createServer(app);
    server.listen(3000, "0.0.0.0", () => {
        console.log(`yea PORT:${PORT}`);
    });
}))();
