import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express';

import { JWT_SECRET } from "@repo/backend-common/config";
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"] ?? "";
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    if (decoded) {
        req.userId = decoded.userId
        next();
    }

}
export default authMiddleware;