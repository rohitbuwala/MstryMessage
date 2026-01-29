import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions:NextAuthOptions = {
     providers : [
       CredentialsProvider({
         id: "credentials",
        name: "Credentials",
credentials: {
           identifier: { label: "Email/Username", type: "text" },
          password: { label: "Password", type: "password" }
          },
            async authorize(credentials: any): Promise<any>{
             if (!credentials?.identifier || !credentials?.password) {
                 throw new Error("Missing credentials");
             }

             await dbConnect()
             try {
               const trimmedIdentifier = credentials.identifier.trim();
               const user =  await UserModel.findOne({
                     $or: [
                         {email: trimmedIdentifier.toLowerCase()},
                         {username: trimmedIdentifier}
                     ]
                 }).select('+password +isVerified +verifyCode +verifyCodeExpiry')
                 if(!user){
                     throw new Error("No user found with this email or username")
                 }

                 if(!user.isVerified){
                     throw new Error("Please verify your account before login")
                 }

             const isPasswordCorrect =   await bcrypt.compare(credentials.password, user.password)
             if(isPasswordCorrect){
                return user
             }else{
                throw new Error("Incorrect password")
             }

            } catch ( error:any) {
                console.error("Auth error:", error);
                throw new Error(error.message || "Authentication failed")
            }

           }
       })
    ],
    callbacks: {
        async jwt({token, user}){
        if(user){
            token._id =user._id?.toString()
            token.isVerified = user.isVerified
            token.isAcceptingMessages = user.isAcceptingMessages
            token.username = user.username
        }
            return token
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }

            return session
        }
    },

    pages: {
         signIn: '/sign-in',
    },
    session: {
        strategy: "jwt"
    }, 
    secret: process.env.NEXTAUTH_SECRET

}