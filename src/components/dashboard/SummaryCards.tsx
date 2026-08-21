import { ListChecks, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { mockTests } from "../../data/mockTests";

const total = mockTests.length;
const passed = mockTests.filter((t) => t.status === "Passed").length;
const failed = mockTests.filter((t) => t.status === "Failed").length;
const blocked = mockTests.filter((t) => t.status === "Blocked").length;

const cards = [
  { id: "total-tests", label: "Total Tests", value: total, icon: ListChecks, accent: "bg-brand-50 text-brand-700", trend: "+4 this week" },
  { id: "passed-tests", label: "Passed", value: passed, icon: CheckCircle2, accent: "bg-success-50 text-success-600", trend: `${Math.round((passed / total) * 100)}% pass rate` },
  { id: "failed-tests", label: "Failed", value: failed, icon: XCircle, accent: "bg-danger-50 text-danger-600", trend: "2 new failures" },
  { id: "blocked-tests", label: "Blocked", value: blocked, icon: ShieldAlert, accent: "bg-warning-50 text-warning-600", trend: "Awaiting env fix" },
];

export default function SummaryCards() {
  return (
    <div
      id="summary-cards"
      data-testid="summary-cards"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {cards.map((card) => (
        <div
          key={card.id}
          id={`summary-card-${card.id}`}
          data-testid={`summary-card-${card.id}`}
          className="bg-white rounded-xl border border-slate-200 p-5 flex items-start justify-between"
        >
          <div>
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
            <p data-testid={`summary-card-${card.id}-value`} className="text-2xl font-bold text-slate-900 mt-1.5">
              {card.value}
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5">{card.trend}</p>
          </div>
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${card.accent}`}>
            <card.icon className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      ))}
    </div>
  );
}
