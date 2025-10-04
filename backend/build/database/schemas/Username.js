import mongoose from "mongoose";
export const usernameSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
});
