import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { ModuleCoverage, TrendPoint } from "../../types";

export default function ChartsSection() {
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [moduleCoverage, setModuleCoverage] = useState<ModuleCoverage[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<{name:string;value:number;color:string}[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { Promise.all([api.dashboard.trends(), api.dashboard.moduleCoverage(), api.dashboard.statusDistribution()]).then(([t,m,s]) => { setTrendData(t); setModuleCoverage(m); setStatusDistribution(s); }).catch(e => setError(e.message)); }, []);
  return (
    <div id="charts-section" data-testid="charts-section" className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {error && <p role="alert" className="col-span-full text-sm text-red-700">Could not load dashboard charts: {error}</p>}
      <div
        id="execution-trend-chart"
        data-testid="execution-trend-chart"
        className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5"
      >
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Execution Trend (Last 8 Days)</h3>
        <p className="text-xs text-slate-400 mb-4">Daily pass / fail / blocked counts</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trendData} margin={{ left: -18, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: "1px solid #e2e8f0" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="passed" name="Passed" stroke="#16a34a" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="failed" name="Failed" stroke="#dc2626" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="blocked" name="Blocked" stroke="#d97706" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        id="status-distribution-chart"
        data-testid="status-distribution-chart"
        className="bg-white rounded-xl border border-slate-200 p-5"
      >
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Status Distribution</h3>
        <p className="text-xs text-slate-400 mb-2">Across all active test cases</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={statusDistribution} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={2}>
              {statusDistribution.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: "1px solid #e2e8f0" }} />
          </PieChart>
        </ResponsiveContainer>
        <ul className="grid grid-cols-2 gap-1.5 mt-2">
          {statusDistribution.map((s) => (
            <li key={s.name} className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.name} ({s.value})
            </li>
          ))}
        </ul>
      </div>

      <div
        id="module-coverage-chart"
        data-testid="module-coverage-chart"
        className="xl:col-span-3 bg-white rounded-xl border border-slate-200 p-5"
      >
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Coverage by Module</h3>
        <p className="text-xs text-slate-400 mb-4">Percentage of requirements covered by automated tests</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={moduleCoverage} margin={{ left: -18, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="module" tick={{ fontSize: 10.5, fill: "#94a3b8" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} interval={0} angle={-15} textAnchor="end" height={55} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: "1px solid #e2e8f0" }} />
            <Bar dataKey="coverage" name="Coverage %" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
