import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificatinEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { ota } from "zod/locales";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'MstryMessage | Verification code',
        react: VerificationEmail({username, otp: verifyCode}),
});
        return {success: true, message: "Verication Email send successfully"}
    } catch (emailerror) {
        console.error("Error sending verification Email", emailerror)
        return {success: false, message: "Failed to verification email"}
    }
}