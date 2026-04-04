import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { admin } from "better-auth/plugins";
import { MailtrapClient } from "mailtrap";

const adapter = new PrismaPg({
  connectionString: import.meta.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const mailtrap = new MailtrapClient({
  token: import.meta.env.MAILTRAP_API_TOKEN,
});

export const auth = betterAuth({
  baseURL: import.meta.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await mailtrap.send({
        to: [{ email: user.email, name: user.name }],
        from: {
          email: import.meta.env.MAILTRAP_SENDER_EMAIL,
          name: import.meta.env.MAILTRAP_SENDER_NAME,
        },
        subject: "Verifica il tuo indirizzo email",
        html: `<p>Clicca <a href="${url}">qui</a> per verificare il tuo indirizzo email.</p>`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: import.meta.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_AUTH_CLIENT_SECRET,
    },
  },
  user: {
    deleteUser: { enabled: true },
    changeEmail: { enabled: true },
  },
  plugins: [admin()],
});
