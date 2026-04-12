import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

import nodemailer from "nodemailer";



// nodemailer 
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    trustedOrigins : [process.env.APP_URL || "http://localhost:4000"],

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false,
            },
            phone: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            }
        }
    },

    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification:true
    },

   emailVerification:{
    sendOnSignUp:true,
    autoSignInAfterVerification:true,
     sendVerificationEmail: async ( { user, url, token }, request) => {
     console.log({url, token, user})
     const verificationLink = `${process.env.APP_URL}/verify-email?token=${token}`;

  try{
      const info = await transporter.sendMail({
    from: '"Prisma Blog Team" <prisma@blog.com>', // sender address
    to: user.email, // list of recipients
    subject: "Hello", // subject line
    text: "Hello world?", // plain text body
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #FAFAF8; padding: 20px; text-align: center; border-bottom: 2px solid #e0e0e0;">
            <h1 style="color: #333; margin: 0;">Prisma Blog</h1>
        </div>
        <div style="padding: 30px; line-height: 1.6; color: #555;">
            <h2 style="color: #333;">হ্যালো!</h2>
            <p>আমাদের প্ল্যাটফর্মে যোগ দেওয়ার জন্য আপনাকে ধন্যবাদ। আপনার অ্যাকাউন্টটি সক্রিয় করতে নিচের বাটনে ক্লিক করে আপনার ইমেল ঠিকানাটি ভেরিফাই করুন:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">ইমেল ভেরিফাই করুন</a>
            </div>
            <p>যদি উপরের বাটনটি কাজ না করে, তবে নিচের লিঙ্কটি কপি করে আপনার ব্রাউজারে পেস্ট করুন:</p>
            <p style="word-break: break-all; font-size: 12px; color: #888;">${verificationLink}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999;">আপনি যদি এই অনুরোধটি না করে থাকেন, তবে দয়া করে এই ইমেলটি উপেক্ষা করুন।</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #aaa;">
            © ${new Date().getFullYear()} Prisma Blog Team. All rights reserved.
        </div>
    </div>
    `, // HTML body
  });
  }
  catch(error){
    console.error(error);
    throw error;
  }

//   console.log("Message sent: %s", info.messageId);
    },
   },
   socialProviders: {
        google: { 
            prompt:"select_account consent", 
            accessType: "offline", 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        },
    }
   

});