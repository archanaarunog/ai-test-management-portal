import {
  LayoutDashboard,
  ListChecks,
  FileEdit,
  MessageSquareWarning,
  Sparkles,
  MousePointerClick,
  Globe,
  Layers,
  type LucideIcon,
} from "lucide-react";

export interface NavSection {
  key: string;
  label: string;
  path: string;
  icon: LucideIcon;
  description: string;
}

export const navSections: NavSection[] = [
  { key: "dashboard", label: "Dashboard", path: "/app/dashboard", icon: LayoutDashboard, description: "Overview & metrics" },
  { key: "tests", label: "Test Cases", path: "/app/tests", icon: ListChecks, description: "Search, filter, manage" },
  { key: "forms", label: "Forms", path: "/app/forms", icon: FileEdit, description: "Inputs & validation" },
  { key: "dialogs", label: "Dialogs & Alerts", path: "/app/dialogs", icon: MessageSquareWarning, description: "Modals & browser alerts" },
  { key: "dynamic", label: "Dynamic UI", path: "/app/dynamic", icon: Sparkles, description: "Loaders, tabs, accordions" },
  { key: "mouse", label: "Mouse Actions", path: "/app/mouse", icon: MousePointerClick, description: "Drag, hover, click" },
  { key: "browser", label: "Browser Interaction", path: "/app/browser", icon: Globe, description: "Tabs, windows, downloads" },
  { key: "advanced", label: "Advanced UI", path: "/app/advanced", icon: Layers, description: "iframe, keyboard, hidden" },
];
