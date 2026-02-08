import { MongoClient, Collection } from "mongodb";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface UserDoc {
  _id: string;
  username: string;
  password: string;
  createdAt: Date;
}

export interface EntryDoc {
  _id: string;
  name: string;
  phone: string;
}

export let users: Collection<UserDoc>;
export let entries: Collection<EntryDoc>;

function findJsonFile(): string | null {
  const locations = [process.env.JSON_PATH, join(__dirname, "..", "telefonbuch-data.json")].filter(
    Boolean,
  ) as string[];

  for (const loc of locations) {
    if (existsSync(loc)) return loc;
  }
  return null;
}

export async function initDb() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db("telefonbuch");
  users = db.collection<UserDoc>("users");
  entries = db.collection<EntryDoc>("phonebook_entries");

  await users.createIndex({ username: 1 }, { unique: true });
  await entries.createIndex({ name: "text" });
  await entries.createIndex(
    { name: 1, phone: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } },
  );
  await entries.createIndex({ name: 1 }, { collation: { locale: "de" } });

  await seedDb();
  console.log("Connected to MongoDB");
}

async function seedDb() {
  const count = await entries.countDocuments();
  if (count > 0) return;

  const jsonPath = findJsonFile();
  if (!jsonPath) {
    console.warn("Seed file not found in any known location");
    return;
  }

  const data = JSON.parse(readFileSync(jsonPath, "utf-8")) as {
    name: string;
    phone: string;
  }[];

  const docs: EntryDoc[] = data.map((entry) => ({
    _id: crypto.randomUUID(),
    name: entry.name,
    phone: entry.phone,
  }));

  await entries.insertMany(docs);
  console.log(`Seeded ${data.length} phonebook entries from ${jsonPath}`);
}
