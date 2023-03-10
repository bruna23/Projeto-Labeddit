import { v4 } from 'uuid'

export class IdGenerator {
    public generateid = (): string => {
        return v4()
    }
}