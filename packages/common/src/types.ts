import { email, string, z } from "zod"


export const CreateUserSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.email().min(4).max(20),
    password: z.string().min(4).max(16),
})

export const SigninSchema = z.object({
    email: z.email().min(4).max(20),
    password: z.string().min(4).max(16),
})

export const CreateRoomSchema = z.object({
    slug: z.string().min(3).max(20),
})