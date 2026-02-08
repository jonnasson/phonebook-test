import type { StandaloneServerContextFunctionArgument } from "@apollo/server/standalone";
import { verifyToken } from "./auth.js";

export interface Context {
  userId: string | null;
}

export async function createContext({ req }: StandaloneServerContextFunctionArgument): Promise<Context> {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  const payload = token ? verifyToken(token) : null;

  return {
    userId: payload?.userId ?? null,
  };
}
