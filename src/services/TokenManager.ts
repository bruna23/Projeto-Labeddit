import jwt from 'jsonwebtoken'
import dotenv from 'dotenv' 
import { TokenPayload } from '../types'

dotenv.config()

export class TokenManagerService {

    public createTokenload = (payload: TokenPayload): string => {
        const tokenload = jwt.sign(
            payload,
            process.env.JWT_KEY as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )

        return tokenload
    }

    public getPayloadt = (token: string): TokenPayload | null => {
        try {
            const tpayload = jwt.verify(
                token,
                process.env.JWT_KEY as string
            )

            return tpayload as TokenPayload

        } catch (error) {
            return null
        }
    }
}