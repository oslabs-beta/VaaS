"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
exports.config = {
    mongodb: {
        url: process.env.MONGO_URL,
        port: Number(process.env.MONGO_PORT),
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
        collection: process.env.MONGO_COLLECTION,
    },
    jwt: {
        access: process.env.JWT_ACCESS_SECRET,
        refresh: process.env.JWT_REFRESH_SECRET
    }
};
//# sourceMappingURL=config.js.map