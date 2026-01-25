import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

//import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User; 

  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  console.log('=== GET MESSAGES DEBUG ===');
  console.log('User from session:', user);
  const userId = user._id;
  console.log('User ID:', userId);
  
  try {
    const foundUser = await UserModel.findById(userId);
    console.log('Found user:', foundUser?.username);
    console.log('Messages count:', foundUser?.messages?.length || 0);
    console.log('All messages:', foundUser?.messages);
    
    if (!foundUser) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { messages: foundUser.messages || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}