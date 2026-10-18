
import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import api from "../services/api";
import EmployeeTable from "../components/EmployeeTable";

const PAGE_SIZE = 25;

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

 useEffect(() => {
  api.get("/departments")
    .then((response) => {
      const data = response.data;

      const departmentList = Array.isArray(data)
        ? data
        : data.departments ??
          data.data ??
          data.results ??
          [];

      setDepartments(
        Array.isArray(departmentList) ? departmentList : []
      );
    })
    .catch((error) => {
      console.error("Failed to load departments:", error);
      setError("Unable to load departments.");
      setDepartments([]);
    });
}, []);

  useEffect(() => {
    let cancelled = false;

    async function loadEmployees() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/employees", {
          params: {
            page,
            limit: PAGE_SIZE,
            ...(search ? { search } : {}),
            ...(country ? { country } : {}),
            ...(departmentId ? { departmentId } : {}),
          },
        });

        if (cancelled) return;

        // Supports either a paginated object or a plain array.
        const data = response.data;

setEmployees(Array.isArray(data.data) ? data.data : []);
setTotal(data.pagination?.total ?? 0);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Unable to load employees."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadEmployees();

    return () => {
      cancelled = true;
    };
  }, [page, search, country, departmentId]);

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">PEOPLE</div>
          <h1>Employees</h1>
          <p>Manage employee records across ACME.</p>
        </div>
        <div className="employee-count">
          <Users size={18} />
          {total.toLocaleString()} records
        </div>
      </div>

      <section className="panel employee-panel">
        <div className="employee-toolbar">
          <div className="search-input">
            <Search size={18} />
            <input
              placeholder="Search name or employee ID..."
              value={search}
              onChange={(event) =>
                updateFilter(setSearch, event.target.value)
              }
            />
          </div>

          <select
            value={country}
            onChange={(event) =>
              updateFilter(setCountry, event.target.value)
            }
          >
            <option value="">All countries</option>
            {["India", "United States", "United Kingdom", "Germany", "Canada", "Australia"].map(
              (name) => (
                <option key={name} value={name}>{name}</option>
              )
            )}
          </select>

          <select
            value={departmentId}
            onChange={(event) =>
              updateFilter(setDepartmentId, event.target.value)
            }
          >
            <option value="">All departments</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <EmployeeTable
          employees={employees}
          loading={loading}
          onSelect={setSelected}
        />

        <div className="pagination">
          <span>
            Page {page} {total ? `· ${total.toLocaleString()} employees` : ""}
          </span>
          <div>
            <button
              className="button-secondary"
              disabled={page === 1 || loading}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </button>
            <button
              className="button-secondary"
              disabled={loading || page * PAGE_SIZE >= total}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
            <h2>{selected.name}</h2>
            <p>{selected.employeeNumber}</p>
            <div className="detail-list">
              <div><span>Country</span><strong>{selected.country}</strong></div>
              <div><span>Department</span><strong>{selected.department?.name ?? "—"}</strong></div>
              <div><span>Currency</span><strong>{selected.currency}</strong></div>
              <div>
                <span>Date joined</span>
                <strong>{new Date(selected.dateOfJoining).toLocaleDateString()}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
