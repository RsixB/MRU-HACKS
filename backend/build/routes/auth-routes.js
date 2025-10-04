import { Router } from "express";
import { login, register, changeProfilePicture, freeUsername } from "../handlers/auth-routes.js";
import { deserializeUser } from "../middleware/req-m.js";
const router = Router();
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/profile-picture", deserializeUser, changeProfilePicture);
router.post("/verify-username", freeUsername);
export default router;
