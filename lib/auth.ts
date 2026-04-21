import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/mail";

function getBaseUrl() {
  return process.env.BETTER_AUTH_URL || "http://localhost:3000";
}

export const auth = betterAuth({
  appName: "Learn Arcium",
  baseURL: getBaseUrl(),
  secret: process.env.BETTER_AUTH_SECRET,
  database: db,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      void sendMail({
        to: user.email,
        subject: "Reset your Learn Arcium password",
        text: `Reset your password by opening this link:\n\n${url}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendMail({
        to: user.email,
        subject: "Verify your Learn Arcium account",
        text: `Verify your email address by opening this link:\n\n${url}`,
      });
    },
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        unique: true,
        sortable: true,
        transform: {
          input(value) {
            return typeof value === "string" ? value.trim().toLowerCase() : value;
          },
        },
      },
    },
  },
  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;
