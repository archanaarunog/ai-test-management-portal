import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <Header onToggleSidebar={() => setSidebarOpen((s) => !s)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main
          id="main-content"
          data-testid="main-content"
          className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-5"
        >
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
