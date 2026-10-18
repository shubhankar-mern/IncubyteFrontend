
import { useEffect, useState } from "react";
import { Building2, Plus, Users, X } from "lucide-react";
import api from "../services/api";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadDepartments() {
    setLoading(true);
    setError("");

    try {
      const [departmentsResponse, countsResponse] = await Promise.all([
        api.get("/departments"),
        api.get("/analytics/employees-by-department"),
      ]);

      const rawDepartments = departmentsResponse.data;
      const list = Array.isArray(rawDepartments)
        ? rawDepartments
        : rawDepartments.departments ?? rawDepartments.data ?? [];

      const rawCounts = countsResponse.data;
      const counts = Array.isArray(rawCounts) ? rawCounts : [];

      const countMap = new Map(
        counts.map((item) => [
          item.departmentId,
          item.employeeCount,
        ])
      );

      setDepartments(
        list.map((department) => ({
          ...department,
          employeeCount: countMap.get(department.id) ?? 0,
        }))
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load departments."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  async function createDepartment(event) {
    event.preventDefault();

    if (!name.trim()) return;

    setSaving(true);
    setError("");

    try {
      await api.post("/departments", { name: name.trim() });
      setName("");
      setShowForm(false);
      await loadDepartments();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create department."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">ORGANIZATION</div>
          <h1>Departments</h1>
          <p>Manage ACME's organizational teams.</p>
        </div>

        <button
          className="button-primary"
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} /> New Department
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            Total Departments
            <Building2 size={19} />
          </div>
          <div className="stat-value">{departments.length}</div>
          <div className="stat-subtitle">Organizational units</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            Employees Assigned
            <Users size={19} />
          </div>
          <div className="stat-value">
            {departments.reduce(
              (total, department) => total + department.employeeCount,
              0
            ).toLocaleString()}
          </div>
          <div className="stat-subtitle">Across listed departments</div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>All Departments</h2>
            <p>Department directory and headcount</p>
          </div>
        </div>

        {loading ? (
          <div className="state-message">Loading departments...</div>
        ) : departments.length === 0 ? (
          <div className="empty-state">No departments found.</div>
        ) : (
          <div className="department-grid">
            {departments.map((department) => (
              <article className="department-card" key={department.id}>
                <div className="department-card-icon">
                  <Building2 size={21} />
                </div>
                <h3>{department.name}</h3>
                <p>{department.employeeCount.toLocaleString()} employees</p>
                <div className="department-card-footer">
                  <span>Department ID</span>
                  <code>{department.id.slice(0, 12)}…</code>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showForm && (
        <div
          className="modal-backdrop"
          onClick={() => setShowForm(false)}
        >
          <form
            className="modal"
            onSubmit={createDepartment}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowForm(false)}
            >
              <X size={16} />
            </button>

            <h2>New Department</h2>
            <p>Create a department for the ACME organization.</p>

            <label className="form-label" htmlFor="department-name">
              Department name
            </label>
            <input
              id="department-name"
              className="form-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Product"
              required
              maxLength={100}
            />

            <button
              className="button-primary form-submit"
              type="submit"
              disabled={saving}
            >
              {saving ? "Creating..." : "Create Department"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
