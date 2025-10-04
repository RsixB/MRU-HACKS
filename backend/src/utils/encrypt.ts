import bcrypt from "bcrypt"

const SALT = process.env.SALT as Number

export const hashPassword = async(password: string): Promise<string | null> => {
  try {
    const hash = await bcrypt.hash(password, SALT)
    return hash
  } catch (e) {
    return null
  }
}

export const comparePassword = async(password: string, hash: string): Promise<boolean> => {
try {
  const compared = await bcrypt.compare(password, hash)
  return compared
} catch (e) {
  return false
}
}