import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import  { success, z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { request } from "http";


const usernameQueryschema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zod
      const result = usernameQueryschema.safeParse(queryParam)
      
      //console.log(result) 

      if(!result.success){
        const usernameError = result.error.format().username?._errors || []

        return Response.json({
            success: false,
            message: usernameError?.length > 0 
            ? usernameError.join(', ')
            : 'Invalid query parameters'
        }, { status: 400})
      }

      const {username} = result.data

     const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

     if(existingVerifiedUser){
        return Response.json({
            success: false,
            message: "Username is already taken"
        }, {status : 500})
     }
     return Response.json({
        success: true,
        message: "Username is unique"
     }, {status: 201})

    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {
            status: 500
        })
    }

}