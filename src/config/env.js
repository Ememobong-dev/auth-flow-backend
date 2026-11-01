import { z } from "zod";
import "dotenv/config";

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .max(65535, "Port number cannot be larger than 65535")
    .default(4000),

  MONGODB_URI: z.string().trim().min(1, "MONGODB_URL is required"),

  CORS_ORIGIN: z
    .string()
    .trim()
    .min(1, "CORS_ORIGIN is required")
    .default("http://localhost:3000"),

  CLIENT_URL: z
    .string()
    .trim()
    .url("CLIENT_URL must be a valid URL")
    .default("http://localhost:3000"),

  JWT_ACCESS_SECRET: z.string().trim().min(32, "JWT_ACCESS_SECRET is required"),

  JWT_ACCESS_SECRET_EXPIRE: z.string().trim().default("15m"),

  RESET_PASSWORD_EXPIRES_IN_MINUTES:  z.coerce.number().int().positive().default(15),


  SMTP_HOST: z.string().trim().min(1, "SMTP HOST cannot be empty"),
  
  SMTP_PORT: z.coerce.number().int().positive().default(587),

  SMTP_SECURE: z
    .string()
    .trim()
    .toLowerCase()
    .default("false")
    .transform((value) => value === "true"),

  SMTP_USER: z.string().trim().min(1, "SMTP USER cannot be empty"),

  SMTP_PASSWORD: z.string().trim().min(1, "SMTP PASSWORD cannot be empty"),
  
  MAIL_FROM: z.string().trim().min(1, "MAIL FROM cannot be empty"),
});

const validationData = environmentSchema.safeParse(process.env);

if (!validationData.success) {
  const errors = validationData.error.issues
    .map((issue) => {
      const field = issue.path.join(".") || "environment";
      return `${field} : ${issue.message}`;
    })
    .join("\n");

  console.error(`An error occured in the environment \n ${errors}`);
  process.exit(1);
}

export const env = Object.freeze(validationData.data);
