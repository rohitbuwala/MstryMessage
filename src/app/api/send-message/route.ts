import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";
import { success } from "zod";



export async function POST(request: Request){
    await dbConnect()

    const {username, content} = await request.json()

    try {
        
        const user = await UserModel.findOne({username})
        if(!user?.isAcceptingMessages){
            return Response.json({
                success: false,
                messages: "User is Not Accepting the messsage"
            },
            {status: 403})
        }

        const newMessage = {content, createdAt: new Date() }
        user.messages.push(newMessage as Message)

        return Response.json({
            success: true,
            message: "Message sent successfully"
        },
        {status: 200})

    } catch (error) {
        console.error("Error adding Message:", error)
        return Response.json({
            success: false,
            message: "internal server error"
        }, {status: 500})
    }
}
