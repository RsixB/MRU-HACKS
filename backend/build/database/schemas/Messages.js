import mongoose from "mongoose";
export const MessageSchema = new mongoose.Schema({
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
}, { timestamps: true });
