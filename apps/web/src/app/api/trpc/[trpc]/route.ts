import { createContext } from "@devlinks/api/context";
import { appRouter } from "@devlinks/api/routers/index";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const allowedOrigin = process.env.CORS_ORIGIN || "*";
const corsHeaders = new Headers({
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
});

export async function handler(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError({ error, path }) {
      console.error(`[tRPC Error] on ${path}:`, error);
    },
  });

  for (const [key, value] of corsHeaders.entries()) {
    response.headers.set(key, value);
  }

  return response;
}

export { handler as GET, handler as POST, handler as OPTIONS };