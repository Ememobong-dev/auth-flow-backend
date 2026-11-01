import z from "zod";

const firstNameSchema = z
  .string({ error: "First name is required" })
  .trim()
  .min(1, "First Name can not be empty")
  .max(50, "First name cannot exceed 50 characters");

const lastNameSchema = z
  .string({ error: "First name is required" })
  .trim()
  .min(1, "First Name can not be empty")
  .max(50, "First name cannot exceed 50 characters");

const emailSchema = z
  .string({ error: "Email is required" })
  .trim()
  .toLowerCase()
  .min(1, "Email can not be empty")
  .max(254, "Email can not exceed 254 characters")
  .pipe(z.email({ error: "Please enter a valid email address" }));

const newPasswordSchema = z
  .string({ error: "Password is required" })
  .trim()
  .min(8, "minimum length is 8 charcters")
  .max(128, "Password cannot exceed 128 characters")
  .refine((password) => Buffer.byteLength(password, "utf8") <= 72, {
    message: "Password cannot exceed 72 bytes",
  });

const confirmPasswordSchema = z
  .string({ error: "Confirm Password is required" })
  .trim()
  .min(8, "minimum length is 8 charcters")
  .max(128, "Password cannot exceed 128 characters");

const loginPasswordSchema = z
  .string({ error: "Login Password is required" })
  .trim()
  .min(1, "minimum length is 1 charcters")
  .max(128, "Password cannot exceed 128 characters");

const passwordResetTokenSchema = z
  .string({ error: "Reset token is required" })
  .trim()
  .length(64, "Invalid token")
  .regex(/^[a-f0-9]+$/i, "Invalid password reset token");

const withConfirmationOfPassword = (additionalFields = {}) =>
  z
    .object({
      ...additionalFields,
      password: newPasswordSchema,
      confirmPassword: confirmPasswordSchema,
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password do not match",
      path: ["confirmPassword"],
    })
    .transform((data) => {
      const validatedData = { ...data };

      delete validatedData.confirmPassword;

      return validatedData;
    });

const registerBody = withConfirmationOfPassword({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
});

const loginBody = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
}).strict();

const resetPasswordRequestBody = z.object({
  email: emailSchema,
}).strict();

const resetPasswordBody = withConfirmationOfPassword();

export const registerSchema = z.object({
  body: registerBody,
});

export const loginSchema = z.object({
  body: loginBody,
});

export const resetPasswordRequestSchema = z.object({
  body: resetPasswordRequestBody,
});

export const resetPasswordSchema = z.object({
  params: z.object({
    token: passwordResetTokenSchema,
  }),
  body: resetPasswordBody,
});
