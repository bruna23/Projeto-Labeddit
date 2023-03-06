import { UserTypes } from "../types"

export interface InputGetUsers {
    q: string
}

export type OutputGetUsers = UserTypes[]

export interface InputSignup {
    name: unknown,
    email: unknown,
    password: unknown
}

export interface OutputSignup {
    message: string,
    token: string
}

export interface OutputLogin {
    message: string,
    token: string
}

export interface InputLogin {
    email: unknown,
    password: unknown
}
