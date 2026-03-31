import type { Request, Response } from "express";
import { db } from "../../db/index.js";
import { eq } from 'drizzle-orm'
import type { UserTokenPayload } from "../auth/utils/token.js";
import { usersTable } from "../../db/schema.js";

class UserController{
    public async handleMe(req: Request, res: Response) {
            //@ts-ignore
            const { id } = req.user! as UserTokenPayload
            
            const [userResult] = await db.select().from(usersTable).where(eq(usersTable.id, id))
    
            return res.json({
                firstName: userResult?.firstName,
                lastName: userResult?.lastName,
                email: userResult?.email
            })
        }
}

export default UserController