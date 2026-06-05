import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function RegisterHospital() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await API.post("/register-hospital", formData);
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 700);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to register hospital"
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="container app-shell auth-shell">
        <section className="auth-copy">
          <span className="eyebrow">Hospital onboarding</span>
          <h1>Create an account to publish available blood samples.</h1>
          <p>
            Hospital accounts can add inventory and view receiver requests for
            their own blood bank only.
          </p>
        </section>

        <div className="form-panel">
          <div className="form-heading">
            <h2>Hospital Registration</h2>
            <p>Register with a unique hospital email address.</p>
          </div>

          {message && <div className="alert app-alert">{message}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Hospital Name"
              className="form-control mb-3"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control mb-3"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control mb-3"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="primary-action w-100">
              Register Hospital
            </button>
          </form>

          <div className="mt-3 small">
            Already registered? <Link to="/login">Login</Link>.
          </div>
        </div>
      </main>
    </>
  );
}

export default RegisterHospital;
