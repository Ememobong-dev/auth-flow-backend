import jwt from "jsonwebtoken";
import { env } from "./../config/env.js";
import { createHash, randomBytes } from "node:crypto";

export const generateAccessToken = (userId) => {
  return jwt.sign({}, env.JWT_ACCESS_SECRET, {
    algorithm: "HS256",
    expiresIn: env.JWT_ACCESS_SECRET_EXPIRE,
    subject: userId.toString(),
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: ["HS256"] });
};

export const hashResetToken = (token) => {
    const hash = createHash("sha256")
        .update(token)
        .digest("hex")
    return hash
}

export const generateRequestResetPassword = () => {

    const resetToken = randomBytes(32).toString("hex")
    const resetTokenHash = hashResetToken(resetToken);
    const resetExpiresAt = new Date(
        Date.now() + env.RESET_PASSWORD_EXPIRES_IN_MINUTES * 60 * 1000
    )
    return {
        resetToken,
        resetTokenHash,
        resetExpiresAt
    }

}
