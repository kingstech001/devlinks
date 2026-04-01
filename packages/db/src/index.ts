import { env } from "@devlinks/env/server";
import { drizzle } from "drizzle-orm/node-postgres";
export { eq } from "drizzle-orm";
import * as schema from "./schema/index";

let _db: ReturnType<typeof drizzle> | null = null;

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    if (!_db) {
      _db = drizzle(env.DATABASE_URL, { schema });
    }
    return (_db as any)[prop];
  },
});