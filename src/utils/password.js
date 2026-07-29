import bcrypt from "bcrypt";

const SALT_ROUND = 12;

export const hashPassword = async (plainPassword) => {
   return await bcrypt.hash(plainPassword, SALT_ROUND)
}


export const confirmPassword = async (plainPassword, hashedPassword) => {
    if(!plainPassword || !hashPassword) return false;

    return await bcrypt.compare(plainPassword, hashPassword)
}