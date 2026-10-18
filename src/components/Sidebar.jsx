
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Building2,
  Settings,
  BriefcaseBusiness,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/compensation", label: "Compensation", icon: Wallet },
  { to: "/departments", label: "Departments", icon: Building2 },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <BriefcaseBusiness size={22} />
        </div>
        <div>
          <strong>ACME</strong>
          <span>People Management</span>
        </div>
      </div>

      <div className="nav-label">WORKSPACE</div>

      <nav className="nav-links">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="nav-label">PREFERENCES</div>
        <div className="nav-link muted">
          <Settings size={19} />
          <span>Settings</span>
        </div>

        <div className="profile">
          <div className="avatar">HR</div>
          <div>
            <strong>HR Manager</strong>
            <span>ACME Corporation</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
