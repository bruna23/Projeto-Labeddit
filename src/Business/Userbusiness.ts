import { IdGenerator } from "../services/IdGenerator"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { InputLogin, OutputLogin, InputSignup, OutputSignup} from "../dtos/UserDTO"
import { UserDataBase } from "../database/UserDataBase"
import { User } from "../models/User"
import { TokenPayload, USER_ROLES } from "../types"
import { TokenManagerService } from "../services/TokenManager"
import { HashManager } from "../services/HashManager"

export class UserBusiness {
    constructor(
        private tokenMananger: TokenManagerService,
        private hashManager: HashManager,
        private userDatabase: UserDataBase,
        private idGenerator: IdGenerator
    ) {}    

    public signup = async (input: InputSignup): Promise<OutputSignup> => {
        const { name, email, password } = input
        
        if (typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        const hashPassword = await this.hashManager.manager(password)

        const id = this.idGenerator.generateid()

        const newUserr = new User(
            id,
            name,
            email,
            hashPassword,
            USER_ROLES.NORMAL, 
            new Date().toISOString()
        )

        const newUserrDB = newUserr.toDBModel()
        await this.userDatabase.insertUser(newUserrDB)

        const payload: TokenPayload = {
            id: newUserr.getId(),
            name: newUserr.getName(),
            role: newUserr.getRole()
        }

        const token = this.tokenMananger.createTokenload(payload)

        const out: OutputSignup = {
            message: "Cadastro realizado com sucesso",
            token
        }

        return out
    }

    public login = async (input: InputLogin): Promise<OutputLogin> => {
        const { email, password } = input

        if (typeof email !== "string") {
            throw new Error("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new Error("'password' deve ser string")
        }

        const userDB = await this.userDatabase.findUserByEmail(email)

        if (!userDB) {
            throw new NotFoundError("'email' não encontrado")
        }

        // if (password !== userDB.password) {
        //     throw new BadRequestError("'email' ou 'password' incorretos")
        // }

        const okPassword = await this.hashManager.comparehash(password, userDB.password)
     
        if(!okPassword){
            throw new BadRequestError("Email ou senha incorretos!")
        }
        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        )

        const tpayload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        const token = this.tokenMananger.createTokenload(tpayload)


        const loutput: OutputLogin = {
            message: "Login realizado com sucesso",
            token
        }

        return loutput
    }
}