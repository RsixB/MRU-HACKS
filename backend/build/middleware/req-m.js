var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { verifyToken } from "../utils/auth-jwt.js";
import { UserModel } from "../database/models/Users.js";
export const deserializeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        if (!token)
            throw new Error();
        const verifiedID = verifyToken(token);
        if (!verifiedID)
            throw new Error();
        const user = yield UserModel.findById(verifiedID);
        if (!user)
            throw new Error();
        req.user = {
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            id: user.id,
            friendList: JSON.parse(user.friendList),
            pendingFriendRequest: JSON.parse(user.pendingFriendRequest)
        };
        return next();
    }
    catch (e) {
        console.error("error happened here");
        return res.send({
            err: true
        });
    }
});
