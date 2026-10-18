
import { useState } from "react";
import { History, Search, Wallet } from "lucide-react";
import api from "../services/api";

export default function Compensation() {
  const [employeeId, setEmployeeId] = useState("");
  const [employee, setEmployee] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [salary, setSalary] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  async function searchEmployee(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setEmployee(null);
    setHistory([]);

    try {
      const response = await api.get(
        `/employees/${encodeURIComponent(employeeId.trim())}`
      );

      const result = response.data.employee ?? response.data;
      setEmployee(result);
      setCurrency(result.currency || "INR");

      const historyResponse = await api.get(
        `/compensation/${encodeURIComponent(employeeId.trim())}/history`
      );

      const rawHistory = historyResponse.data;
      const records = Array.isArray(rawHistory)
        ? rawHistory
        : rawHistory.records ?? rawHistory.data ?? [];

      setHistory(records);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to find this employee or load compensation history."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateSalary(event) {
    event.preventDefault();

    if (!employee) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.post(
        `/compensation/${encodeURIComponent(employee.id)}`,
        {
          salary: Number(salary),
          currency,
          effectiveDate: `${effectiveDate}T00:00:00.000Z`,
        }
      );

      setSalary("");
      setSuccess("Compensation record created.");
      await searchEmployee({
        preventDefault() {},
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update compensation."
      );
    } finally {
      setSaving(false);
    }
  }

  function formatMoney(amount, code) {
    try {
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency: code,
        maximumFractionDigits: 2,
      }).format(Number(amount));
    } catch {
      return `${code} ${amount}`;
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">PAY & BENEFITS</div>
          <h1>Compensation</h1>
          <p>Review salary history and record compensation changes.</p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && (
        <div className="success-banner">{success}</div>
      )}

      <section className="panel compensation-search-panel">
        <div className="panel-heading">
          <div>
            <h2>Find an employee</h2>
            <p>Enter the employee's database ID to view compensation.</p>
          </div>
          <Search size={20} />
        </div>

        <form className="compensation-search" onSubmit={searchEmployee}>
          <input
            className="form-input"
            value={employeeId}
            onChange={(event) => setEmployeeId(event.target.value)}
            placeholder="Paste employee database ID"
            required
          />
          <button
            type="submit"
            className="button-primary"
            disabled={loading}
          >
            {loading ? "Searching..." : "Find Employee"}
          </button>
        </form>
      </section>

      {employee && (
        <>
          <section className="panel compensation-employee">
            <div className="compensation-avatar">
              <Wallet size={23} />
            </div>
            <div className="compensation-employee-info">
              <h2>{employee.name}</h2>
              <p>
                {employee.employeeNumber || employee.id}
                {" · "}
                {employee.department?.name || "Department not provided"}
              </p>
            </div>
            <div className="compensation-current">
              <span>Current salary</span>
              <strong>
                {employee.currentSalary != null
                  ? formatMoney(employee.currentSalary, employee.currency || currency)
                  : history[0]
                    ? formatMoney(history[0].salary, history[0].currency)
                    : "Not recorded"}
              </strong>
            </div>
          </section>

          <section className="panel compensation-form-panel">
            <div className="panel-heading">
              <div>
                <h2>Record salary change</h2>
                <p>Add a new compensation record with its effective date.</p>
              </div>
            </div>

            <form className="salary-form" onSubmit={updateSalary}>
              <div className="form-field">
                <label className="form-label" htmlFor="salary">
                  Annual salary
                </label>
                <input
                  id="salary"
                  className="form-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={salary}
                  onChange={(event) => setSalary(event.target.value)}
                  placeholder="e.g. 1200000"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="currency">
                  Currency
                </label>
                <select
                  id="currency"
                  className="form-input"
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                >
                  {["INR", "USD", "GBP", "EUR", "CAD", "AUD"].map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="effective-date">
                  Effective date
                </label>
                <input
                  id="effective-date"
                  className="form-input"
                  type="date"
                  value={effectiveDate}
                  onChange={(event) => setEffectiveDate(event.target.value)}
                  required
                />
              </div>

              <button
                className="button-primary salary-submit"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Compensation"}
              </button>
            </form>
          </section>

          <section className="panel compensation-history-panel">
            <div className="panel-heading">
              <div>
                <h2>Compensation History</h2>
                <p>Salary records for {employee.name}</p>
              </div>
              <History size={20} />
            </div>

            {history.length === 0 ? (
              <div className="empty-state">
                No compensation history found.
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="employee-table">
                  <thead>
                    <tr>
                      <th>Effective Date</th>
                      <th>Salary</th>
                      <th>Currency</th>
                      <th>Recorded At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => (
                      <tr key={record.id}>
                        <td>
                          {new Date(record.effectiveDate).toLocaleDateString()}
                        </td>
                        <td>
                          <strong>
                            {formatMoney(record.salary, record.currency)}
                          </strong>
                        </td>
                        <td>{record.currency}</td>
                        <td>
                          {record.createdAt
                            ? new Date(record.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}
