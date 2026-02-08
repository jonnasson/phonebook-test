export interface PasswordRule {
  readonly key: string;
  readonly label: string;
  readonly pattern: RegExp;
}

export const PASSWORD_RULES: readonly PasswordRule[] = [
  { key: "minLength", pattern: /.{8,}/, label: "Mindestens 8 Zeichen" },
  { key: "uppercase", pattern: /[A-Z]/, label: "Mindestens ein Großbuchstabe" },
  { key: "lowercase", pattern: /[a-z]/, label: "Mindestens ein Kleinbuchstabe" },
  { key: "digit", pattern: /\d/, label: "Mindestens eine Zahl" },
  { key: "special", pattern: /[^A-Za-z0-9]/, label: "Mindestens ein Sonderzeichen" },
];

export function validatePassword(password: string): PasswordRule[] {
  return PASSWORD_RULES.filter((r) => !r.pattern.test(password));
}

export const PHONE_REGEX = /^\d{4}\/\d{7,8}$/;
export const PHONE_FORMAT_ERROR = "Format: XXXX/XXXXXXX (z.B. 0171/4527294)";
