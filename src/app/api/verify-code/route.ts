import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request:Request){
   await dbConnect()

   try {
       const {username, code} = await request.json()
         const decodedUsername  = decodeURIComponent(username)
         const user  = await UserModel.findOne({
            username: decodedUsername
         })
         if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 500})
         }

         //age user mila to 

const isCodevalid = user.verifyCode?.toLowerCase() === code?.toLowerCase() 
          const iscodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

if(isCodevalid && iscodeNotExpired){
              user.isVerified = true
              await user.save()
              console.log(`✅ User ${decodedUsername} verified successfully!`);

             return Response.json({
                 success: true,
                 message: "Account verify successfully"
             }, {status: 200})
         }else if(!iscodeNotExpired){
            return Response.json({
                success: false,
                message: "verification code is Expired please Signup again to get a new code"
            }, {status: 400})
         }else{
            return Response.json({
                success: false,
                message: "Incorrect Verification code"
            }, {status: 404})
         }


   } catch (error) {
    console.error("Error verifying user:", error)
    return Response.json({
        success: false,
        message: "Error verifying user"
    }, {status: 500})
   }
}