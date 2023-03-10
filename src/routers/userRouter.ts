import express from "express"
import { UserBusiness } from "../business/UserBusiness"
import { UserController } from "../controller/UserController"
import { UserDataBase } from "../database/UserDataBase"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManagerService } from "../services/TokenManager"

export const userRouter = express.Router()

const userController = new UserController(
    
    new UserBusiness(
        new TokenManagerService(),
        new HashManager(),
        new UserDataBase(),
        new IdGenerator(),
    )
)

userRouter.post("/signup", userController.signup)
userRouter.post("/login", userController.login)