import { env } from "@devlinks/env/server";
import { drizzle } from "drizzle-orm/node-postgres";
export { eq } from "drizzle-orm";
import * as schema from "./schema/index";

export const db = drizzle(env.DATABASE_URL, { schema });