import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#0D0D0D] p-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
        <Icon className="w-7 h-7 text-white/40" />
      </div>
      <h3 className="text-base font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-white/40 max-w-sm mx-auto mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}
          className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
