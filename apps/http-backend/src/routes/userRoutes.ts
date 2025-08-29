import { Router } from "express"
import jwt, { sign } from "jsonwebtoken"
import authMiddleware from "../middleware";
import { JWT_SECRET } from "@repo/backend-common/config"
import { prisma } from "@repo/db/db"
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types"
import bcrypt from "bcrypt"

const router: Router = Router();

router.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect Inputs"
        })
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(parsedData.data.password, salt);
        const user = await prisma.user.create({
            data: {
                username: parsedData.data?.username,
                email: parsedData.data?.email,
                password: hashedPass

            }
        })

        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({
            message: "Signin successful",
            user: { id: user.id, username: user.username, email: user.email },
            token,
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error })
    }

});


router.post("/signin", async (req, res) => {
    const signinData = SigninSchema.safeParse(req.body);
    if (!signinData.success) {
        res.json({
            message: "Incorrect Inputs"
        })
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: signinData.data.email,
            }
        })
        if (!user) {
            res.json({ message: "Email or password is incorrect" })
            return;
        }
        const comparePassword = await bcrypt.compare(signinData.data.password, user.password)
        if (!comparePassword) {
            res.status(400).json({
                message: "Email or password is incorrect"
            })
            return;
        }
        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({
            message: "Signin successful",
            user: { id: user.id, username: user.username, email: user.email },
            token,
        });
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