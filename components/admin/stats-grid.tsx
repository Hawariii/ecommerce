import type { DashboardStat } from "@/types";
import { Card } from "@/components/ui/card";

export function StatsGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <p className="text-sm text-slate-500">{stat.label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{stat.value}</p>
          <p className="mt-2 text-sm text-slate-500">{stat.description}</p>
        </Card>
      ))}
    </div>
  );
}
