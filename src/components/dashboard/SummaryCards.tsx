import { useEffect, useState } from "react";
import { ListChecks, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { api } from "../../services/api";

export default function SummaryCards() {
  const [summary, setSummary] = useState<{ total_tests: number; passed: number; failed: number; blocked: number; pass_rate: number } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { api.dashboard.summary().then(setSummary).catch(e => setError(e.message)); }, []);
  const cards = [
    { id: "total-tests", label: "Total Tests", value: summary?.total_tests ?? "—", icon: ListChecks, accent: "bg-brand-50 text-brand-700", trend: "Current test cases" },
    { id: "passed-tests", label: "Passed", value: summary?.passed ?? "—", icon: CheckCircle2, accent: "bg-success-50 text-success-600", trend: `${summary?.pass_rate ?? 0}% pass rate` },
    { id: "failed-tests", label: "Failed", value: summary?.failed ?? "—", icon: XCircle, accent: "bg-danger-50 text-danger-600", trend: "Latest results" },
    { id: "blocked-tests", label: "Blocked", value: summary?.blocked ?? "—", icon: ShieldAlert, accent: "bg-warning-50 text-warning-600", trend: "Latest results" },
  ];
  return <div id="summary-cards" data-testid="summary-cards" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" aria-busy={!summary && !error}>
    {error && <p role="alert" className="col-span-full text-sm text-red-700">Could not load dashboard summary: {error}</p>}
    {cards.map(card => <div key={card.id} id={`summary-card-${card.id}`} data-testid={`summary-card-${card.id}`} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start justify-between"><div><p className="text-xs font-medium text-slate-500">{card.label}</p><p data-testid={`summary-card-${card.id}-value`} className="text-2xl font-bold text-slate-900 mt-1.5">{card.value}</p><p className="text-[11px] text-slate-400 mt-1.5">{card.trend}</p></div><div className={`h-10 w-10 rounded-lg flex items-center justify-center ${card.accent}`}><card.icon className="h-5 w-5" aria-hidden="true" /></div></div>)}
  </div>;
}
