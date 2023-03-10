import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

export class HashManager {
    public manager = async (plaintext: string) => {
        const roundabout = Number(process.env.BCRYPT_COST)
        const salt = await bcrypt.genSalt(roundabout)
        const hash = await bcrypt.hash(plaintext, salt)

        return hash
    }

    public comparehash = async (plaintext: string, hash: string) => {
        return bcrypt.compare(plaintext, hash)
    }
}