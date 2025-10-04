import { MessageSchema } from "../schemas/Messages.js";
import mongoose from "mongoose";
export const MessageModel = mongoose.model("Messages", MessageSchema);
