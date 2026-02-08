import { GraphQLError } from "graphql";
import { PHONE_REGEX, PHONE_FORMAT_ERROR } from "../validation.js";
import type { Context } from "../context.js";
import { entries as entriesCollection } from "../db.js";

function requireAuth(userId: string | null) {
  if (!userId) throw new GraphQLError("Nicht authentifiziert");
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toEntry(d: { _id: string; name: string; phone: string }) {
  return { id: d._id, name: d.name, phone: d.phone };
}

const CASE_INSENSITIVE_COLLATION = { locale: "en", strength: 2 } as const;

export const phonebookResolvers = {
  Query: {
    async entries(_: unknown, __: unknown, { userId }: Context) {
      requireAuth(userId);
      const docs = await entriesCollection
        .find({})
        .collation({ locale: "de" })
        .sort({ name: 1 })
        .toArray();
      return docs.map(toEntry);
    },

    async search(_: unknown, args: { term: string }, { userId }: Context) {
      requireAuth(userId);
      const term = args.term.trim();
      if (!term) return [];

      // $text search for word-based prefix matching
      let docs = await entriesCollection
        .find({ $text: { $search: term } }, { projection: { score: { $meta: "textScore" } } })
        .sort({ score: { $meta: "textScore" } })
        .toArray();

      // Fallback to $regex for mid-word/substring matches
      if (docs.length === 0) {
        const escaped = escapeRegex(term);
        docs = await entriesCollection
          .find({
            $or: [
              { name: { $regex: escaped, $options: "i" } },
              { phone: { $regex: escaped, $options: "i" } },
            ],
          })
          .sort({ name: 1 })
          .toArray();
      }

      return docs.map(toEntry);
    },

    async checkDuplicate(_: unknown, args: { name: string; phone: string }, { userId }: Context) {
      requireAuth(userId);
      const name = args.name.trim();
      const phone = args.phone.trim();
      const doc = await entriesCollection.findOne(
        { name, phone },
        { collation: CASE_INSENSITIVE_COLLATION },
      );
      return !!doc;
    },
  },
  Mutation: {
    async addEntry(
      _: unknown,
      args: { input: { name: string; phone: string } },
      { userId }: Context,
    ) {
      requireAuth(userId);

      const name = args.input.name.trim();
      const phone = args.input.phone.trim();

      if (!name) throw new GraphQLError("Name darf nicht leer sein.");
      if (!phone) throw new GraphQLError("Telefonnummer darf nicht leer sein.");
      if (!PHONE_REGEX.test(phone)) throw new GraphQLError(PHONE_FORMAT_ERROR);

      const id = crypto.randomUUID();
      try {
        await entriesCollection.insertOne({ _id: id, name, phone });
      } catch (err: unknown) {
        if (err instanceof Error && "code" in err && (err as { code: number }).code === 11000) {
          throw new GraphQLError(
            "Ein Eintrag mit diesem Namen und dieser Nummer existiert bereits.",
          );
        }
        throw err;
      }

      return { id, name, phone };
    },
  },
};
