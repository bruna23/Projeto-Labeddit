export interface User {
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLES,
    created_at: string
}

export interface UserModel {
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLES,
    createdAt: string
}
export interface Token {
    id: string,
    name: string,
    role: USER_ROLES
}

export interface TPosts{
        id: string,
        creator_id: string,
        content: string,
        likes: number,
        dislikes: number,
        created_at: string,
        updated_at: string
    
    }
    export interface postModels {
        id: string,
        content: string,
        likes: number,
        dislikes: number,
        createdAt: string,
        updatedAt: string
    
    }
    export interface TLikesdislikes{
        user_id: string,
        post_id: string,
    }
    
    export interface NameCreator extends postModels {
        creator_name: string
    }

    export enum USER_ROLES {
        NORMAL = "NORMAL",
        ADMIN = "ADMIN"
    }