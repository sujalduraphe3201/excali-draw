import { Router } from "express"
import jwt from "jsonwebtoken"
import authMiddleware from "../middleware";
const router: Router = Router();
import { JWT_SECRET } from "@repo/backend-common/config"
import { prisma } from "@repo/db/db"
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types"

router.post("/signup", async (req, res) => {
    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect Inputs"
        })
        return;
    }

    try {
        const signup = await prisma.user.create({
            data: {
                name,
                email,
                password,
            }
        })
        const token = jwt.sign({
            // @ts-ignore
            userId: user.id
        }, JWT_SECRET, { expiresIn: '1h' });
        res.json(token)
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error })
    }

});


router.post("/signin", (req, res) => {
    const data = SigninSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect Inputs"
        })
        return;
    }
    try {


        const token = jwt.sign({
            // @ts-ignore
            userId: user.id
        }, JWT_SECRET, { expiresIn: '1h' });
        res.json(token)
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error })
    }



});

router.post("/room", authMiddleware, (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect Inputs"
        })
        return;
    }
})



export default router;