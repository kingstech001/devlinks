import PreviewPageClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const params = await searchParams;

  return <PreviewPageClient sharedUserId={params.userId ?? null} />;
}
