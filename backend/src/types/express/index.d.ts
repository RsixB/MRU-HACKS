import * as express from "express-serve-static-core";
import type { FriendLists } from "../types.ts";
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string
        email: string,
        username: string,
        profilePicture: string,
        friendList: FriendLists
        pendingFriendRequest: FriendLists
      }
    }
  }
}