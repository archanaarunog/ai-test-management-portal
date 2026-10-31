import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { NotificationItem, NotificationType } from "../../types";

const iconMap: Record<NotificationType, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "text-success-600" },
  error: { icon: XCircle, className: "text-danger-600" },
  warning: { icon: AlertTriangle, className: "text-warning-600" },
  info: { icon: Info, className: "text-info-600" },
};

export default function NotificationsPanel({ onClose, onUnreadChange }: { onClose: () => void; onUnreadChange: (count: number) => void }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { api.notifications.list().then(rows => { setNotifications(rows); onUnreadChange(rows.filter(n => !n.read).length); }).catch(e => setError(e.message)); }, [onUnreadChange]);
  const markRead = async (n: NotificationItem) => {
    if (n.read) return;
    try { await api.notifications.markRead(n.id); setNotifications(rows => rows.map(row => row.id === n.id ? { ...row, read: true } : row)); onUnreadChange(notifications.filter(row => !row.read && row.id !== n.id).length); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not update notification"); }
  };
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
      {error && <p role="alert" className="px-4 py-2 text-xs text-red-700">{error}</p>}
      <ul>
        {notifications.map((n) => {
          const { icon: Icon, className } = iconMap[n.type];
          return (
            <li
              key={n.id}
              data-testid={`notification-item-${n.id}`}
              onClick={() => void markRead(n)} role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") void markRead(n); }}
              className={`flex gap-3 px-4 py-3 border-b border-slate-50 last:border-0 cursor-pointer ${!n.read ? "bg-brand-50/40" : ""}`}
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
