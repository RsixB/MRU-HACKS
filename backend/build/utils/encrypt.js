var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
const SALT = Number(process.env.SALT) || 10;
export const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = yield bcrypt.hash(password, SALT);
        return hash;
    }
    catch (e) {
        return null;
    }
});
export const comparePassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const compared = yield bcrypt.compare(password, hash);
        return compared;
    }
    catch (e) {
        return false;
    }
});
