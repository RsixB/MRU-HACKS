import { getFriends, addFriend, sendMessage, getPendingFriendRequest, rejectRequest,acceptRequest,getFriendsListBar, findUserProfile, getMessages } from "../handlers/general-routes.ts"
import { deserializeUser } from "../middleware/req-m.ts"
import { searchUser } from "../handlers/general-routes.ts"
import { Router } from "express"

const router = Router()

router.post("/add", deserializeUser, addFriend)

router.post("/accept-request", deserializeUser, acceptRequest)

router.post("/search", deserializeUser, searchUser)

router.post("/get-friend-requests", deserializeUser, getPendingFriendRequest)

router.post("/reject-request", deserializeUser, rejectRequest)


router.post("/send-message", deserializeUser, sendMessage)

router.post("/get-friends", deserializeUser, getFriends)

router.post("/friend-list-bar", deserializeUser, getFriendsListBar)

router.post("/messages", deserializeUser, getMessages)

export default router
