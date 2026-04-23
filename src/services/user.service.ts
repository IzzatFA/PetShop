import { userRepository } from "@/repositories/user.repository";
import bcrypt from "bcrypt";

export const userService = {
    updateProfile: async (id: string, name?: string, password?: string) => {
        let updateData: any = {};

        if (name && name.trim().length > 0) {
            updateData.name = name;
        }

        if (password && password.trim().length > 0) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        if (Object.keys(updateData).length === 0) {
            return false;
        }

        return await userRepository.updateUser(id, updateData);
    },
    upgradeRole: async (id: string, targetRole: string, ktpUrl?: string) => {
        let updateData: any = { role: targetRole };
        if (ktpUrl) {
            updateData.ktpUrl = ktpUrl;
        }

        return await userRepository.updateUser(id, updateData);
    }
};
