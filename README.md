# ACME Employee Salary Management System — Frontend

A React-based HR dashboard for managing employee information, compensation records, and workforce analytics for ACME.

## Overview

The frontend provides an interface for HR managers to manage employee records, view salary history, and analyze workforce data across departments and countries.

The application communicates with a Node.js/Express backend backed by PostgreSQL and Prisma ORM.

## Tech Stack

- **React** — UI development
- **Vite** — Development server and build tooling
- **React Router** — Client-side routing
- **Axios** — HTTP requests to the backend API
- **Recharts** — Analytics charts and data visualization
- **Lucide React** — Icons
- **JavaScript** — Application logic

## Core Features

### Employee Management
- View employee records in a paginated table.
- Search employees and filter by country or department.
- Create, view, edit, and delete employee records.
- View employee details, including department and employment information.

### Compensation Management
- View an employee's compensation history.
- Record salary changes with an effective date and currency.
- Track compensation records over time.

### HR Analytics
- View total employee and department counts.
- Analyze employee distribution by country.
- Analyze employee distribution by department.
- View payroll totals and average salaries grouped by currency.
- Explore salary revision trends over a selected period.

### User Experience
- Responsive dashboard layout.
- Loading and error states for API requests.
- Form validation and user feedback.
- Clear navigation between employee management and analytics.

## Project Structure

```text
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── index.html
├── package.json
└── README.md
```

## Backend API

The frontend communicates with the Express API.

Default local backend URL:

```text
http://localhost:3000/api
```

Main endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/employees` | List employees |
| POST | `/employees` | Create an employee |
| GET | `/employees/:id` | Get employee details |
| PUT/PATCH | `/employees/:id` | Update an employee |
| DELETE | `/employees/:id` | Delete an employee |
| GET | `/departments` | List departments |
| GET | `/hr` | List HR records |
| GET | `/compensation/:employeeId/history` | View compensation history |
| POST | `/compensation/:employeeId` | Record a salary change |
| GET | `/analytics/overview` | Workforce overview |
| GET | `/analytics/employees-by-country` | Country breakdown |
| GET | `/analytics/employees-by-department` | Department breakdown |
| GET | `/analytics/payroll` | Payroll analytics |
| GET | `/analytics/salary-trends` | Salary revision trends |

## Getting Started

### Prerequisites

- Node.js and npm
- The ACME backend running locally

### Installation

Install the frontend dependencies:

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Do not commit environment files containing private credentials.

### Run the Development Server

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

### Build for Production

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

## Development Notes

- Keep API communication inside the `src/services/` directory.
- Reuse components for tables, forms, loading states, and error messages.
- Keep page-level UI separate from reusable components.
- Use server-side pagination and filtering for employee lists.
- Format salary values according to their currency.
- Never combine payroll amounts across different currencies without an explicit currency conversion strategy.
- Handle empty states gracefully when no employees or compensation records exist.
- Do not expose salary or employee data without appropriate backend authentication and authorization.

## Data and Testing

The backend includes synthetic seed data for testing workforce analytics and employee management at a scale of approximately 10,000 employees.

Verify that the backend is running and seeded before testing analytics pages.

## Scope

This frontend is part of the ACME Employee Salary Management System assessment. It is designed to demonstrate employee management, compensation tracking, workforce analytics, and a maintainable React application architecture.
