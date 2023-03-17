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
exports.CommentBusiness = void 0;
const BadRequestError_1 = require("../errors/BadRequestError");
const Comment_1 = require("../models/Comment");
const types_1 = require("../types");
class CommentBusiness {
    constructor(commentDatabase, userDatabase, postDataBase, idGenerator, tokenManager, hashManager) {
        this.commentDatabase = commentDatabase;
        this.userDatabase = userDatabase;
        this.postDataBase = postDataBase;
        this.idGenerator = idGenerator;
        this.tokenManager = tokenManager;
        this.hashManager = hashManager;
        this.createComments = (input) => __awaiter(this, void 0, void 0, function* () {
            const { postId, content, token } = input;
            if (!token) {
                throw new BadRequestError_1.BadRequestError("Token não enviado!");
            }
            const payload = this.tokenManager.getPayloadt(token);
            if (payload === null) {
                throw new BadRequestError_1.BadRequestError("Token inválido!");
            }
            if (typeof postId !== "string") {
                throw new BadRequestError_1.BadRequestError("'postId' deve ser string");
            }
            if (typeof content !== "string") {
                throw new BadRequestError_1.BadRequestError("'content' deve ser string");
            }
            const ids = this.idGenerator.generateid();
            const comments = new Comment_1.Comment(ids, postId, content, 0, 0, new Date().toISOString(), new Date().toISOString(), payload.id, payload.name);
            const commentDBs = comments.toDBModel();
            yield this.commentDatabase.createComment(commentDBs);
            const outputcomment = {
                message: "Comentário criado com sucesso!"
            };
            return outputcomment;
        });
        this.getComments = (input) => __awaiter(this, void 0, void 0, function* () {
            const { postId, token } = input;
            if (!token) {
                throw new BadRequestError_1.BadRequestError("Token não enviado!");
            }
            const payload = this.tokenManager.getPayloadt(token);
            if (payload === null) {
                throw new BadRequestError_1.BadRequestError("Token inválido!");
            }
            if (typeof postId !== "string") {
                throw new BadRequestError_1.BadRequestError("'postId' deve ser string");
            }
            const commentsWithCreatorDB = yield this.commentDatabase.getCommentWithCreatorByPostId(postId);
            const comments = commentsWithCreatorDB.map((commentDB) => {
                const comments = new Comment_1.Comment(commentDB.id, commentDB.post_id, commentDB.content, commentDB.likes, commentDB.dislikes, commentDB.created_at, commentDB.updated_at, commentDB.creator_id, commentDB.creator_name);
                return comments.toBusinessModel();
            });
            return comments;
        });
        this.deleteComment = (input) => __awaiter(this, void 0, void 0, function* () {
            const { commentId, token } = input;
            if (!token) {
                throw new BadRequestError_1.BadRequestError("Token não enviado!");
            }
            const payload = this.tokenManager.getPayloadt(token);
            if (payload === null) {
                throw new BadRequestError_1.BadRequestError("Token inválido!");
            }
            if (typeof commentId !== "string") {
                throw new BadRequestError_1.BadRequestError("'commentId' deve ser string");
            }
            const commentDBid = yield this.commentDatabase.getCommentById(commentId);
            if (!commentDBid) {
                throw new BadRequestError_1.BadRequestError("Comentário não encontrado!");
            }
            if (payload.role !== types_1.USER_ROLES.ADMIN && commentDBid.creator_id !== payload.id) {
                throw new BadRequestError_1.BadRequestError("Somente o criador do comentário pode deletar.");
            }
            yield this.commentDatabase.deleteCommentById(commentId);
            const output = {
                message: "Comentário deletado com sucesso!"
            };
            return output;
        });
        this.likeOrDislikeComment = (input) => __awaiter(this, void 0, void 0, function* () {
            const { idToLikeOrDislike, token, like } = input;
            if (!token) {
                throw new BadRequestError_1.BadRequestError("Token não enviado!");
            }
            const payloadt = this.tokenManager.getPayloadt(token);
            if (payloadt === null) {
                throw new BadRequestError_1.BadRequestError("Usuário não logado!");
            }
            if (typeof like !== "boolean") {
                throw new BadRequestError_1.BadRequestError("'like' deve ser boolean!");
            }
            const commentDB = yield this.commentDatabase.getCommentById(idToLikeOrDislike);
            if (!commentDB) {
                throw new BadRequestError_1.BadRequestError("Comentário não encontrado!");
            }
            const postIds = yield this.commentDatabase.getIdPostByCommentId(idToLikeOrDislike);
            const likeSQLite = like ? 1 : 0;
            if (commentDB.creator_id === payloadt.id) {
                throw new BadRequestError_1.BadRequestError("O criador não pode curtir seu próprio post.");
            }
            const likeDislikeDBs = {
                user_id: payloadt.id,
                post_id: postIds[0].post_id,
                comment_id: idToLikeOrDislike,
                like: likeSQLite
            };
            const commentdb = new Comment_1.Comment(commentDB.id, commentDB.post_id, commentDB.content, commentDB.likes, commentDB.dislikes, commentDB.created_at, commentDB.updated_at, commentDB.creator_id, commentDB.creator_name);
            const likeDislikeExists = yield this.commentDatabase.findLikeDislike(likeDislikeDBs);
            if (likeDislikeExists === types_1.COMMENT_LIKE.ALREADY_LIKED) {
                if (like) {
                    yield this.commentDatabase.removeLikeDislike(likeDislikeDBs);
                    commentdb.removeLike();
                }
                else {
                    yield this.commentDatabase.updateLikeDislike(likeDislikeDBs);
                    commentdb.removeLike();
                    commentdb.addDislike();
                }
            }
            else if (likeDislikeExists === types_1.COMMENT_LIKE.ALREADY_DISLIKED) {
                if (like) {
                    yield this.commentDatabase.updateLikeDislike(likeDislikeDBs);
                    commentdb.removeDislike();
                    commentdb.addLike();
                }
                else {
                    yield this.commentDatabase.removeLikeDislike(likeDislikeDBs);
                    commentdb.removeDislike();
                }
            }
            else {
                yield this.commentDatabase.likeOrDislikeComment(likeDislikeDBs);
                like ? commentdb.addLike() : commentdb.addDislike();
            }
            const updatedComments = commentdb.toDBModel();
            yield this.commentDatabase.editComment(idToLikeOrDislike, updatedComments);
        });
    }
}
exports.CommentBusiness = CommentBusiness;
//# sourceMappingURL=CommentBusiness.js.map