import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { InputLogin, InputSignup} from "../dtos/userDTO"

export class UserController {
    constructor(
        private userBusiness: UserBusiness
    ) {}

    public signup = async (req: Request, res: Response) => {
        try {
            const inputs: InputSignup = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
            
            const outputs = await this.userBusiness.signup(inputs)
    
            res.status(201).send(outputs)
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const inputs: InputLogin = {
                email: req.body.email,
                password: req.body.password
            }

            const outputs = await this.userBusiness.login(inputs)
    
            res.status(200).send(outputs)
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }
}