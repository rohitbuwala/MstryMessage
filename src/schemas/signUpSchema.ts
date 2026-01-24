import { email, z } from "zod"; 

export const usernameValidation = z
.string()
.min(3, "Username must be atleast 3 characters")
.max(15, "Username must be no more than 15 characters")
.regex(/^[a-zA-Z0-9_]+$/, "Username must contain only letters, numbers, and underscores")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "password must be atleast 6 characters"}),
    // validation: z.string().min(6, {message: "password must be same "})

})