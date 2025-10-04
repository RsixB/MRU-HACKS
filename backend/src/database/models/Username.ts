import { usernameSchema } from "../schemas/Username.ts";
import mongoose from "mongoose";

export const UsernameModel = mongoose.model("Usernames", usernameSchema);
