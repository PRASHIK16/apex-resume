import AnalyzePageClient from "@/components/analysis/AnalyzePageClient";

export default async function AnalyzePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AnalyzePageClient id={id} />;
}