import mongoose from "mongoose";
import type { UserType } from "../../types/types.ts";
export const userSchema = new mongoose.Schema<UserType>({
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
})