import { Router } from "express";
import { getFriends, addFriend, rejectRequest, acceptRequest } from "../handlers/general-routes.ts"; 

const router = Router()
//NEEDS AUTH
router.post("/get-friends")
router.post("/add-friend")
router.post("/accept-request")
router.post("/reject-request")
export default router