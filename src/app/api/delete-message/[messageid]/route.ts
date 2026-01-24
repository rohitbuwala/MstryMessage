import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';

//import { authOptions } from '../auth/[...nextauth]/options';

export async function DELETE(request: Request, {params}: {params: Promise<{messageid: string}>}) {
  const { messageid } = await params
  const messageId = messageid
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User; 

  if (!session || !user) {
    return Response.json(
      { success: false, 
        message: 'Not authenticated' },
      { status: 401 }
    );
  }
 
  try {
   const updateResult = await UserModel.updateOne(
      {_id: user._id},
      {$pull: {messages: {_id: messageId}}}
    )
    if(updateResult.modifiedCount === 0){
      return Response.json({
        success: false,
        message: "Message is not found or already delete"
      }, {status: 404})
    }

     return Response.json({
        success: true,
        message: "Message successfully delete"
      }, {status: 200})

  } catch (error) {
    console.error("Error in delete message route", error)
       return Response.json({
        success: false,
        message: "Error deleting message"
      }, {status: 500})
  }
}