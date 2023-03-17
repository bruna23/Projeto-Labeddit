import express from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { CommentController } from "../controller/CommentController";
import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { UserDataBase } from "../database/UserDataBase";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManagerService } from "../services/TokenManager";

export const commentRouter = express.Router()

const commentControllerDb = new CommentController(
  new CommentBusiness(
    new CommentDatabase(),
    new UserDataBase(),
    new PostDatabase(),
    new IdGenerator(),
    new TokenManagerService(),
    new HashManager()
  )
)

commentRouter.get("/:id", commentControllerDb.getComments)
commentRouter.post("/:id", commentControllerDb.createComments)
commentRouter.delete("/:id", commentControllerDb.deleteComment)
commentRouter.put("/:id/like", commentControllerDb.likeOrDislikeComment)