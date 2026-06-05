import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function RegisterReceiver() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    blood_group: "A+",
  });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await API.post("/register-receiver", formData);
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 700);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to register receiver"
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="container app-shell auth-shell">
        <section className="auth-copy">
          <span className="eyebrow">Receiver onboarding</span>
          <h1>Register once and request compatible blood samples.</h1>
          <p>
            Your blood group is saved during registration and used to prevent
            incompatible sample requests.
          </p>
        </section>

        <div className="form-panel">
          <div className="form-heading">
            <h2>Receiver Registration</h2>
            <p>Choose the blood group exactly as shown on medical records.</p>
          </div>

          {message && <div className="alert app-alert">{message}</div>}

          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-3"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              className="form-control mb-3"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              className="form-control mb-3"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <select
              className="form-select mb-3"
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
            >
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>

            <button className="primary-action w-100" type="submit">
              Register Receiver
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

export default RegisterReceiver;
