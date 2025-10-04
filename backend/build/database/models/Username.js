import { usernameSchema } from "../schemas/Username.js";
import mongoose from "mongoose";
export const UsernameModel = mongoose.model("Usernames", usernameSchema);
