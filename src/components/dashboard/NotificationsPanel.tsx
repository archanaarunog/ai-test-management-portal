import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { mockNotifications } from "../../data/mockActivity";
import type { NotificationType } from "../../types";

const iconMap: Record<NotificationType, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "text-success-600" },
  error: { icon: XCircle, className: "text-danger-600" },
  warning: { icon: AlertTriangle, className: "text-warning-600" },
  info: { icon: Info, className: "text-info-600" },
};

export default function NotificationsPanel({ onClose }: { onClose: () => void }) {
  return (
    <div
      id="notifications-panel"
      data-testid="notifications-panel"
      role="region"
      aria-label="Notifications"
      className="absolute right-0 mt-2 w-80 max-h-[26rem] overflow-y-auto scrollbar-thin bg-white rounded-xl shadow-lg border border-slate-200 z-40"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 sticky top-0 bg-white">
        <p className="text-sm font-semibold text-slate-800">Notifications</p>
        <button
          type="button"
          id="notifications-panel-close-button"
          data-testid="notifications-panel-close-button"
          aria-label="Close notifications panel"
          onClick={onClose}
          className="text-xs text-brand-600 hover:text-brand-700 font-medium"
        >
          Close
        </button>
      </div>
      <ul>
        {mockNotifications.map((n) => {
          const { icon: Icon, className } = iconMap[n.type];
          return (
            <li
              key={n.id}
              data-testid={`notification-item-${n.id}`}
              className={`flex gap-3 px-4 py-3 border-b border-slate-50 last:border-0 ${!n.read ? "bg-brand-50/40" : ""}`}
            >
              <Icon className={`h-4.5 w-4.5 mt-0.5 shrink-0 ${className}`} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">{n.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                <p className="text-[11px] text-slate-400 mt-1">{n.timestamp}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
