import mongoose from "mongoose";
export const userSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    hash: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    profilePicture: {
        type: mongoose.Schema.Types.String,
        default: "",
    },
    friendList: {
        type: mongoose.Schema.Types.String,
        default: "",
    },
    pendingFriendRequest: {
        type: mongoose.Schema.Types.String,
        default: "",
    }
});
