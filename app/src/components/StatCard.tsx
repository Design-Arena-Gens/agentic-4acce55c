import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  footer?: ReactNode;
};

export function StatCard({ title, value, footer }: StatCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-white/60 bg-white/70 p-6 text-slate-900 shadow-[0_12px_32px_rgba(15,23,42,0.1)] backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
      <div>
        <h3 className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          {title}
        </h3>
        <p className="mt-3 text-4xl font-light">{value}</p>
      </div>
      {footer ? <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">{footer}</div> : null}
    </div>
  );
}
