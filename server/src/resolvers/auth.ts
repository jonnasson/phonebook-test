import { GraphQLError } from "graphql";
import { validatePassword as getFailedRules } from "../validation.js";
import { users } from "../db.js";
import { hashPassword, comparePassword, createToken } from "../auth.js";

function assertPasswordStrong(password: string) {
  const failed = getFailedRules(password);
  if (failed.length > 0) {
    throw new GraphQLError(`Passwort zu schwach: ${failed.map((r) => r.label).join(", ")}`);
  }
}

export const authResolvers = {
  Query: {
    async checkUsernameAvailable(_: unknown, args: { username: string }) {
      const existing = await users.findOne({ username: args.username });
      return !existing;
    },
  },
  Mutation: {
    async signup(_: unknown, args: { username: string; password: string }) {
      assertPasswordStrong(args.password);
      const existing = await users.findOne({ username: args.username });
      if (existing) {
        throw new GraphQLError("Benutzername bereits vergeben");
      }

      const hashed = await hashPassword(args.password);
      const id = crypto.randomUUID();
      await users.insertOne({
        _id: id,
        username: args.username,
        password: hashed,
        createdAt: new Date(),
      });

      return { token: createToken(id) };
    },

    guestLogin() {
      return { token: createToken("guest") };
    },

    async login(_: unknown, args: { username: string; password: string }) {
      const user = await users.findOne({ username: args.username });

      if (!user) {
        throw new GraphQLError("Ungültige Anmeldedaten");
      }

      const valid = await comparePassword(args.password, user.password);
      if (!valid) {
        throw new GraphQLError("Ungültige Anmeldedaten");
      }

      return { token: createToken(user._id) };
    },
  },
};
