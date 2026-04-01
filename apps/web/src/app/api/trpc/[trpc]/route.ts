import { createContext } from "@devlinks/api/context";
import { appRouter } from "@devlinks/api/routers/index";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // ← add this line


function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError({ error, path }) {
      console.error(`[tRPC Error] on ${path}:`, error);
    },
  });
}

export { handler as GET, handler as POST };