import { Router } from "express";
import { login, register, changeProfilePicture, freeUsername } from "../handlers/auth-routes.ts";
import { deserializeUser } from "../middleware/req-m.ts";
const router = Router()

router.post("/auth/register", register)

router.post("/auth/login", login)

router.post("/auth/profile-picture", deserializeUser, changeProfilePicture)

router.post("/verify-username", freeUsername)

export default router