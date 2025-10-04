import { MessageSchema } from "../schemas/Messages.ts";
import { MessageType } from "../../types/types.ts";
import mongoose from "mongoose";

export const MessageModel = mongoose.model<MessageType>("Messages", MessageSchema);
