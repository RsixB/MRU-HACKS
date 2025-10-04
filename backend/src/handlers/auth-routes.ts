import type { Request, Response, NextFunction} from "express-serve-static-core";
import { UsernameModel } from "../database/models/Username.ts";
import { UserModel } from "../database/models/Users.ts";
import { hashPassword, comparePassword } from "../utils/encrypt.ts";
import { createToken } from "../utils/auth-jwt.ts";
import { uploadImage } from "../utils/uploads.ts";
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) throw new Error()
    
    const existingUsername = await UsernameModel.findOne({
      username
    })
    if(existingUsername) throw new Error()
    
    const hash = await hashPassword(password)
    if(!hash) throw new Error();
    const createdUser = await UserModel.create({
      username: username,
      email: email,
      hash: hash,
      profilePicture: "",
      friendList: JSON.stringify([]),
      pendingFriendRequest: JSON.stringify([])
    })
    console.log("here1 ", username)
    const createUsername = await UsernameModel.create({
      username
    })

    if(!createUsername || !createdUser) throw new Error();
    const token = createToken(createdUser.id)

    return res.send({
      created: true,
      err: false,
      token
    })

  } catch (e) {
    return res.send({
      err: true
    })
  }
}


export const login = async (req: Request, res: Response) => {
  try {
    
    const {email, password} = req.body
    
    if(!email || !password) throw new Error();

    const user = await UserModel.findOne({
      email
    })

    if(!user) throw new Error();
    const correct = await comparePassword(password, user.hash)
    if(!correct)throw new Error();
    const token = createToken(user.id)
    return res.send({
      err: false,
      token,
      username: user.username,
      profilePicture: user.profilePicture
    })
    
  } catch (e) {
    return res.send({
      err: true
    })
  }
}

export const changeProfilePicture = async (req: Request, res: Response) => {
  try {
    if(!req.user) throw new Error()
    const {image } = req.body
    if (!image) throw new Error();

    const uploaded = await uploadImage(image)
    if (!uploaded) throw new Error();
    const updateProfile = await UserModel.findByIdAndUpdate(req.user.id, {
      profilePicture: uploaded.url
    })
    if (!updateProfile) throw new Error();
    
    return res.send({
      err: false,
      profilePicture: updateProfile.profilePicture
    })

  } catch (e) {
    console.error("error happened here")
    return res.send({
      err: true
    })
  }
}

export const freeUsername = async (req: Request, res: Response) => {
  try {
    const {username} = req.body;
    if(!username) throw new Error();
    const exists = await UsernameModel.findOne({
      username,
    })
    if(exists){
      return res.send({
        err: false,
        available: false
      })
    }
    return res.send({
      err: false,
      available: true
    })
  } catch (e) {
    console.error('err searching username')
    return res.send({
      err: true
    })
  }
}