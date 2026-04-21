import nodemailer from "nodemailer";

const MAILPIT_HOST = process.env.MAILPIT_HOST || "127.0.0.1";
const MAILPIT_PORT = Number(process.env.MAILPIT_PORT || "1025");
const MAILPIT_FROM = process.env.MAILPIT_FROM || "no-reply@learnarcium.local";

declare global {
  var __learnarciumMailTransport: nodemailer.Transporter | undefined;
}

function createTransport() {
  return nodemailer.createTransport({
    host: MAILPIT_HOST,
    port: MAILPIT_PORT,
    secure: false,
  });
}

const transport = globalThis.__learnarciumMailTransport ?? createTransport();

if (process.env.NODE_ENV !== "production") {
  globalThis.__learnarciumMailTransport = transport;
}

export async function sendMail(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  return transport.sendMail({
    from: MAILPIT_FROM,
    ...options,
  });
}
