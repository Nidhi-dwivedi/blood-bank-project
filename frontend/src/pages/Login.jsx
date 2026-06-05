import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { saveAuth } from "../services/auth";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await API.post("/login", formData);
      saveAuth(response.data.token, response.data.user);
      navigate(response.data.user.role === "hospital" ? "/add-blood" : "/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to login");
    }
  };

  return (
    <>
      <Navbar />

      <main className="container app-shell auth-shell">
        <section className="auth-copy">
          <span className="eyebrow">Secure access</span>
          <h1>Manage hospital inventory and blood requests.</h1>
          <p>
            Login routes users to the right workflow based on their role:
            hospitals manage stock, receivers request compatible samples.
          </p>
        </section>

        <div className="form-panel">
          <div className="form-heading">
            <h2>Login</h2>
            <p>Use your registered hospital or receiver account.</p>
          </div>

          {message && <div className="alert alert-danger">{message}</div>}

          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-3"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              className="form-control mb-3"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button className="primary-action w-100" type="submit">
              Login
            </button>
          </form>

          <div className="mt-3 small">
            New here? <Link to="/register/receiver">Register as receiver</Link> or{" "}
            <Link to="/register/hospital">hospital</Link>.
          </div>
        </div>
      </main>
    </>
  );
}

export default Login;
