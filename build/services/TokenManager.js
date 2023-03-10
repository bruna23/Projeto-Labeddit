"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManagerService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class TokenManagerService {
    constructor() {
        this.createTokenload = (payload) => {
            const tokenload = jsonwebtoken_1.default.sign(payload, process.env.JWT_KEY, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
            return tokenload;
        };
        this.getPayloadt = (token) => {
            try {
                const tpayload = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
                return tpayload;
            }
            catch (error) {
                return null;
            }
        };
    }
}
exports.TokenManagerService = TokenManagerService;
//# sourceMappingURL=TokenManager.js.map