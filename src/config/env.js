import { z } from "zod";
import "dotenv/config"

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

  CORS_ORIGIN: z.string().trim().min(1, "CORS_ORIGIN is required"),
});

const validationData = environmentSchema.safeParse(process.env);

if (!validationData.success) {
  const errors = validationData.error.issues.map((issue) => {
    const field = issue.path.join(".") || "environment";
    return `${field} : ${issue.message}`;
  })
  .join("\n");

  console.error(`An error occured in the environment \n ${errors}`)
  process.exit(1);
}


export const env = Object.freeze(validationData.data)
