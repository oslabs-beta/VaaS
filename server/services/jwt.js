"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExpStatus = exports.decodeSession = exports.encodeSession = void 0;
const jwt_simple_1 = require("jwt-simple");
// encoding JWT
function encodeSession(accessSecret, partialSession) {
    const algo = "HS512";
    const iat = Date.now(), timeToExp = Number(process.env.JWT_EXP), eat = iat + timeToExp;
    const session = {
        ...partialSession,
        iat: iat,
        eat: eat
    };
    return {
        token: (0, jwt_simple_1.encode)(session, accessSecret, algo)
    };
}
exports.encodeSession = encodeSession;
// decoding JWT
function decodeSession(accessSecret, sessionToken) {
    const algorithm = "HS512";
    let result;
    try {
        result = (0, jwt_simple_1.decode)(sessionToken, accessSecret, false, algorithm);
    }
    catch (err) {
        if (err.message === "No token supplied" ||
            err.message === "Not enough or too many segments" ||
            err.message.indexOf("Unexpected token") === 0) {
            return { type: "invalid-token" };
        }
        if (err.message === "Signature verification failed" || err.message === "Algorithm not supported") {
            return { type: "integrity-error" };
        }
        throw err;
    }
    return {
        type: "valid",
        session: result
    };
}
exports.decodeSession = decodeSession;
function checkExpStatus(token) {
    const now = Date.now();
    if (token.eat > now)
        return "active";
    const gracePeriod = token.eat + Number(process.env.JWT_grace);
    if (gracePeriod > now)
        return "grace";
    return "expired";
}
exports.checkExpStatus = checkExpStatus;
//# sourceMappingURL=jwt.js.map