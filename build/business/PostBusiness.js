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
exports.PostBusiness = void 0;
const BadRequestError_1 = require("../errors/BadRequestError");
const NotFoundError_1 = require("../errors/NotFoundError");
const Post_1 = require("../models/Post");
const types_1 = require("../types");
class PostBusiness {
    constructor(postDatabase, idGenerator, tokenManager, hashManager) {
        this.postDatabase = postDatabase;
        this.idGenerator = idGenerator;
        this.tokenManager = tokenManager;
        this.hashManager = hashManager;
        this.getPosts = (input) => __awaiter(this, void 0, void 0, function* () {
            const { q, token } = input;
            if (!token) {
                throw new BadRequestError_1.BadRequestError("Token não enviado!");
            }
            const payload = this.tokenManager.getPayloadt(token);
            if (payload === null) {
                throw new BadRequestError_1.BadRequestError("Token inválido!");
            }
            if (typeof q !== "string" && q !== undefined) {
                throw new BadRequestError_1.BadRequestError("'q' deve ser uma string ou undefined");
            }
            const { postsDB, usersDB } = yield this.postDatabase.getPostsAndUsers(q);
            const posts = postsDB.map((postDB) => {
                const post = new Post_1.Post(postDB.id, postDB.content, postDB.likes, postDB.dislikes, postDB.created_at, postDB.updated_at, getCreator(postDB.creator_id));
                return post.toBusinessModel();
            });
            function getCreator(creatorId) {
                const creator = usersDB.find((userDB) => {
                    return userDB.id === creatorId;
                });
                return {
                    id: creator.id,
                    name: creator.name,
                };
            }
            return posts;
        });
        this.createPost = (input) => __awaiter(this, void 0, void 0, function* () {
            const { content, token } = input;
            const payload = this.tokenManager.getPayloadt(token);
            if (payload === null) {
                throw new BadRequestError_1.BadRequestError("Usuário não logado");
            }
            if (typeof content !== "string") {
                throw new BadRequestError_1.BadRequestError("Post deve ser uma string.");
            }
            if (content.length === 0) {
                throw new BadRequestError_1.BadRequestError("Post não pode ser vazio.");
            }
            const id = this.idGenerator.generateid();
            const newPost = new Post_1.Post(id, content, 0, 0, new Date().toISOString(), new Date().toISOString(), payload);
            const postDB = newPost.toDBModel();
            yield this.postDatabase.createPost(postDB);
            const output = {
                message: "Post enviado com sucesso.",
            };
            return output;
        });
        this.editPost = (input) => __awaiter(this, void 0, void 0, function* () {
            const { idToEdit, token, content } = input;
            if (token === undefined) {
                throw new BadRequestError_1.BadRequestError("Token ausente!");
            }
            const payload = this.tokenManager.getPayloadt(token);
            if (payload === null) {
                throw new BadRequestError_1.BadRequestError("Token inválido");
            }
            if (typeof content !== "string") {
                throw new BadRequestError_1.BadRequestError("'content' deve ser string");
            }
            const postDB = yield this.postDatabase.findById(idToEdit);
            if (!postDB) {
                throw new NotFoundError_1.NotFoundError("'id' não encontrado");
            }
            if (postDB.creator_id !== payload.id) {
                throw new BadRequestError_1.BadRequestError("somente quem criou o post pode editá-lo");
            }
            const post = new Post_1.Post(postDB.id, postDB.content, postDB.likes, postDB.dislikes, postDB.created_at, postDB.updated_at, payload);
            post.setContent(content);
            post.setUpdatedAt(new Date().toISOString());
            const updatePostDatabase = post.toDBModel();
            yield this.postDatabase.update(idToEdit, updatePostDatabase);
        });
        this.deletePost = (input) => __awaiter(this, void 0, void 0, function* () {
            const { idToDelete, token } = input;
            if (token === undefined) {
                throw new BadRequestError_1.BadRequestError("Token ausente!");
            }
            const payload = this.tokenManager.getPayloadt(token);
            if (payload === null) {
                throw new BadRequestError_1.BadRequestError("Token inválido");
            }
            const postDB = yield this.postDatabase.findById(idToDelete);
            if (!postDB) {
                throw new NotFoundError_1.NotFoundError("'id' não encontrado");
            }
            if (payload.role !== types_1.USER_ROLES.ADMIN && postDB.creator_id !== payload.id) {
                throw new BadRequestError_1.BadRequestError("somente quem criou o post pode deletá-lo.");
            }
            yield this.postDatabase.deleteById(idToDelete);
        });
        this.likeOrDislikePost = (input) => __awaiter(this, void 0, void 0, function* () {
            const { idToLikeOrDislike, token, like } = input;
            if (token === undefined) {
                throw new BadRequestError_1.BadRequestError("Token ausente!");
            }
            const payload = this.tokenManager.getPayloadt(token);
            if (payload === null) {
                throw new BadRequestError_1.BadRequestError("Token inválido");
            }
            if (typeof like !== "boolean") {
                throw new BadRequestError_1.BadRequestError("'like' deve ser boolean");
            }
            const postWithCreatorDB = yield this.postDatabase.findPostWithCreatorById(idToLikeOrDislike);
            if (!postWithCreatorDB) {
                throw new NotFoundError_1.NotFoundError("'id' não encontrado");
            }
            if (postWithCreatorDB.creator_id === payload.id) {
                throw new BadRequestError_1.BadRequestError("O criador do post não pode curti-lo");
            }
            const likeSQLite = like ? 1 : 0;
            const likeDislikeDB = {
                user_id: payload.id,
                post_id: postWithCreatorDB.id,
                like: likeSQLite
            };
            const usersDB = yield this.postDatabase.getAllUsers();
            function getCreator(creatorId) {
                const creator = usersDB.find((userDB) => {
                    return userDB.id === creatorId;
                });
                return {
                    id: creator.id,
                    name: creator.name,
                };
            }
            const post = new Post_1.Post(postWithCreatorDB.id, postWithCreatorDB.content, postWithCreatorDB.likes, postWithCreatorDB.dislikes, postWithCreatorDB.created_at, postWithCreatorDB.updated_at, getCreator(postWithCreatorDB.creator_id));
            const likeDislikeExists = yield this.postDatabase.findLikeDislike(likeDislikeDB);
            if (likeDislikeExists === types_1.POST_LIKE.ALREADY_LIKED) {
                if (like) {
                    yield this.postDatabase.removeLikeDislike(likeDislikeDB);
                    post.removeLike();
                }
                else {
                    yield this.postDatabase.updateLikeDislike(likeDislikeDB);
                    post.removeLike();
                    post.addDislike();
                }
            }
            else if (likeDislikeExists === types_1.POST_LIKE.ALREADY_DISLIKED) {
                if (like) {
                    yield this.postDatabase.updateLikeDislike(likeDislikeDB);
                    post.removeDislike();
                    post.addLike();
                }
                else {
                    yield this.postDatabase.removeLikeDislike(likeDislikeDB);
                    post.removeDislike();
                }
            }
            else {
                yield this.postDatabase.likeOrDislikePost(likeDislikeDB);
                like ? post.addLike() : post.addDislike();
            }
            const updatePostDB = post.toDBModel();
            yield this.postDatabase.update(idToLikeOrDislike, updatePostDB);
        });
    }
}
exports.PostBusiness = PostBusiness;
//# sourceMappingURL=PostBusiness.js.map