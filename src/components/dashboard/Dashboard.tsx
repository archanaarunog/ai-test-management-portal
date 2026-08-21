import { useAuth } from "../../context/AuthContext";
import SummaryCards from "./SummaryCards";
import ChartsSection from "./ChartsSection";
import ActivityAndNotifications from "./ActivityAndNotifications";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div id="dashboard-page" data-testid="dashboard-page" className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-sm text-slate-500 mt-1">Here&apos;s what&apos;s happening across your test suites today.</p>
      </div>
      <SummaryCards />
      <ChartsSection />
      <ActivityAndNotifications />
    </div>
  );
}
