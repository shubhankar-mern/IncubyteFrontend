
import { Outlet } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";


export default function DashboardLayout() {
  const { checkAuth } = useAuth();
const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    await checkAuth();
    navigate("/", { replace: true });
  }
};
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
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
