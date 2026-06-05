import { useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { getUser } from "../services/auth";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function AddBlood() {
  const user = getUser();
  const [formData, setFormData] = useState({ blood_group: "A+", quantity: "" });
  const [message, setMessage] = useState("");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "hospital") {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await API.post("/blood-samples", {
        blood_group: formData.blood_group,
        quantity: Number(formData.quantity),
      });
      setMessage(response.data.message);
      setFormData({ blood_group: "A+", quantity: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to add blood sample");
    }
  };

  return (
    <>
      <Navbar />

      <main className="container app-shell auth-shell">
        <section className="auth-copy">
          <span className="eyebrow">Hospital inventory</span>
          <h1>Add verified blood sample availability.</h1>
          <p>
            Entries published here become visible on the public samples page
            immediately.
          </p>
        </section>

        <div className="form-panel">
          <div className="form-heading">
            <h2>Add Blood Info</h2>
            <p>Enter the available sample type and quantity.</p>
          </div>

          {message && <div className="alert app-alert">{message}</div>}

          <form onSubmit={handleSubmit}>
            <label className="form-label">Blood Group</label>
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

            <label className="form-label">Quantity</label>
            <input
              className="form-control mb-3"
              type="number"
              min="1"
              name="quantity"
              placeholder="Number of samples"
              value={formData.quantity}
              onChange={handleChange}
              required
            />

            <button className="primary-action w-100" type="submit">
              Save Blood Sample
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default AddBlood;
