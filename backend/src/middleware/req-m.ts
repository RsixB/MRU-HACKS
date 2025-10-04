import type { Request, Response, NextFunction} from "express-serve-static-core";
import { verifyToken } from "../utils/auth-jwt.ts";
import { UserModel } from "../database/models/Users.ts";
export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //add to req.user
  } catch(e ) {

  }
} 