import { auth } from "@devlinks/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import LinksPageClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function LinksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return <LinksPageClient />;
}
