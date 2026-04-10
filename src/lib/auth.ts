import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Prisma } from "../../generated/prisma/client";
// If your Prisma file is located elsewhere, you can change the path


export const auth = betterAuth({
    database: prismaAdapter(Prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: { 
    enabled: true, 
  }, 
});