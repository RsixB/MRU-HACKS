var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs/promises";
import OpenAI from "openai";
import { UserModel } from "../database/models/Users.js";
import { MessageModel } from "../database/models/Messages.js";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export const getResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const filePath = "../../prompt.txt";
        const message = yield fs.readFile(filePath, "utf-8");
        const { username } = req.body;
        if (!username)
            throw new Error();
        const findUserId = yield UserModel.findOne({
            username,
        });
        if (!findUserId)
            throw new Error();
        const allMessages = yield MessageModel.find({
            $or: [
                {
                    fromID: req.user.id,
                    toID: findUserId.id
                },
                {
                    fromID: findUserId.id,
                    toID: req.user.id
                }
            ]
        }).sort({ createdAt: -1 });
        let returnArray = [];
        for (let i = 0; i < allMessages.length; i++) {
            let temp = allMessages[i].fromID === req.user.id ? req.user.username : username;
            let messagePush = {
                username: temp,
                message: allMessages[i].message,
                createdAt: allMessages[i].createdAt
            };
            returnArray.push(messagePush);
        }
        const finalMessage = `${message}\n${returnArray}`;
        const completion = yield openai.chat.completions.create({
            model: "gpt-5",
            messages: [
                { role: "user", content: finalMessage }
            ],
        });
        const responseText = ((_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "";
        return res.send({
            err: false,
            gptResponse: responseText
        });
    }
    catch (e) {
        console.error(e);
        return res.status(500).send({
            err: true,
            message: "Failed to get results",
        });
    }
});
