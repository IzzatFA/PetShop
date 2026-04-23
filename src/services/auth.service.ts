import bcrypt from "bcrypt";
import { authRepository } from "@/repositories/auth.repository";

export const authService = {
    registerUser: async (name: string, email: string, passwordOrigin: string) => {
        const existingUser = await authRepository.findUserByEmail(email);

        if (existingUser) {
            throw new Error("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(passwordOrigin, 10);

        return await authRepository.createUser(name, email, hashedPassword, "BUYER");
    }
};
