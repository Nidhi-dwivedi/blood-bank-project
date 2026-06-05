import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { getUser } from "../services/auth";

function ViewRequests() {
  const user = getUser();
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(user?.role === "hospital");

  useEffect(() => {
    if (user?.role !== "hospital") {
      return;
    }

    let active = true;

    const loadRequests = async () => {
      try {
        const response = await API.get("/hospital/requests");

        if (active) {
          setRequests(response.data.requests || []);
        }
      } catch (error) {
        if (active) {
          setMessage(error.response?.data?.message || "Unable to load requests");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadRequests();

    return () => {
      active = false;
    };
  }, [user?.role]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "hospital") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />

      <main className="container app-shell">
        <div className="hero-panel compact">
          <div>
            <span className="eyebrow">Hospital requests</span>
            <h1>Blood Sample Requests</h1>
            <p>Requests shown here belong only to your hospital.</p>
          </div>
          <div className="hero-meter" aria-hidden="true">
            <span>{requests.length}</span>
            <small>requests</small>
          </div>
        </div>

        {message && <div className="alert alert-danger">{message}</div>}

        <div className="table-responsive surface">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Requested Group</th>
                <th>Receiver</th>
                <th>Receiver Group</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="5" className="empty-state">
                    Loading requests...
                  </td>
                </tr>
              )}

              {!loading && requests.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No requests received yet.
                  </td>
                </tr>
              )}

              {requests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <span className="blood-badge">{request.blood_group}</span>
                  </td>
                  <td>{request.receiver_name}</td>
                  <td>{request.receiver_blood_group}</td>
                  <td>{request.receiver_email}</td>
                  <td>
                    <span className="status-pill">{request.status}</span>
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

export default ViewRequests;
