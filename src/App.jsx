
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Compensation from "./pages/Compensation";
import Departments from "./pages/Departments";

function ComingSoon({ title }) {
  return (
    <div className="panel coming-soon">
      <h1>{title}</h1>
      <p>This section will be implemented next.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
         <Route path="compensation" element={<Compensation />} />
        <Route path="departments" element={<Departments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
