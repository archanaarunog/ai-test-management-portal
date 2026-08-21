import { CheckCircle2, XCircle, ShieldAlert, Clock, CheckCircle2 as InfoCheck, AlertTriangle, Info } from "lucide-react";
import { mockActivity, mockNotifications } from "../../data/mockActivity";
import type { NotificationType } from "../../types";

const statusIcon: Record<string, { icon: typeof CheckCircle2; className: string }> = {
  Passed: { icon: CheckCircle2, className: "text-success-600 bg-success-50" },
  Failed: { icon: XCircle, className: "text-danger-600 bg-danger-50" },
  Blocked: { icon: ShieldAlert, className: "text-warning-600 bg-warning-50" },
  "In Progress": { icon: Clock, className: "text-info-600 bg-info-50" },
  Info: { icon: InfoCheck, className: "text-slate-500 bg-slate-100" },
};

const notifIcon: Record<NotificationType, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "text-success-600" },
  error: { icon: XCircle, className: "text-danger-600" },
  warning: { icon: AlertTriangle, className: "text-warning-600" },
  info: { icon: Info, className: "text-info-600" },
};

export default function ActivityAndNotifications() {
  return (
    <div id="dashboard-activity-notifications" className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <section
        id="recent-activity-panel"
        data-testid="recent-activity-panel"
        aria-label="Recent activity"
        className="bg-white rounded-xl border border-slate-200 p-5"
      >
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Recent Activity</h3>
        <ul className="space-y-4" id="recent-activity-list" data-testid="recent-activity-list">
          {mockActivity.map((item) => {
            const conf = statusIcon[item.status] ?? statusIcon.Info;
            return (
              <li key={item.id} data-testid={`activity-item-${item.id}`} className="flex gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${conf.className}`}>
                  <conf.icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">{item.actor}</span> {item.action}{" "}
                    <span className="text-slate-500">{item.target}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.timestamp}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        id="dashboard-notifications-panel"
        data-testid="dashboard-notifications-panel"
        aria-label="Notifications"
        className="bg-white rounded-xl border border-slate-200 p-5"
      >
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Notifications</h3>
        <ul className="space-y-4" id="dashboard-notifications-list" data-testid="dashboard-notifications-list">
          {mockNotifications.map((n) => {
            const conf = notifIcon[n.type];
            return (
              <li key={n.id} data-testid={`dashboard-notification-${n.id}`} className="flex gap-3">
                <conf.icon className={`h-4.5 w-4.5 mt-0.5 shrink-0 ${conf.className}`} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{n.timestamp}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
