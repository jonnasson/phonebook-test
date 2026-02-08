import { z } from "zod";

export { PASSWORD_RULES, type PasswordRule } from "./shared";

export const authSchema = z.object({
  username: z.string().min(1, "Benutzername darf nicht leer sein."),
  password: z.string().min(1, "Passwort darf nicht leer sein."),
});

export type AuthInput = z.infer<typeof authSchema>;
