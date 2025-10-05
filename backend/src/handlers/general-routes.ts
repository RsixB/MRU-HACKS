import { MessageModel } from "../database/models/Messages.ts";
import { UserModel } from "../database/models/Users.ts";
import type { Request, Response, NextFunction} from "express-serve-static-core";
import type { FriendLists, SendMessageType, FriendListBar, ChatMessage, FriendList } from "../types/types.ts";
import { io, usernamesAndSockets } from "../server.ts";

export const addFriend = async (req: Request, res: Response) => {
  try {
    const { username } = req.body
    if(!req.user || !username || username === req.user.username) throw new Error();
    const exists = await UserModel.findOne({
      username
    })
    
    const friendsAlready = req.user.friendList.find((user) => {return user.username === username});
    
    if (!exists || friendsAlready) throw new Error();
    const newList: FriendLists = [{
      username,
      profilePicture: exists.profilePicture
    }, ...req.user.friendList]
    const updated = await UserModel.findByIdAndUpdate(req.user.id, {
      $set: { 
        friendList: JSON.stringify(newList)
      }
    }, { new: true })
    if (!updated) throw new Error();

    const friendRequests: FriendLists = JSON.parse(exists.pendingFriendRequest)
    const updatedFriendRequests: FriendLists = [...friendRequests, {
      username: req.user.username,
      profilePicture: req.user.profilePicture
    }]

    const alreadyFriends: FriendLists = (JSON.parse(exists.friendList))
    let temp = alreadyFriends.find((u) => {
      return u.username === req.user.username
    })

    if(!temp){
      const sendRequest = await UserModel.findOneAndUpdate({
        username,      
      }, {
        pendingFriendRequest: JSON.stringify(updatedFriendRequests)
      })
      if(!sendRequest) throw new Error();
    }

    //ADD SOCKETS HERE
    //SOCKET.IO
    const isOnline = usernamesAndSockets[username]
  
    if(isOnline){
      io.to(isOnline).emit("friend-request", {
        newFriend: "YES"
      })
    }
  
    return res.send({
      newFriend: {
      username,
      profilePicture: exists.profilePicture
    },
      err: false
    })

  } catch (e) {
    console.error("error adding friend")
    return res.send({
      err: true
    })
  }
}

export const acceptRequest = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    if(!username) throw new Error()
    const pendingFriendRequests: FriendLists = req.user.pendingFriendRequest
    const removed = pendingFriendRequests.filter((u) => {
      return u.username !== username
    })
    const him = pendingFriendRequests.find((u) => {
      return u.username === username
    })
    if((removed.length === pendingFriendRequests.length) || !him) throw new Error();
    const updated = await UserModel.findByIdAndUpdate(req.user.id, {
      pendingFriendRequest: JSON.stringify(removed),
      friendList: JSON.stringify([him, ...req.user.friendList]),
    })
    if(!updated)throw new Error();
    return res.send({
      friendRequests: removed,
      err: false
    })
  } catch (e) {
    console.error("error accepting friend")
    return res.send({
      err: true
    })
  }
}

export const rejectRequest = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    if(!username) throw new Error()
    const pendingFriendRequests: FriendLists = req.user.pendingFriendRequest

    const removed = pendingFriendRequests.filter((u) => {
      return u.username !== username
    })
    if(!username || (removed.length === pendingFriendRequests.length)) {
      return res.send({
        err: true,
      })
    }

    const updated = await UserModel.findByIdAndUpdate(req.user.id, {
      pendingFriendRequest: JSON.stringify(removed)
    })
    if(!updated)throw new Error();

    return res.send({
      err: false,
      friendRequests: removed
    })

  } catch (e) {
    console.error("error accepting friend")
    return res.send({
      err: true

    })
  }
}


export const getPendingFriendRequest = async (req: Request, res: Response) => {
  try {
    const friendRequests = req.user.pendingFriendRequest
    return res.send({
      friendRequests,
      err: false
    })
  } catch (e) {
    return res.send({
      err: true
    })    
  }
}

export const findUserProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.body
    if(!username) throw new Error();
    const findUser = await UserModel.findOne({
      username
    })
    if(findUser){
      return res.send({
        user: {
          username: findUser.username,
          profilePicture: findUser.profilePicture
        }, 
        err: false
      })  
    } else {
      return res.send({
        user: null,
        err: false
      })      
    }
  } catch (e) {
    return res.send({
      err: true
    })    
  }
}

export const sendMessage = async (req: Request, res: Response) => {

  try {
    const messageToBeSent = req.body.content as SendMessageType | undefined
    if(!req.user || !messageToBeSent) throw new Error();
    const findId = await UserModel.findOne({
      username: messageToBeSent.toUsername
    })
    if(!findId) throw new Error();

    const newMessage = await MessageModel.create({
      fromID: req.user.id,
      toID: findId.id,
      message: messageToBeSent.message
    })
    
    if(!newMessage) throw new Error();


    //ADD SOCKET TO SEND MESSAGE

    const isOnline = usernamesAndSockets[messageToBeSent.toUsername]
  
    if(isOnline){
      io.to(isOnline).emit("new-message", {
        from: req.user.username
      })
    }

    return res.send({
      sent: true,
      err: false
    })

  } catch (e) {
    console.error("error sending message")
    return res.send({
      sent: false,
      err: true
    })    
  }
}

export const getFriendsListBar = async (req: Request, res: Response) => {
  try {
    const friendList = req.user.friendList
    if(!friendList.length){
      return res.send({
        display: [],
        err: false
      })
    }
    let displayBar: FriendListBar[] = []
    for (let i = 0; i < friendList.length; i++){

      const friendID = await UserModel.findOne({
        username: friendList[i].username
      })
      if(!friendID) throw new Error();

      const findLastMessage = await MessageModel.findOne({
        $or: [
          {
            fromID: req.user.id,
            toID: friendID.id
          },
          {
            fromID: friendID.id,
            toID: req.user.id
          }
        ]
      }).sort({ createdAt: -1 });
      let lastMessage = ""
      if(findLastMessage) lastMessage = findLastMessage.message;

      const friend: FriendListBar = {
        username: friendList[i].username,
        profilePicture: friendList[i].profilePicture,
        lastMessage,
        timeSent: findLastMessage ? findLastMessage.createdAt : null,
        name: friendList[i].username,
        notifications: 0
      }
      displayBar.push(friend)
    }

    return res.send({
      display: displayBar,
      err: false
    })

  } catch (e) {
    console.error("error getting friends bar")
    return res.send({
      err: true
    })    
  }
}

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    if(!username) throw new Error();
    const findUserId = await UserModel.findOne({
      username,
    })

    if(!findUserId) throw new Error();

    const allMessages = await MessageModel.find({
        $or: [
          {
            fromID: req.user.id,
            toID: findUserId.id
          },
          {
            fromID: findUserId.id,
            toID: req.user.id
          }
        ]
      }).sort({ createdAt: -1 });
      
      let returnArray: ChatMessage[] = []

      for(let i = 0; i < allMessages.length; i++) {
        let temp = allMessages[i].fromID === req.user.id ? req.user.username : username;
        let messagePush: ChatMessage = {
          username: temp,
          message: allMessages[i].message,
          createdAt: allMessages[i].createdAt
        }
        returnArray.push(messagePush)
      }

      return res.send({
        err: false,
        messages: returnArray.reverse()
      })

  } catch (e) {
    console.error("Here")
    return res.send({
      err: true
    })    
  }
}

export const searchUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    if(username === req.user.username) throw new Error()
    if(!username) throw new Error();
    const user = await UserModel.findOne({
      username: username
    })
    if(!user) throw new Error();
    return res.send({
      username: user.username,
      profilePicture: user.profilePicture,
      err: false
    })
    
  } catch (e) {
    return res.send({
      err: true
    })
  }
}

export const getFriends = async (req: Request, res: Response) => {
  try {
    if(!req.user)throw new Error();
    return res.send({
      err: false,
      friends: req.user.friendList
    })
    
  } catch (e) {
    return res.send({
      err: true
    })
  }
}