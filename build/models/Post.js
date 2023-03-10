"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
class Post {
    constructor(id, content, likes, dislikes, createdAt, updatedAt, creator) {
        this.id = id;
        this.content = content;
        this.likes = likes;
        this.dislikes = dislikes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.creator = creator;
    }
    getId() {
        return this.id;
    }
    setId(value) {
        this.id = value;
    }
    getContent() {
        return this.content;
    }
    setContent(value) {
        this.content = value;
    }
    getLikes() {
        return this.likes;
    }
    setLikes(value) {
        this.likes = value;
    }
    addLike() {
        this.likes += 1;
    }
    removeLike() {
        this.likes -= 1;
    }
    addDislike() {
        this.dislikes += 1;
    }
    removeDislike() {
        this.dislikes -= 1;
    }
    getDislikes() {
        return this.dislikes;
    }
    setDislikes(value) {
        this.dislikes = value;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    setCreatedAt(value) {
        this.createdAt = value;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    setUpdatedAt(value) {
        this.updatedAt = value;
    }
    getCreator() {
        return this.creator;
    }
    setCreator(value) {
        this.creator = value;
    }
    toDBModel() {
        return {
            id: this.id,
            creator_id: this.creator.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
        };
    }
    toBusinessModel() {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            creator: {
                id: this.creator.id,
                name: this.creator.name,
            },
        };
    }
}
exports.Post = Post;
//# sourceMappingURL=Post.js.map