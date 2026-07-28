import PageHeader from "@/components/shared/PageHeader";

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Settings" description="Manage your account and preferences" />
      <div className="rounded-xl border border-white/8 bg-[#111111] p-12 text-center">
        <p className="text-white/40 text-sm">Coming soon — Phase 2</p>
      </div>
    </div>
  );
}
