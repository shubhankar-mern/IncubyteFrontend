
import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  Globe2,
  Wallet,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../services/api";
import StatCard from "../components/StatCard";

const CHART_COLORS = [
  "#5B5BD6",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#0EA5E9",
  "#8B5CF6",
  "#F97316",
  "#64748B",
];

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [countries, setCountries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [overviewRes, countriesRes, departmentsRes, payrollRes] =
          await Promise.all([
            api.get("/analytics/overview"),
            api.get("/analytics/employees-by-country"),
            api.get("/analytics/employees-by-department"),
            api.get("/analytics/payroll"),
          ]);

        setOverview(overviewRes.data);
        setCountries(countriesRes.data);
        setDepartments(departmentsRes.data);
        setPayroll(payrollRes.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load dashboard. Check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="state-message">Loading your HR dashboard...</div>;
  }

  if (error) {
    return (
      <div className="error-banner">
        <strong>Dashboard unavailable</strong>
        <p>{error}</p>
        <button
          className="button-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const currencyFormatter = (currency) =>
    new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">OVERVIEW</div>
          <h1>HR Dashboard</h1>
          <p>Here's what's happening across your workforce.</p>
        </div>
        <div className="date-pill">
          {new Date().toLocaleDateString("en", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      <section className="stats-grid">
        <StatCard
          title="Total Employees"
          value={overview?.totalEmployees?.toLocaleString() ?? "—"}
          subtitle="Across all locations"
          icon={Users}
        />
        <StatCard
          title="Departments"
          value={overview?.totalDepartments ?? "—"}
          subtitle="Organizational units"
          icon={Building2}
        />
        <StatCard
          title="Countries"
          value={overview?.totalCountries ?? "—"}
          subtitle="Global workforce"
          icon={Globe2}
        />
        <StatCard
          title="Payroll Currencies"
          value={payroll.length}
          subtitle="Reported separately"
          icon={Wallet}
        />
      </section>

      <section className="charts-grid">
        <div className="panel department-panel">
          <div className="panel-heading">
            <div>
              <h2>Employees by Department</h2>
              <p>Workforce distribution across teams</p>
            </div>
          </div>

          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departments}
                margin={{ top: 10, right: 8, left: -18, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E8EAF0"
                />
                <XAxis
                  dataKey="departmentName"
                  tick={{ fontSize: 11, fill: "#73788C" }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={55}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#73788C" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Bar
                  dataKey="employeeCount"
                  name="Employees"
                  fill="#5B5BD6"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel country-panel">
          <div className="panel-heading">
            <div>
              <h2>Employees by Country</h2>
              <p>Global workforce distribution</p>
            </div>
          </div>

          <div className="chart-area pie-area">
            {countries.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={countries}
                    dataKey="employeeCount"
                    nameKey="country"
                    cx="50%"
                    cy="50%"
                    innerRadius={64}
                    outerRadius={96}
                    paddingAngle={3}
                  >
                    {countries.map((item, index) => (
                      <Cell
                        key={item.country}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">No country data yet.</div>
            )}
          </div>

          <div className="legend-list">
            {countries.map((item, index) => (
              <div className="legend-item" key={item.country}>
                <span
                  className="legend-dot"
                  style={{
                    background:
                      CHART_COLORS[index % CHART_COLORS.length],
                  }}
                />
                <span className="legend-name">{item.country}</span>
                <strong>
                  {item.employeeCount.toLocaleString()}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel payroll-panel">
        <div className="panel-heading">
          <div>
            <h2>Payroll Summary</h2>
            <p>Current compensation grouped by currency</p>
          </div>
        </div>

        {payroll.length ? (
          <div className="payroll-grid">
            {payroll.map((item) => (
              <div className="payroll-card" key={item.currency}>
                <div className="payroll-currency">
                  {item.currency}
                </div>
                <div className="payroll-total">
                  {currencyFormatter(item.currency).format(
                    item.totalPayroll
                  )}
                </div>
                <div className="payroll-meta">
                  {item.employeeCount.toLocaleString()} employees
                </div>
                <div className="payroll-average">
                  Average salary:{" "}
                  {currencyFormatter(item.currency).format(
                    item.averageSalary
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No compensation records are available.
          </div>
        )}
      </section>
    </>
  );
}
