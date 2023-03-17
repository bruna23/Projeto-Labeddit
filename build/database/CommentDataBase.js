"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentDatabase = void 0;
const types_1 = require("../types");
const BaseDataBase_1 = require("./BaseDataBase");
const UserDataBase_1 = require("../database/UserDataBase");
class CommentDatabase extends UserDataBase_1.UserDataBase {
    constructor() {
        super(...arguments);
        this.getCommentsByPostId = (post_id) => __awaiter(this, void 0, void 0, function* () {
            const commentsDBase = yield BaseDataBase_1.BaseDatabase
                .connection(CommentDatabase.TABLE_COMMENTS)
                .select()
                .where({ post_id });
            return commentsDBase;
        });
        this.getCommentWithCreatorByPostId = (post_id) => __awaiter(this, void 0, void 0, function* () {
            const resultdb = yield BaseDataBase_1.BaseDatabase
                .connection(CommentDatabase.TABLE_COMMENTS)
                .select("comments.id", "comments.post_id", "comments.creator_id", "comments.content", "comments.likes", "comments.dislikes", "comments.created_at", "comments.updated_at", "users.name AS creator_name")
                .join("users", "comments.creator_id", "=", "users.id")
                .where({ post_id });
            return resultdb;
        });
        this.getCommentById = (id) => __awaiter(this, void 0, void 0, function* () {
            const [commentDBs] = yield BaseDataBase_1.BaseDatabase
                .connection(CommentDatabase.TABLE_COMMENTS)
                .select()
                .where({ id });
            return commentDBs;
        });
        this.getIdPostByCommentId = (id) => __awaiter(this, void 0, void 0, function* () {
            const postIdDb = yield BaseDataBase_1.BaseDatabase
                .connection(CommentDatabase.TABLE_COMMENTS)
                .select("comments.post_id")
                .where({ id });
            return postIdDb;
        });
        this.createComment = (comment) => __awaiter(this, void 0, void 0, function* () {
            yield BaseDataBase_1.BaseDatabase
                .connection(CommentDatabase.TABLE_COMMENTS)
                .insert(comment);
        });
        this.editComment = (id, commentDB) => __awaiter(this, void 0, void 0, function* () {
            yield BaseDataBase_1.BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
                .update(commentDB)
                .where({ id });
        });
        this.deleteCommentById = (id) => __awaiter(this, void 0, void 0, function* () {
            yield BaseDataBase_1.BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
                .delete()
                .where({ id });
        });
        this.likeOrDislikeComment = (likeDislike) => __awaiter(this, void 0, void 0, function* () {
            yield BaseDataBase_1.BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
                .insert(likeDislike);
        });
        this.findLikeDislike = (likeDislikeDBToFind) => __awaiter(this, void 0, void 0, function* () {
            const [likeDislikeDBs] = yield BaseDataBase_1.BaseDatabase
                .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
                .select()
                .where({
                user_id: likeDislikeDBToFind.user_id,
                comment_id: likeDislikeDBToFind.comment_id
            });
            if (likeDislikeDBs) {
                return likeDislikeDBs.like === 1
                    ? types_1.COMMENT_LIKE.ALREADY_LIKED
                    : types_1.COMMENT_LIKE.ALREADY_DISLIKED;
            }
            else {
                return null;
            }
        });
        this.removeLikeDislike = (likeDislikeDBToFind) => __awaiter(this, void 0, void 0, function* () {
            yield BaseDataBase_1.BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
                .delete()
                .where({
                user_id: likeDislikeDBToFind.user_id,
                comment_id: likeDislikeDBToFind.comment_id
            });
        });
        this.updateLikeDislike = (likeDislikeDBToFind) => __awaiter(this, void 0, void 0, function* () {
            yield BaseDataBase_1.BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
                .update(likeDislikeDBToFind)
                .where({
                user_id: likeDislikeDBToFind.user_id,
                comment_id: likeDislikeDBToFind.comment_id
            });
        });
    }
}
exports.CommentDatabase = CommentDatabase;
CommentDatabase.TABLE_COMMENTS = "comments";
CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments";
//# sourceMappingURL=CommentDataBase.js.map