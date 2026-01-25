import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'User already exists with this email',
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.username = username; // Update username too!
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
        existingUserByEmail.isVerified = false; // Reset verification status
        await existingUserByEmail.save();
        console.log('User updated successfully:', {username: existingUserByEmail.username, email: existingUserByEmail.email, verifyCode});
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
      console.log('User saved successfully:', {username: newUser.username, email: newUser.email});
    }

// Send verification email
    console.log(`🔔 VERIFICATION CODE for ${username}: ${verifyCode}`);
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      console.log('⚠️ Email failed but user registered. Code:', verifyCode);
      // Continue with registration even if email fails for testing
    }

return Response.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
        verifyCode: verifyCode // Add code in response for testing
      },
      { status: 201 }
    );
} catch (error) {
    console.error('Error registering user:', error);
    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Error registering user',
      },
      { status: 500 }
    );
  }
}