"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const postRouter_1 = require("./routers/postRouter");
const dotenv_1 = __importDefault(require("dotenv"));
const userRouter_1 = require("./routers/userRouter");
const commentRouter_1 = require("./routers/commentRouter");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.listen(Number(process.env.PORT), () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
app.use("/posts", postRouter_1.postRouter);
app.use("/user", userRouter_1.userRouter);
app.use("/comment", commentRouter_1.commentRouter);
//# sourceMappingURL=index.js.map