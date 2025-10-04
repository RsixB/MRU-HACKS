import mongoose from "mongoose";
import { userSchema } from "../schemas/Users.js";
export const UserModel = mongoose.model("Users", userSchema);
