var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UsernameModel } from "../database/models/Username.js";
import { UserModel } from "../database/models/Users.js";
import { hashPassword, comparePassword } from "../utils/encrypt.js";
import { createToken } from "../utils/auth-jwt.js";
import { uploadImage } from "../utils/uploads.js";
export const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email)
            throw new Error();
        const existingUsername = yield UsernameModel.findOne({
            username
        });
        if (existingUsername)
            throw new Error();
        const hash = yield hashPassword(password);
        if (!hash)
            throw new Error();
        const createdUser = yield UserModel.create({
            username: username,
            email: email,
            hash: hash,
            profilePicture: "",
            friendList: JSON.stringify([]),
            pendingFriendRequest: JSON.stringify([])
        });
        console.log("here1 ", username);
        const createUsername = yield UsernameModel.create({
            username
        });
        if (!createUsername || !createdUser)
            throw new Error();
        const token = createToken(createdUser.id);
        return res.send({
            created: true,
            err: false,
            token
        });
    }
    catch (e) {
        return res.send({
            err: true
        });
    }
});
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            throw new Error();
        const user = yield UserModel.findOne({
            email
        });
        if (!user)
            throw new Error();
        const correct = yield comparePassword(password, user.hash);
        if (!correct)
            throw new Error();
        const token = createToken(user.id);
        return res.send({
            err: false,
            token,
            username: user.username,
            profilePicture: user.profilePicture
        });
    }
    catch (e) {
        return res.send({
            err: true
        });
    }
});
export const changeProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            throw new Error();
        const { image } = req.body;
        if (!image)
            throw new Error();
        const uploaded = yield uploadImage(image);
        if (!uploaded)
            throw new Error();
        const updateProfile = yield UserModel.findByIdAndUpdate(req.user.id, {
            profilePicture: uploaded.url
        });
        if (!updateProfile)
            throw new Error();
        return res.send({
            err: false,
            profilePicture: updateProfile.profilePicture
        });
    }
    catch (e) {
        console.error("error happened here");
        return res.send({
            err: true
        });
    }
});
export const freeUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        if (!username)
            throw new Error();
        const exists = yield UsernameModel.findOne({
            username,
        });
        if (exists) {
            return res.send({
                err: false,
                available: false
            });
        }
        return res.send({
            err: false,
            available: true
        });
    }
    catch (e) {
        console.error('err searching username');
        return res.send({
            err: true
        });
    }
});
