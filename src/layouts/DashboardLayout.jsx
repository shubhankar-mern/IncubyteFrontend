
import { Outlet } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace / ACME HR</div>
          <div className="topbar-actions">
            <div className="search-placeholder">
              <Search size={17} />
              <span>Search anything...</span>
              <kbd>⌘ K</kbd>
            </div>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
