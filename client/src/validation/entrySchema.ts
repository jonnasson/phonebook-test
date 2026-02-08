import { z } from "zod";
import { PHONE_REGEX, PHONE_FORMAT_ERROR } from "./shared";

export { PHONE_REGEX };

export const entrySchema = z.object({
  name: z.string().trim().min(1, "Name darf nicht leer sein."),
  phone: z
    .string()
    .trim()
    .min(1, "Telefonnummer darf nicht leer sein.")
    .regex(PHONE_REGEX, PHONE_FORMAT_ERROR),
});

export type EntryInput = z.infer<typeof entrySchema>;
