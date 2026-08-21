import { UserRole } from "@prisma/client";
declare global {
    namespace express {
        interface Request {
            user?: {
                userId: string
                role: UserRole;
            };
        }
    }
}