import { PrismaPg } from "@prisma/adapter-pg";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { i18n } from "@better-auth/i18n";
import { MailtrapClient } from "mailtrap";

import { PrismaClient } from "../../prisma/generated/client";

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
  plugins: [
    admin(),
    i18n({
      defaultLocale: "it",
      translations: {
        it: {
          USER_NOT_FOUND: "Utente non trovato",
          INVALID_EMAIL_OR_PASSWORD: "Email o password non validi",
          INVALID_EMAIL: "Email non valida",
          INVALID_PASSWORD: "Password non valida",
          CREDENTIAL_ACCOUNT_NOT_FOUND: "Account non trovato",
          EMAIL_NOT_VERIFIED: "Email non verificata",
          SESSION_EXPIRED: "Sessione scaduta",
          INTERNAL_SERVER_ERROR: "Errore interno del server",
          UNABLE_TO_CREATE_USER: "Impossibile creare l'utente",
          UNABLE_TO_CREATE_SESSION: "Impossibile creare la sessione",
          ACCOUNT_ALREADY_LINKED_TO_DIFFERENT_USER: "Account già collegato a un altro utente",
          UNABLE_TO_LINK_ACCOUNT: "Impossibile collegare l'account",
          ACCOUNT_NOT_LINKED: "Account non collegato",
        },
      },
    }),
  ],
});
