import mongoose from "mongoose";
import { userSchema } from "../schemas/Users.ts";
import { UserType } from "../../types/types.ts";
export const UserModel = mongoose.model<UserType>("Users", userSchema);
