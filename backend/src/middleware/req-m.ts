import type { Request, Response, NextFunction} from "express-serve-static-core";
import { verifyToken } from "../utils/auth-jwt.ts";
import { UserModel } from "../database/models/Users.ts";
export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body
    if(!token) throw new Error();
    const verifiedID = verifyToken(token)
    if(!verifiedID) throw new Error();
    const user = await UserModel.findById(verifiedID);
    if(!user) throw new Error();
    req.user = {
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      id: user.id,
      friendList: JSON.parse(user.friendList),
      pendingFriendRequest: JSON.parse(user.pendingFriendRequest)
    }
    return next()
  } catch (e) {
    console.error("error happened here")
    return res.send({
      err: true
    })
  }
} 