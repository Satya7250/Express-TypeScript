import JWT from 'jsonwebtoken'

export interface UserTokenPayload {
    id: string
}

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables")
}

export function createUserToken(payload: UserTokenPayload) {
    const token = JWT.sign(payload, JWT_SECRET, {expiresIn: '1h'});
    return token
}

export function verifyUserToken(token: string) {
    try {
        const payload = JWT.verify(token, JWT_SECRET) as UserTokenPayload
        return { valid: true, payload }
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return { valid: false, expired: true }
        }
        return { valid: false, expired: false }
    }
}

