import mongoose, { mongo } from "mongoose";
import type { MessageType } from "../../types/types.ts";

export const MessageSchema = new mongoose.Schema<MessageType>({
  fromID: {
    type: mongoose.Schema.Types.String,
    required: true
  }, 
  toID: {
    type: mongoose.Schema.Types.String,
    required: true    
  },
  message: {
    type: mongoose.Schema.Types.String,
    required: true    
  }
}, { timestamps: true })