import { UserModel } from "../types"

export interface InputGetUsers {
    q: unknown,
    token: string | undefined
}

export type OutputGetUsers = UserModel[]

export interface InputSignup {
    name: unknown,
    email: unknown,
    password: unknown
}  

export interface OutputSignup {
    message: string,
    token: string
}

export interface InputLogin {
    email: unknown,
    password: unknown
}

export interface OutputLogin {
    message: string,
    token: string
}