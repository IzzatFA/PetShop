import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";

type Role = "ADMIN" | "BUYER" | "SELLER" | "CUSTOMER" | "SUSPENDED";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: Role;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        role: Role;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: Role;
        id: number | string;
    }
}
