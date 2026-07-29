import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE, // Start unencrypted, upgrade via STARTTLS
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});


function escapeHtml(unsafeString) {
    return unsafeString
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

const createResetLink = (resetToken) => {
  const clientUrl = env.CLIENT_URL.replace(/\/+$/, "")
  return `${clientUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;
};

export const createResetEmail = (clientEmail, clientFirstName, resetToken) => {
  const requestTokenLink = createResetLink(resetToken);

  const safeRecipientName = escapeHtml(clientFirstName);
  const safePasswordResetUrl = escapeHtml(requestTokenLink);


  return transporter.sendMail({
    from: env.MAIL_FROM,
    to: clientEmail,
    subject: "Reset Mail Request",
    text: [
      `Hello ${clientFirstName}`,
      " ",
      `We received a request to reset the password for your Auth Flow account`,
      " ",
      `Click the link to set up a new password: ${requestTokenLink}`,
      " ",
      `Note: This password reset link will expire in ${env.RESET_PASSWORD_EXPIRES_IN_MINUTES} minutes.`,
      " ",
      `If you didn't request a password reset, you can safely ignore this email—your password will remain unchanged, and your account stays secure.`,
      " ",
      `Thanks`,
      " ",
      `The Auth Flow Team`,
    ].join(" \n "),
    html: `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>Reset your password</title>
      </head>

      <body>
        <p>Hello ${safeRecipientName},</p>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          <a href="${safePasswordResetUrl}">
            Reset your password
          </a>
        </p>

        <p>
          This link will expire in
          ${env.RESET_PASSWORD_EXPIRES_IN_MINUTES}
          minutes.
        </p>

        <p>
          If you did not request a password reset,
          you can ignore this email.
        </p>
      </body>
    </html>
  `,
  });
};
