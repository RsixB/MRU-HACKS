import jwt from "jsonwebtoken"
import type { UserPayload } from "../types/types.ts"
const SECRET = process.env.JWT_SECRET || ""


export const createToken = (id: string): string => {
  const signedData = jwt.sign({id}, SECRET)
  return signedData
}

export const verifyToken = (token: string): string | null=> {
  try {
    const authenticated = jwt.verify(token, SECRET) as UserPayload

    if(!authenticated)throw new Error();
    return authenticated.id
  } catch (e) {
    console.error("HERE")
    return null
  }
}