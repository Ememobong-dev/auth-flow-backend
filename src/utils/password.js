import bcrypt from "bcrypt";

const SALT_ROUND = 12;

export const hashPassword = async (plainPassword) => {
   return bcrypt.hash(plainPassword, SALT_ROUND)
}


export const confirmPassword = async (plainPassword, hashedPassword) => {
    if(!plainPassword || !hashedPassword) return false;

    return bcrypt.compare(plainPassword, hashedPassword)
}