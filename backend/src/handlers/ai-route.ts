import type { Request, Response, NextFunction} from "express-serve-static-core";
import fs from "fs/promises";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export const getResults = async (req: Request, res: Response) => {
  try {
    const filePath = "../../prompt.txt";
    const message = await fs.readFile(filePath, "utf-8");

    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "user", content: message }
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
