"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = __importDefault(require("express"));
const CommentBusiness_1 = require("../business/CommentBusiness");
const CommentController_1 = require("../controller/CommentController");
const CommentDatabase_1 = require("../database/CommentDatabase");
const PostDatabase_1 = require("../database/PostDatabase");
const UserDataBase_1 = require("../database/UserDataBase");
const HashManager_1 = require("../services/HashManager");
const IdGenerator_1 = require("../services/IdGenerator");
const TokenManager_1 = require("../services/TokenManager");
exports.commentRouter = express_1.default.Router();
const commentControllerDb = new CommentController_1.CommentController(new CommentBusiness_1.CommentBusiness(new CommentDatabase_1.CommentDatabase(), new UserDataBase_1.UserDataBase(), new PostDatabase_1.PostDatabase(), new IdGenerator_1.IdGenerator(), new TokenManager_1.TokenManagerService(), new HashManager_1.HashManager()));
exports.commentRouter.get("/:id", commentControllerDb.getComments);
exports.commentRouter.post("/:id", commentControllerDb.createComments);
exports.commentRouter.delete("/:id", commentControllerDb.deleteComment);
exports.commentRouter.put("/:id/like", commentControllerDb.likeOrDislikeComment);
//# sourceMappingURL=commentRouter.js.map