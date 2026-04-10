import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, { // এখানে তৈরি করা 'prisma' ইন্সট্যান্সটি দিন
        provider: "postgresql",
    }),
    emailAndPassword: { 
        enabled: true, 
    }, 
});