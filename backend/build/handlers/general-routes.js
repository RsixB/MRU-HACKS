var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MessageModel } from "../database/models/Messages.js";
import { UserModel } from "../database/models/Users.js";
import { io, usernamesAndSockets } from "../server.js";
export const addFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        if (!req.user || !username || username === req.user.username)
            throw new Error();
        const exists = yield UserModel.findOne({
            username
        });
        const friendsAlready = req.user.friendList.find((user) => { return user.username === username; });
        if (!exists || friendsAlready)
            throw new Error();
        const newList = [{
                username,
                profilePicture: exists.profilePicture
            }, ...req.user.friendList];
        const updated = yield UserModel.findByIdAndUpdate(req.user.id, {
            $set: {
                friendList: JSON.stringify(newList)
            }
        }, { new: true });
        if (!updated)
            throw new Error();
        const friendRequests = JSON.parse(exists.pendingFriendRequest);
        const updatedFriendRequests = [...friendRequests, {
                username: req.user.username,
                profilePicture: req.user.profilePicture
            }];
        const alreadyFriends = (JSON.parse(exists.friendList));
        let temp = alreadyFriends.find((u) => {
            return u.username === req.user.username;
        });
        if (!temp) {
            const sendRequest = yield UserModel.findOneAndUpdate({
                username,
            }, {
                pendingFriendRequest: JSON.stringify(updatedFriendRequests)
            });
            if (!sendRequest)
                throw new Error();
        }
        //ADD SOCKETS HERE
        //SOCKET.IO
        const isOnline = usernamesAndSockets[username];
        if (isOnline) {
            io.to(isOnline).emit("friend-request", {
                newFriend: "YES"
            });
        }
        return res.send({
            newFriend: {
                username,
                profilePicture: exists.profilePicture
            },
            err: false
        });
    }
    catch (e) {
        console.error("error adding friend");
        return res.send({
            err: true
        });
    }
});
export const acceptRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        if (!username)
            throw new Error();
        const pendingFriendRequests = req.user.pendingFriendRequest;
        const removed = pendingFriendRequests.filter((u) => {
            return u.username !== username;
        });
        const him = pendingFriendRequests.find((u) => {
            return u.username === username;
        });
        if ((removed.length === pendingFriendRequests.length) || !him)
            throw new Error();
        const updated = yield UserModel.findByIdAndUpdate(req.user.id, {
            pendingFriendRequest: JSON.stringify(removed),
            friendList: JSON.stringify([him, ...req.user.friendList]),
        });
        if (!updated)
            throw new Error();
        return res.send({
            friendRequests: removed,
            err: false
        });
    }
    catch (e) {
        console.error("error accepting friend");
        return res.send({
            err: true
        });
    }
});
export const rejectRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        if (!username)
            throw new Error();
        const pendingFriendRequests = req.user.pendingFriendRequest;
        const removed = pendingFriendRequests.filter((u) => {
            return u.username !== username;
        });
        if (!username || (removed.length === pendingFriendRequests.length)) {
            return res.send({
                err: true,
            });
        }
        const updated = yield UserModel.findByIdAndUpdate(req.user.id, {
            pendingFriendRequest: JSON.stringify(removed)
        });
        if (!updated)
            throw new Error();
        return res.send({
            err: false,
            friendRequests: removed
        });
    }
    catch (e) {
        console.error("error accepting friend");
        return res.send({
            err: true
        });
    }
});
export const getPendingFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const friendRequests = req.user.pendingFriendRequest;
        return res.send({
            friendRequests,
            err: false
        });
    }
    catch (e) {
        return res.send({
            err: true
        });
    }
});
export const findUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        if (!username)
            throw new Error();
        const findUser = yield UserModel.findOne({
            username
        });
        if (findUser) {
            return res.send({
                user: {
                    username: findUser.username,
                    profilePicture: findUser.profilePicture
                },
                err: false
            });
        }
        else {
            return res.send({
                user: null,
                err: false
            });
        }
    }
    catch (e) {
        return res.send({
            err: true
        });
    }
});
export const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageToBeSent = req.body.content;
        if (!req.user || !messageToBeSent)
            throw new Error();
        const findId = yield UserModel.findOne({
            username: messageToBeSent.toUsername
        });
        if (!findId)
            throw new Error();
        const newMessage = yield MessageModel.create({
            fromID: req.user.id,
            toID: findId.id,
            message: messageToBeSent.message
        });
        if (!newMessage)
            throw new Error();
        //ADD SOCKET TO SEND MESSAGE
        const isOnline = usernamesAndSockets[messageToBeSent.toUsername];
        if (isOnline) {
            io.to(isOnline).emit("new-message", {
                from: req.user.username
            });
        }
        return res.send({
            sent: true,
            err: false
        });
    }
    catch (e) {
        console.error("error sending message");
        return res.send({
            sent: false,
            err: true
        });
    }
});
export const getFriendsListBar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const friendList = req.user.friendList;
        if (!friendList.length) {
            return res.send({
                display: [],
                err: false
            });
        }
        let displayBar = [];
        for (let i = 0; i < friendList.length; i++) {
            const friendID = yield UserModel.findOne({
                username: friendList[i].username
            });
            if (!friendID)
                throw new Error();
            const findLastMessage = yield MessageModel.findOne({
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
            let lastMessage = "";
            if (findLastMessage)
                lastMessage = findLastMessage.message;
            const friend = {
                username: friendList[i].username,
                profilePicture: friendList[i].profilePicture,
                lastMessage,
                timeSent: findLastMessage ? findLastMessage.createdAt : null,
                name: friendList[i].username,
                notifications: 0
            };
            displayBar.push(friend);
        }
        return res.send({
            display: displayBar,
            err: false
        });
    }
    catch (e) {
        console.error("error getting friends bar");
        return res.send({
            err: true
        });
    }
});
export const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        if (!username)
            throw new Error();
        const findUserId = yield UserModel.findOne({
            username,
        });
        if (!findUserId)
            throw new Error();
        const allMessages = yield MessageModel.find({
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
        let returnArray = [];
        for (let i = 0; i < allMessages.length; i++) {
            let temp = allMessages[i].fromID === req.user.id ? req.user.username : username;
            let messagePush = {
                username: temp,
                message: allMessages[i].message,
                createdAt: allMessages[i].createdAt
            };
            returnArray.push(messagePush);
        }
        return res.send({
            err: false,
            messages: returnArray.reverse()
        });
    }
    catch (e) {
        console.error("Here");
        return res.send({
            err: true
        });
    }
});
export const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        if (username === req.user.username)
            throw new Error();
        if (!username)
            throw new Error();
        const user = yield UserModel.findOne({
            username: username
        });
        if (!user)
            throw new Error();
        return res.send({
            username: user.username,
            profilePicture: user.profilePicture,
            err: false
        });
    }
    catch (e) {
        return res.send({
            err: true
        });
    }
});
export const getFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            throw new Error();
        return res.send({
            err: false,
            friends: req.user.friendList
        });
    }
    catch (e) {
        return res.send({
            err: true
        });
    }
});
