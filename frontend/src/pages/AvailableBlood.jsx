import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { getUser } from "../services/auth";

const compatibleDonors = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  "AB-": ["A-", "B-", "AB-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"],
};

function AvailableBlood() {
  const navigate = useNavigate();
  const user = getUser();
  const [samples, setSamples] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSamples = async () => {
      try {
        const response = await API.get("/blood-samples");

        if (active) {
          setSamples(response.data.samples || []);
        }
      } catch {
        if (active) {
          setMessage("Unable to load blood samples");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSamples();

    return () => {
      active = false;
    };
  }, []);

  const isEligible = (sample) => {
    if (user?.role !== "receiver") {
      return false;
    }

    return compatibleDonors[user.blood_group]?.includes(sample.blood_group);
  };

  const requestSample = async (sample) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "receiver") {
      setMessage("Hospitals cannot request blood samples");
      return;
    }

    if (!isEligible(sample)) {
      setMessage("Your blood group is not eligible for this sample");
      return;
    }

    try {
      const response = await API.post(`/blood-samples/${sample.id}/request`);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to request sample");
    }
  };

  const buttonText = (sample) => {
    if (!user) return "Login to Request";
    if (user.role === "hospital") return "Receiver Only";
    if (!isEligible(sample)) return "Not Eligible";
    return "Request Sample";
  };

  const totalUnits = samples.reduce(
    (total, sample) => total + Number(sample.quantity || 0),
    0
  );
  const hospitals = new Set(samples.map((sample) => sample.hospital_id)).size;
  const eligibleSamples = user?.role === "receiver"
    ? samples.filter((sample) => isEligible(sample)).length
    : 0;

  return (
    <>
      <Navbar />

      <main className="container app-shell">
        <div className="hero-panel">
          <div>
            <span className="eyebrow">Live inventory</span>
            <h1>Available Blood Samples</h1>
            <p>
              Search-ready inventory from registered hospitals, with request
              access controlled by user role and blood group compatibility.
            </p>
          </div>
          <div className="hero-meter" aria-hidden="true">
            <span>{samples.length}</span>
            <small>active entries</small>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <span>Total units</span>
            <strong>{totalUnits}</strong>
          </div>
          <div className="metric-card">
            <span>Hospitals</span>
            <strong>{hospitals}</strong>
          </div>
          <div className="metric-card">
            <span>{user?.role === "receiver" ? "Eligible for you" : "Blood groups"}</span>
            <strong>
              {user?.role === "receiver"
                ? eligibleSamples
                : new Set(samples.map((sample) => sample.blood_group)).size}
            </strong>
          </div>
        </div>

        {message && <div className="alert app-alert">{message}</div>}

        <div className="table-responsive surface">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Blood Group</th>
                <th>Quantity</th>
                <th>Hospital</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="4" className="empty-state">
                    Loading samples...
                  </td>
                </tr>
              )}

              {!loading && samples.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-state">
                    No blood samples available yet.
                  </td>
                </tr>
              )}

              {samples.map((sample) => (
                <tr key={sample.id}>
                  <td>
                    <span className="blood-badge">{sample.blood_group}</span>
                  </td>
                  <td>{sample.quantity}</td>
                  <td>{sample.hospital_name}</td>
                  <td>
                    <button
                      className="action-button"
                      disabled={Boolean(user) && !isEligible(sample)}
                      onClick={() => requestSample(sample)}
                    >
                      {buttonText(sample)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

export default AvailableBlood;
