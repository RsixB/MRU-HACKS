import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "";
export const createToken = (id) => {
    const signedData = jwt.sign({ id }, SECRET);
    return signedData;
};
export const verifyToken = (token) => {
    try {
        const authenticated = jwt.verify(token, SECRET);
        if (!authenticated)
            throw new Error();
        return authenticated.id;
    }
    catch (e) {
        console.error("HERE");
        return null;
    }
};
