
export default function EmployeeTable({ employees, loading, onSelect }) {
  if (loading) {
    return <div className="state-message">Loading employees...</div>;
  }

  if (!employees.length) {
    return <div className="empty-state">No employees found.</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Employee ID</th>
            <th>Department</th>
            <th>Country</th>
            <th>Currency</th>
            <th>Joined</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <div className="employee-name">
                  <div className="avatar employee-avatar">
                    {employee.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <strong>{employee.name}</strong>
                    <span>{employee.country}</span>
                  </div>
                </div>
              </td>
              <td>{employee.id}</td>
              <td>{employee.departmentId ?? "—"}</td>
              <td>{employee.country}</td>
              <td>{employee.currency}</td>
              <td>
                {new Date(employee.dateOfJoining).toLocaleDateString()}
              </td>
              <td>
                <button
                  className="text-button"
                  onClick={() => onSelect(employee)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
