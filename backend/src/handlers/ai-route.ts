import type { Request, Response, NextFunction} from "express-serve-static-core";
import fs from "fs/promises";
import OpenAI from "openai";

import { UserModel } from "../database/models/Users.ts";
import type { ChatMessage } from "../types/types.ts";
import { MessageModel } from "../database/models/Messages.ts";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export const getResults = async (req: Request, res: Response) => {
  try {
    const filePath = "../../prompt.txt";
    const message = await fs.readFile(filePath, "utf-8");
    const { username } = req.body;

    if(!username) throw new Error();
    const findUserId = await UserModel.findOne({
      username,
    })

    if(!findUserId) throw new Error();

    const allMessages = await MessageModel.find({
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
      
      let returnArray: ChatMessage[] = []

      for(let i = 0; i < allMessages.length; i++) {
        let temp = allMessages[i].fromID === req.user.id ? req.user.username : username;
        let messagePush: ChatMessage = {
          username: temp,
          message: allMessages[i].message,
          createdAt: allMessages[i].createdAt
        }
        returnArray.push(messagePush)
      }
    const finalMessage = `${message}\n${returnArray}`
    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [


{ role: "user", content: finalMessage }
      ],
    });
    const responseText = completion.choices[0]?.message?.content || "";

    return res.send({
      err: false,
      gptResponse: responseText
    });

  } catch (e) {
    console.error(e);
    return res.status(500).send({
      err: true,
      message: "Failed to get results",
    });
  }
};