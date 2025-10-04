import type { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
  id: string; 
}

export interface FriendList {
  profilePicture: string,
  username: string
}

export interface MessageType {
  fromID: string
  toID: string
  message: string
  createdAt: Date;
  updatedAt: Date;
}
export interface UserType {
  username: string
  hash: string
  email: string
  profilePicture: string
  friendList: string
  pendingFriendRequest: string
}
export interface SendMessageType {
  toUsername: string,
  message: string
}

export type FriendLists = FriendList[]

export interface FriendListBar extends FriendList {
  lastMessage: string,
  timeSent: Date | null,
  name: string,
  notifications: number
}

export interface ChatMessage {
  username: string,
  message: string,
  createdAt: Date
}