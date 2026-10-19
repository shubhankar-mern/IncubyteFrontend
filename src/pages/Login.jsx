
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!email.trim() || !password) {
    setError("Please enter your email and password.");
    return;
  }

  try {
    console.log("Submitting login:", email);
    console.log("API URL:", api.defaults.baseURL);

    const response = await api.post("/auth/login", {
      email: email.trim(),
      password,
    });

    console.log("Login status:", response.status);
    console.log("Login data:", response.data);
    if(response.status === 200 && response.data.hr){
      await checkAuth();
      navigate("/dashboard");
    }else{
        navigate("/");
    }

     
    
  
  } catch (err) {
    console.error("Login error:", err);
    console.error("Response:", err.response);
    console.error("Request:", err.request);

    setError(
      err.response?.data?.message ||
      (err.request
        ? "Server did not respond. Check the Network tab and backend."
        : err.message || "Login failed.")
    );
  }
};


  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <div className="brand-icon">A</div>
          <span>ACME</span>
        </div>

        <h1>Welcome back</h1>
        <p className="subtitle">
          Sign in to manage employee salaries.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Work email</label>
            <input
              id="email"
              type="email"
              placeholder="you@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="/forgot-password">Forgot password?</a>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">
            Sign in
          </button>
        </form>

        <p className="login-footer">
          Need access? Contact your system administrator.
        </p>
      </div>
    </div>
  );
}
