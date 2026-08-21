import { useState, useRef, useEffect } from "react";
import { Bell, Menu, ShieldCheck, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { mockNotifications } from "../../data/mockActivity";
import NotificationsPanel from "../dashboard/NotificationsPanel";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      id="app-header"
      data-testid="app-header"
      className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          id="sidebar-toggle-button"
          data-testid="sidebar-toggle-button"
          aria-label="Toggle sidebar navigation"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-700 flex items-center justify-center">
            <ShieldCheck className="h-4.5 w-4.5 text-white" aria-hidden="true" />
          </div>
          <span className="font-semibold text-slate-800 hidden sm:inline">AI Test Management Portal</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            id="notifications-bell-button"
            data-testid="notifications-bell-button"
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-haspopup="true"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((s) => !s)}
            className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span
                data-testid="notifications-unread-badge"
                className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 min-w-[18px] px-0.5 rounded-full bg-danger-600 text-white text-[10px] font-bold flex items-center justify-center"
              >
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            id="user-profile-dropdown-trigger"
            data-testid="user-profile-dropdown-trigger"
            aria-label="Open user profile menu"
            aria-haspopup="true"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((s) => !s)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100"
          >
            <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
              {user?.avatarInitials}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-sm font-medium text-slate-700">{user?.name}</p>
              <p className="text-[11px] text-slate-400">{user?.role}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" aria-hidden="true" />
          </button>

          {profileOpen && (
            <div
              id="user-profile-dropdown-menu"
              data-testid="user-profile-dropdown-menu"
              role="menu"
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-40"
            >
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
              <button
                type="button"
                id="profile-menu-item"
                data-testid="profile-menu-item"
                role="menuitem"
                className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <User className="h-4 w-4" aria-hidden="true" /> My Profile
              </button>
              <button
                type="button"
                id="settings-menu-item"
                data-testid="settings-menu-item"
                role="menuitem"
                className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <Settings className="h-4 w-4" aria-hidden="true" /> Settings
              </button>
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  type="button"
                  id="logout-menu-item"
                  data-testid="logout-menu-item"
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-danger-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
