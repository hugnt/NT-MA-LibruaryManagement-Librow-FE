/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from "zod";
import { Role } from "../User";

const baseRegisterSchema = z.object({
    fullname: z.string()
        .nonempty({ message: "Fullname must not be empty!" })
        .max(50, "Fullname must not exceed 50 characters!"),

    email: z.string()
        .nonempty({ message: "Email must not be empty!" })
        .email("Invalid email format!"),

    username: z.string()
        .nonempty({ message: "Username must not be empty!" })
        .min(3, "Username must be at least 3 characters!")
        .max(50, "Username must not exceed 50 characters!"),

    password: z.string().optional(),
    passwordRetype: z.string().optional(),
    isCheckPassword: z.boolean().default(true),
});

const passwordValidation = (data: any, ctx: z.RefinementCtx) => {
    if (data.isCheckPassword) {
        if (!data.password || data.password.length < 8) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password must be at least 8 characters!",
                path: ["password"],
            });
        }

        if (!data.passwordRetype) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password confirmation must not be empty!",
                path: ["passwordRetype"],
            });
        }

        if (data.password !== data.passwordRetype) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Passwords do not match!",
                path: ["passwordRetype"],
            });
        }
    }
};

export const registerSchema = baseRegisterSchema.superRefine(passwordValidation);


export const userRequestSchema = baseRegisterSchema.extend({
    id: z.string().optional(),
    role: z.nativeEnum(Role),
}).superRefine(passwordValidation);



