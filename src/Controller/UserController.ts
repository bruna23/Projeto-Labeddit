import { Request, Response } from 'express'
import { UserBusiness } from '../Business/Userbusiness';

export class UserController{

public createUsers = async (req:Request, res:Response)=>{

try{ 
        const {  name, email, password } = req.body
        const user = {
          name, 
          email, 
          password 
      } 

      const userBusiness = new UserBusiness()

      const active = await userBusiness.businessUsers(user)

      res.status(201).send(`created ${active}`)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 201) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
       }

    }}