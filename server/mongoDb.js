"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
class Database {
    constructor(config, mongo) {
        this._config = config;
        this._mongo = mongo;
    }
    connect() {
        console.log('Attempting to connect to MongoDB cluster');
        const { mongodb: { url, port, collection, password, username }, } = this._config;
        let protocol;
        // IF ADMIN INPUTS LOCALHOST, CHANGE PROTOCOL DEFINITION
        url === 'localhost' || url === '127.0.0.1'
            ? (protocol = 'mongodb://')
            : (protocol = 'mongodb+srv://');
        const uri = username && password
            ? // MODIFY URI SYNTAX BASED ON ADMIN INPUT
                // Removed: /${collection} from ${url}/${collection}
                `${protocol}${username}:${password}${url}`
            : `${protocol}${url}:${port}/${collection}`;
        // INITIATE CONNECTION TO MONGODB
        this._mongo.connect(uri);
        const db = this._mongo.connection;
        db.on('error', console.error.bind(console, 'Connection error:'));
        db.once('open', () => {
            console.log(`Successfully connected to MongoDB cluster: ${uri}`);
        });
        return mongoose_1.default;
    }
    get mongo() {
        return this._mongo;
    }
    get config() {
        return this._config;
    }
}
// FREEZE OBJECT TO PREVENT CHANGES TO IT
exports.default = Object.freeze(new Database(config_1.config, mongoose_1.default));
//# sourceMappingURL=mongoDb.js.map